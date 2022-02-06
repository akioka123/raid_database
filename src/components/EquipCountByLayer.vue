<template>
  <div class="container">
    <div class="bg-main text-white text-lg" style="width: 300px">
      層ごとの取得回数
    </div>
    <div
      class="row bg-sub radius-md pa-1"
      v-for="(layer, index) in layer_info"
      :key="`layer-${index}`"
    >
      <div class="col">
        {{ convert_layer_to_jp(layer.layer_id) }}
        <div
          class="row bg-main radius-md pa-1"
          v-for="(count_map, equip_type) in layer.layer_data"
          :key="index + equip_type"
        >
          <span class="text-white" style="align-self: center">
            {{ convert_equip_to_jp(equip_type) }}
          </span>
          <div v-for="(count, member) in count_map" :key="member" class="my-1">
            <fc-chip class="bg-sub text-black text-center pa-2 px-4 radius-tag">
              <template>
                <span class="mr-2">{{ formated_member_name(member) }}:</span>
                <span class="mr-2">{{ count }}</span>
                <fc-button
                  class_text="mr-2 pa-1 text-main bg-white"
                  button_type="icon"
                  @click.native="
                    update_count(
                      layer.layer_id,
                      equip_type,
                      member,
                      count,
                      true
                    )
                  "
                >
                  <fc-icon icon_name="plus" />
                </fc-button>
                <fc-button
                  class_text="mr-1 pa-1 text-accent bg-white"
                  button_type="icon"
                  @click.native="
                    update_count(
                      layer.layer_id,
                      equip_type,
                      member,
                      count,
                      false
                    )
                  "
                >
                  <fc-icon icon_name="minus" />
                </fc-button>
              </template>
            </fc-chip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetch_collection,
  update_layer_equip_count,
} from "../firebase/firebase";
import FcChip from "./FcChip.vue";
import FcIcon from "./FcIcon.vue";
import FcButton from "./FcButton.vue";

const LAYER = {
  layer1: "第１層",
  layer2: "第２層",
  layer3: "第３層",
  layer4: "第４層",
};

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
  torm: "トームストーン",
  drug: "硬化薬",
  stdrug: "強化薬",
  armor: "強化繊維",
};

export default {
  components: { FcIcon, FcChip, FcButton },
  props: {
    members: Array,
  },
  data: () => ({
    layer_info: [],
    members_data: [],
    message: "",
  }),
  mounted() {
    this.layer_info = this.fetch_layer();
    this.members_data = this.members
      .map((member) => {
        return {
          member_id: member.id,
          ...member.data(),
        };
      })
      .sort((a, b) => {
        if (a.order > b.order) {
          return 1;
        } else if (a.order < b.order) {
          return -1;
        } else {
          return 0;
        }
      });
  },
  watch: {
    members() {
      this.members_data = this.members
        .map((member) => {
          return {
            member_id: member.id,
            ...member.data(),
          };
        })
        .sort((a, b) => {
          if (a.order > b.order) {
            return 1;
          } else if (a.order < b.order) {
            return -1;
          } else {
            return 0;
          }
        });
    },
    members_data() {
      this.fetch_layer();
    },
  },
  methods: {
    fetch_layer() {
      if (this.members_data.length <= 0) {
        return;
      }
      const fetched_layer = fetch_collection("layer6.0");
      fetched_layer.then((layer_docs) => {
        this.layer_info = layer_docs.map((layer_doc) => {
          const layer_id = layer_doc.id;
          const layer_data = layer_doc.data();
          const sorted_layer_data = Object.fromEntries(
            Object.keys(EQUIP_TYPES)
              .filter((equip_type) =>
                Object.keys(layer_data).includes(equip_type)
              )
              .map((equip_type) => {
                const value = layer_data[equip_type];
                const sorted_value = Object.fromEntries(
                  this.members_data.map((member) => {
                    return [member.member_id, value[member.member_id]];
                  })
                );
                return [equip_type, sorted_value];
              })
          );
          return {
            layer_id,
            layer_data: sorted_layer_data,
          };
        });
      });
    },
    async update_count(layer_id, equip_type, member_name, count, is_plus) {
      if (!is_plus && count === 0) {
        return;
      }
      const target_index = this.layer_info.findIndex(
        (layer) => layer.layer_id === layer_id
      );
      const count_map = JSON.parse(
        JSON.stringify(this.layer_info[target_index].layer_data[equip_type])
      );
      const equip_type_map = {
        ...count_map,
        [member_name]: is_plus ? count + 1 : count - 1,
      };
      const response = await update_layer_equip_count(
        layer_id,
        equip_type,
        equip_type_map,
        member_name,
        count
      );
      this.emit_message(response.message);
      this.layer_info[target_index].layer_data[equip_type] = response.data;
    },
    formated_member_name(member_id) {
      const member_doc = this.members_data.find((member) => {
        return member.member_id === member_id;
      });
      if (!member_doc) {
        return "not live member";
      }
      return member_doc.member_name;
    },
    convert_layer_to_jp(layer_id) {
      return LAYER[layer_id];
    },
    convert_equip_to_jp(equip) {
      return EQUIP_TYPES[equip];
    },
    emit_message(message) {
      this.$emit("get_message", message);
    },
  },
};
</script>

<style lang="scss" scoped>
.radius-tag::before {
  content: "●";
  color: whitesmoke;
  font-size: larger;
  position: relative;
  left: -10px;
}
</style>