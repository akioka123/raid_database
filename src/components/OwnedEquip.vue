<template>
  <div class="container">
    <div class="bg-main text-white text-lg" style="width: 300px">所有一覧</div>
    <div v-if="equip_list.length === 0">
      データ取得中 取得できない場合は画面を更新してください
    </div>
    <div
      class="row"
      v-for="equip_of_member in equip_list"
      :key="equip_of_member.member_name"
    >
      <fc-chip
        class_text="col col-2 ma-0 d-flex flex-center"
        :class="member_name_color(equip_of_member.equip_list)"
      >
        {{ equip_of_member.member_name }}
      </fc-chip>
      <div class="col text-left py-1">
        <div class="text-left radius-sm px-1">
          <span
            v-for="(equip, index) in equip_of_member.equip_list"
            :key="`${equip.equip_type}-${index}`"
          >
            <fc-chip
              :class_text="equip_color(equip)"
              v-if="!equip.token"
              @click.native="update_having(equip)"
            >
              {{ `${formatted_equip_type(equip.equip_type)} ` }}
            </fc-chip>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FcChip from "./FcChip.vue";
import { update_equip_hvaing } from "../firebase/firebase";

const EQUIP_TYPES = {
  head: "頭",
  body: "胴",
  hand: "手",
  leg: "脚",
  foot: "足",
  earing: "耳",
  neckless: "首",
  blethlet: "腕",
  ring1: "指1",
  ring2: "指2",
};

export default {
  components: { FcChip },
  name: "Owned",
  props: {
    members: Array,
  },
  data: () => ({
    equip_list: [],
  }),
  mounted() {
    if (this.members.length > 0) {
      this.equip_list = this.create_equip_list();
    }
  },
  watch: {
    members() {
      console.log("watch members");
      this.create_equip_list();
    },
  },
  computed: {
    equip_types() {
      return EQUIP_TYPES;
    },
  },
  methods: {
    async create_equip_list() {
      this.equip_list = this.members.map((member) => {
        const member_data = member.data();
        return {
          member_name: `${member_data.member_name} : ${member_data.job}`,
          equip_list: Object.entries(member_data)
            .filter(([key]) => Object.keys(EQUIP_TYPES).includes(key))
            .map(([key, value]) => {
              return {
                having: value["having"],
                token: value["token"],
                equip_type: key,
                member_id: member.id,
              };
            }),
        };
      });
    },
    async update_having(equip) {
      const response = await update_equip_hvaing(equip);
      if (response) {
        equip.having = !equip.having;
      }
    },
    equip_color(equip) {
      return equip.having
        ? "bg-accent text-white text-center"
        : "bg-sub text-black text-center";
    },
    equip_having(equip) {
      equip.having = !equip.having;
    },
    member_name_color(equip) {
      const suite_equip = equip
        .filter((equip) => !equip.token)
        .some((equip) => !equip.having);
      return suite_equip ? "bg-sub text-black" : "bg-accent text-white";
    },
    formatted_equip_type(key) {
      return EQUIP_TYPES[key];
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
