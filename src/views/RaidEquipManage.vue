<template>
  <div class="container my-6">
    <owned-equip :members="members" />
    <equip-count-by-layer :members="members" />
  </div>
</template>
<script>
import OwnedEquip from "../components/OwnedEquip.vue";
import EquipCountByLayer from "../components/EquipCountByLayer.vue";
import { fetch_collection } from "../firebase/firebase";
export default {
  components: {
    OwnedEquip,
    EquipCountByLayer,
  },
  data: () => ({
    members: [],
  }),
  async mounted() {
    this.members = await fetch_collection("raid_members");
  },
};
</script>
<style lang="scss" scoped>
</style>