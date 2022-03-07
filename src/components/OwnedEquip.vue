<template>
  <div class="container">
    <div class="bg-main text-white text-lg" style="width: 300px">
      参考先一覧
    </div>
    <div>
      <ul class="tag-ul">
        <template class="text-left" v-for="strategy in strategy_list">
          <li class="text-left tag-li" :key="strategy.floor">
            {{ strategy.floor }}
          </li>
          <li
            class="text-left"
            v-for="strategy in strategy.strategies"
            :key="strategy.url"
          >
            <a :href="strategy.url">
              {{ strategy.description }}
            </a>
          </li>
        </template>
      </ul>
    </div>
    <div class="bg-main text-white text-lg" style="width: 300px">
      零式所有一覧
    </div>
    <div>
      <div v-if="equip_list.length === 0">
        データ取得中 取得できない場合は画面を更新してください
      </div>
      <div class="row">
        <div class="col col-3 pl-8 bg-main text-white text-lg">
          Character:Job
        </div>
        <div class="col bg-main text-white text-lg">Asphodelos</div>
        <div class="col bg-main text-white text-lg">token</div>
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
          <img :src="equip_of_member.job" class="job-icon" />
          {{ equip_of_member.member_name }}
        </fc-chip>
        <div class="col text-left py-1">
          <div class="row text-left radius-sm px-1">
            <span
              v-for="(equip, index) in equip_of_member.equip_list"
              :key="`${equip.equip_type}-${index}`"
            >
              <fc-button
                :class_text="`${equip_color(
                  equip
                )} shadow-1 mr-2 pa-1 radius-sm`"
                @click.native="update_having(equip)"
              >
                {{ `${formatted_equip_type(equip.equip_type)}` }}
              </fc-button>
            </span>
          </div>
        </div>
        <div class="col text-left py-1">
          <div class="row text-left radius-sm px-1">
            <span
              v-for="(equip, index) in equip_of_member.token_equip_list"
              :key="`${equip.equip_type}-${index}`"
            >
              <fc-button
                :class_text="`${token_equip_color(
                  equip
                )} shadow-1 mr-2 pa-1 radius-sm`"
                @click.native="update_token_state(equip)"
              >
                {{ `${formatted_equip_type(equip.equip_type)}` }}
              </fc-button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FcButton from "./FcButton.vue";
import FcChip from "./FcChip.vue";
import { update_equip_hvaing, update_token_state } from "../firebase/firebase";

const EQUIP_TYPES = {
  weapon: "武器",
  token_weapon: "武器",
  head: "頭",
  body: "胴",
  hand: "手",
  leg: "脚",
  foot: "足",
  earing: "耳",
  neckless: "首",
  blethlet: "腕",
  ring: "指",
  token_ring: "指",
};

const HAVING_STATE = {
  none: "none",
  have: "have",
  reinforce: "reinforce",
};

const STRATEGY_LIST = [
  {
    floor: "第１層",
    strategies: [
      {
        url: "https://www.youtube.com/watch?v=eGJ5eRvRzK8",
        description: "ゆっくりと振り返るパンデモニウム辺獄編零式1層",
      },
      {
        url: "https://www.youtube.com/watch?v=Hb7zp2AUACA",
        description:
          "【FF14】万魔殿パンデモニウム辺獄編零式1層 攻略解説動画【犬丸のぞみ】",
      },
      {
        url: "https://jp.finalfantasyxiv.com/lodestone/character/20586776/blog/4930556/",
        description: "万魔殿パンデモニウム:辺獄編 零式1層 マクロ",
      },
      {
        url: "https://jp.finalfantasyxiv.com/lodestone/character/11501677/blog/4929290/",
        description: "辺獄編零式 タイムライン",
      },
    ],
  },
  {
    floor: "第２層",
    strategies: [
      {
        url: "https://www.youtube.com/watch?v=8mvu5-tHuCc",
        description: "ゆっくりと振り返るパンデモニウム辺獄編零式2層",
      },
      {
        url: "https://jp.finalfantasyxiv.com/lodestone/character/16791052/blog/4930875/",
        description: "パンデモ零式2層マクロ",
      },
    ],
  },
  {
    floor: "第３層",
    strategies: [
      {
        url: "https://www.youtube.com/watch?v=31_2BeHgSwQ",
        description:
          "主流まとめ解説 ハピおじ ほぼララ 辺獄無敵 零式3層をアニメーションで理解する動画【 ぬけまる 】最新版",
      },
      {
        url: "https://www.youtube.com/watch?v=kNEAhlnzy8Q",
        description: "ゆっくりと振り返るパンデモニウム辺獄編零式3層",
      },
    ],
  },
  {
    floor: "第４層",
    strategies: [
      {
        url: "https://www.youtube.com/watch?v=LtrXblj9mJo",
        description:
          "【FF14】万魔殿パンデモニウム辺獄編零式4層 攻略解説動画 速報版【犬丸のぞみ】",
      },
      {
        url: "https://www.youtube.com/watch?v=1sfnBHXf2nA",
        description:
          "【FF14】万魔殿パンデモニウム辺獄編零式4層後半 攻略解説動画 速報版【犬丸のぞみ】",
      },
      {
        url: "https://www.youtube.com/watch?v=wq3lMm5Osu0",
        description:
          "主流解説 YPP式 玉十字脳死法 零式4層をアニメーションで理解する動画 軽減例付【 ぬけまる 】",
      },
      {
        url: "https://www.youtube.com/watch?v=q_akUhtF6pg",
        description:
          "主流まとめ解説 イディル式 3幕ぬけまる犬丸 零式4層後半をアニメーションで理解する動画 軽減例付【 ぬけまる 】",
      },
    ],
  },
];

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
    strategy_list() {
      return STRATEGY_LIST;
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
            .filter((equip_type) => !member_data[equip_type].token)
            .map((equip_type) => {
              if (member_data[equip_type]) {
                return {
                  having: member_data[equip_type].having,
                  token: member_data[equip_type].token,
                  equip_type: equip_type,
                  member_id: member_data.member_id,
                };
              }
              return;
            });
          const token_equip_list = Object.keys(EQUIP_TYPES)
            .filter((equip_type) => member_data[equip_type].token)
            .map((equip_type) => {
              if (member_data[equip_type]) {
                return {
                  having: member_data[equip_type].having,
                  token: member_data[equip_type].token,
                  state: member_data[equip_type].token_state,
                  equip_type: equip_type,
                  member_id: member_data.member_id,
                };
              }
              return;
            });
          let job_icon;
          try {
            job_icon = require("@/assets/" + member_data.job + ".png");
          } catch (e) {
            job_icon = null;
          }

          return {
            member_name: `${member_data.member_name}`,
            job: job_icon,
            equip_list: equip_list,
            token_equip_list: token_equip_list,
          };
        });
    },
    async update_having(equip) {
      const response = await update_equip_hvaing(equip);
      this.emit_message(response.message, response.result);
      if (response.result) {
        equip.having = response.data.having;
      }
    },
    async update_token_state(equip) {
      const response = await update_token_state(equip);
      this.emit_message(response.message, response.result);
      if (response.result) {
        equip.state = response.data.state;
      }
    },
    equip_color(equip) {
      return equip.having
        ? "bg-accent text-white text-center"
        : "bg-sub text-black text-center";
    },
    token_equip_color(equip) {
      if (equip.state === HAVING_STATE.none) {
        return "bg-sub text-black text-center";
      } else if (equip.state === HAVING_STATE.have) {
        return "bg-accent text-white text-center";
      } else if (equip.state === HAVING_STATE.reinforce) {
        return "bg-main text-white text-center";
      }
    },
    equip_having(equip) {
      equip.having = !equip.having;
    },
    member_name_color(equip) {
      const suite_equip = equip.some((equip) => !equip.having);
      return suite_equip ? "bg-sub text-black" : "bg-accent text-white";
    },
    formatted_equip_type(key) {
      return EQUIP_TYPES[key];
    },
    emit_message(message, result) {
      this.$emit("get_message", message, result ? "success" : "error");
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
.tag-ul {
  padding: 0;
  position: relative;
}

.tag-ul .tag-li {
  color: black;
  border-left: solid 8px var(--accent-color); /*左側の線*/
  background: var(--sub-color); /*背景色*/
  margin-bottom: 5px; /*下のバーとの余白*/
  margin-right: 5px; /*下のバーとの余白*/
  line-height: 1.5;
  border-radius: 0 15px 15px 0; /*右側の角だけ丸く*/
  padding: 0.5rem;
  font-size: 1rem;
  list-style-type: none !important;
}
.job-icon {
  width: 32px;
}
</style>
