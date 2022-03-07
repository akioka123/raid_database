<template>
  <div>
    <div>
      レイドメンバー登録
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
const MEMBER = {
  auth: "member",
  blethlet: {
    having: false,
    token: false,
  },
  ring: {
    having: false,
    token: false,
  },
  body: {
    having: false,
    token: false,
  },
  leg: {
    token: false,
    having: false,
  },
  neckless: {
    token: false,
    having: false,
  },
  earing: {
    token: false,
    having: false,
  },
  hand: {
    token: false,
    having: false,
  },
  foot: {
    token: false,
    having: false,
  },
  head: {
    token: false,
    having: false,
  },
  weapon: {
    token: false,
    having: false,
  },
  token_weapon: {
    token: true,
    having: false,
  },
  token_ring: {
    token: true,
    having: false,
  },
};
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
      set_doc("raid_members", this.game_name, {
        ...MEMBER,
        member_name: this.jp_name,
        job: this.job,
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
  },
};
</script>

<style>
</style>