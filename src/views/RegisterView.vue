<template>
  <div>
    <input name="game_name" type="text" v-model="game_name" />{{ game_name }}
    <input name="jp_name" type="text" v-model="jp_name" />{{ jp_name }}
    <input name="job" type="text" v-model="job" />{{ job }}
    <button @click="register_member()">登録</button>
    <div>
      何層かを一桁数字で入力
      <input name="layer_num" type="text" v-model="layer_num" />{{ layer_num }}
      <input name="equip_type" type="text" v-model="equip_type" />{{
        equip_type
      }}
      <button @click="regist_layer_doc()">登録</button>
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
  ring1: {
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
  ring2: {
    having: false,
    token: false,
  },
  foot: {
    token: false,
    having: false,
  },
  head: {
    token: false,
    having: false,
  },
};
export default {
  data: () => ({
    game_name: "",
    jp_name: "",
    job: "",
    layer_num: 0,
    equip_type: "",
  }),
  methods: {
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
  },
};
</script>

<style>
</style>