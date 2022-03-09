<template>
  <div>
    <div>
      メンバー登録
      <div>
        <span for="player_name">プレイヤー名</span>
        <input name="player_name" type="text" v-model="player_name" />
      </div>
      <div>
        <span for="members_name">キャラ名</span>
        <input name="members_name" type="text" v-model="members_name" />
      </div>
      <div>
        <span for="members_rank">ランク</span>
        <input name="members_rank" type="text" v-model="members_rank" />
      </div>
      <div>
        <span for="members_password">パスワード</span>
        <input name="members_password" type="text" v-model="members_password" />
      </div>
      <div>
        <button @click="register_to_members()">登録</button>
      </div>
    </div>
    <div>
      レイドメンバー登録
      <div>
        <span for="team_name">チーム名</span>
        <input name="team_name" type="text" v-model="team_name" />
      </div>
      <div>
        <span for="game_name">キャラ名</span>
        <input name="game_name" type="text" v-model="game_name" />
      </div>
      <div>
        <span for="game_name">ディスコ名</span>
        <input name="jp_name" type="text" v-model="jp_name" />
      </div>
      <div>
        <span for="game_name">ジョブ</span>
        <input name="job" type="text" v-model="job" />
      </div>
      <div>
        <button @click="register_member()">登録</button>
      </div>
    </div>
    <div style="border: dashed 1px black; margin: 5px 0"></div>
    <div>
      ドロップ登録
      <div>
        <span for="layer_num">何層かを一桁数字で入力</span>
        <input name="layer_num" type="text" v-model="layer_num" />
      </div>
      <div>
        <span for="layer_num">アイテム種別入力</span>
        <input name="equip_type" type="text" v-model="equip_type" />
      </div>
      <div>
        <button @click="regist_layer_doc()">登録</button>
      </div>
    </div>
    <div style="border: dashed 1px black; margin: 5px 0"></div>
    <div>
      メンバー取得アイテム種別追加
      <div>
        <span for="layer_num">アイテム種別名</span>
        <input name="input_name" type="text" v-model="input_name" />
      </div>
      <div>
        <button @click="register_input()">登録</button>
      </div>
    </div>
    <div style="border: dashed 1px black; margin: 5px 0"></div>
    <div>
      装備の要素追加
      <div>
        <span for="layer_num">要素キー</span>
        <input
          name="equip_content_name"
          type="text"
          v-model="equip_content_name"
        />
        <span for="layer_num">初期値</span>
        <input
          name="equip_content_value"
          type="text"
          v-model="equip_content_value"
        />
      </div>
      <div>
        <button @click="register_equip_content()">登録</button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetch_collection, get_doc, set_doc } from "../firebase/firebase";
import encrypt_password from "../store/modules/encrypt";

const EQUIP_TEMPLATE = require("@/assets/template/equip_template");

const EQUIP_TYPES = [
  "weapon",
  "token_weapon",
  "head",
  "body",
  "hand",
  "leg",
  "foot",
  "earing",
  "neckless",
  "blethlet",
  "ring",
  "token_ring",
];
export default {
  data: () => ({
    game_name: "",
    jp_name: "",
    job: "",
    layer_num: 0,
    equip_type: "",
    input_name: "",
    equip_content_name: "",
    equip_content_value: "",
    members_name: "",
    members_rank: "",
    members_password: "",
    player_name: "",
  }),
  methods: {
    async register_input() {
      const member_data_list = await fetch_collection("raid_members");
      member_data_list.forEach((member_ref) => {
        const member_id = member_ref.id;
        const member_info = member_ref.data();
        set_doc("raid_members", member_id, {
          ...member_info,
          [this.input_name]: {
            having: false,
            token: true,
          },
        });
      });
    },
    register_member() {
      set_doc("raid_archive", this.team_name, {
        [this.game_name]: {
          ...EQUIP_TEMPLATE,
          member_name: this.jp_name,
          job: this.job,
        },
      });
    },
    async regist_layer_doc() {
      const layer_doc = await get_doc("layer6.0", `layer${this.layer_num}`);
      const layer_data_map = layer_doc.data();
      const member_data_list = await fetch_collection("raid_members");
      const member_map = Object.fromEntries(
        member_data_list.map((member) => {
          return [member.id, 0];
        })
      );

      set_doc("layer6.0", `layer${this.layer_num}`, {
        ...layer_data_map,
        [this.equip_type]: member_map,
      });
    },
    async register_equip_content() {
      const member_data_list = await fetch_collection("raid_members");
      member_data_list.forEach((member_ref) => {
        const member_id = member_ref.id;
        const member_info = member_ref.data();
        const update_members_info = Object.fromEntries(
          Object.entries(member_info).map(([key, value]) => {
            if (!EQUIP_TYPES.includes(key)) {
              return [key, value];
            }
            value[this.equip_content_name] = this.equip_content_value;
            return [key, value];
          })
        );
        set_doc("raid_members", member_id, update_members_info);
      });
    },
    async register_to_members() {
      const encrypt_password_text = await encrypt_password(
        this.members_password
      );
      const member_doc = await get_doc("members", "member_info");
      const member_info = member_doc.data();
      const max_id_doc = await get_doc("members", "statistics");
      const max_id = max_id_doc.data().max_id;
      const next_id = max_id + 1;
      console.log(member_info, {
        ...member_info,
        [this.members_name]: {
          id: next_id,
          rank: this.members_rank,
          password: encrypt_password_text,
        },
      });
      set_doc("members", "member_info", {
        ...member_info,
        [this.members_name]: {
          id: next_id,
          rank: this.members_rank,
          password: encrypt_password_text,
          player: this.player_name,
        },
      });
      set_doc("members", "statistics", {
        max_id: next_id,
      });
    },
  },
};
</script>

<style>
</style>