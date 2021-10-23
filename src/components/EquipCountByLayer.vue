<template>
  <div class="container">
    <div
      class="row bg-sub radius-md pa-1"
      v-for="(layer, index) in layer_info"
      :key="`layer-${index}`"
    >
      <div class="col">
        {{ layer.layer_id }}
        <div
          class="row bg-main radius-md pa-1"
          v-for="(count_map, equip_type) in layer.layer_data"
          :key="index + equip_type"
        >
          <span class="text-white" style="align-self: center">{{
            equip_type
          }}</span>
          <div v-for="(count, member) in count_map" :key="member" class="my-1">
            <fc-chip class="bg-sub text-black text-center">
              <template>
                <span class="mr-2">{{ formated_member_name(member) }}:</span>
                {{ count }}
                <fc-icon
                  class="mr-1 text-main"
                  icon_name="plus"
                  @click.native="
                    update_count(
                      layer.layer_id,
                      equip_type,
                      member,
                      count,
                      true
                    )
                  "
                />
                <fc-icon
                  class="text-accent"
                  icon_name="minus"
                  @click.native="
                    update_count(
                      layer.layer_id,
                      equip_type,
                      member,
                      count,
                      false
                    )
                  "
                />
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
export default {
  components: { FcIcon, FcChip },
  props: {
    members: Array,
  },
  data: () => ({
    layer_info: [],
  }),
  mounted() {
    this.layer_info = this.fetch_layer();
  },
  methods: {
    fetch_layer() {
      const fetched_layer = fetch_collection("layer6.0");
      fetched_layer.then((layer_docs) => {
        this.layer_info = layer_docs.map((layer_doc) => {
          const layer_id = layer_doc.id;
          const layer_data = layer_doc.data();
          return {
            layer_id,
            layer_data,
          };
        });
      });
    },
    update_count(layer_id, equip_type, member_name, count, is_plus) {
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
      update_layer_equip_count(layer_id, equip_type, equip_type_map);
      this.layer_info[target_index].layer_data[equip_type] = equip_type_map;
    },
    formated_member_name(member_id) {
      const member_doc = this.members.find((member) => {
        return member.id === member_id;
      });
      if (!member_doc) {
        return "not live member";
      }
      return member_doc.data().member_name;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>