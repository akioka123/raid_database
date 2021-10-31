<template>
  <div class="container">
    <div class="bg-main text-white text-lg" style="width: 300px">所有一覧</div>
    <div v-if="equip_list.length === 0">
      データ取得中 取得できない場合は画面を更新してください
    </div>
    <div
      class="row my-1"
      v-for="equip_of_member in equip_list"
      :key="equip_of_member.member_name"
    >
      <fc-chip
        class_text="col col-3 ma-0 d-flex flex-center pa-1 radius-tag pl-8"
        :class="member_name_color(equip_of_member.equip_list)"
      >
        {{ equip_of_member.member_name }}
      </fc-chip>
      <div class="col text-left py-1">
        <div class="row text-left radius-sm px-1">
          <span
            v-for="(equip, index) in equip_of_member.equip_list"
            :key="`${equip.equip_type}-${index}`"
          >
            <fc-button
              :class_text="`${equip_color(equip)} shadow-1 mr-2 pa-1 radius-sm`"
              v-if="!equip.token"
              @click.native="update_having(equip)"
            >
              {{ `${formatted_equip_type(equip.equip_type)}` }}
            </fc-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FcButton from "./FcButton.vue";
import FcChip from "./FcChip.vue";
import { update_equip_hvaing } from "../firebase/firebase";

const EQUIP_TYPES = {
  weapon: "武器",
  head: "頭",
  body: "胴",
  hand: "手",
  leg: "脚",
  foot: "足",
  earing: "耳",
  neckless: "首",
  blethlet: "腕",
  ring: "指",
};

export default {
  components: { FcChip, FcButton },
  name: "Owned",
  props: {
    members: Array,
  },
  data: () => ({
    equip_list: [],
    message: "",
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
      const member_map = this.members.map((member) => {
        const member_data = member.data();
        return { member_id: member.id, ...member_data };
      });
      this.equip_list = Object.entries(member_map)
        .sort((data_list1, data_list2) => {
          if (data_list1[1].order > data_list2[1].order) {
            return 1;
          } else if (data_list1[1].order < data_list2[1].order) {
            return -1;
          } else {
            return 0;
          }
        })
        .map((member) => {
          const member_data = member[1];
          const equip_list = Object.keys(EQUIP_TYPES)
            .filter((equip_type) => member_data[equip_type])
            .map((equip_type) => {
              if (member_data[equip_type]) {
                return {
                  having: member_data[equip_type].having,
                  token: member_data[equip_type].token,
                  equip_type: equip_type,
                  member_id: member_data.member_id,
                };
              }
            });

          return {
            member_name: `${member_data.member_name} : ${member_data.job}`,
            equip_list: equip_list,
          };
        });
    },
    async update_having(equip) {
      const response = await update_equip_hvaing(equip);
      this.emit_message(response.message);
      if (response.result) {
        equip.having = response.data.having;
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
    emit_message(message) {
      this.$emit("get_message", message);
    },
  },
};
</script>
<style lang="scss" scoped>
.member-name {
  width: 400px;
}
.radius-tag::before {
  content: "●";
  color: whitesmoke;
  font-size: larger;
  position: absolute;
  left: 16px;
}
</style>
