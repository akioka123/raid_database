<template>
  <div class="container my-6">
    <div v-if="message" class="message pa-2 radius-md" :class="message_type">
      {{ message }}
    </div>
    <owned-equip :members="members" @get_message="on_get_message" />
    <equip-count-by-layer :members="members" @get_message="on_get_message" />
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
    message: "",
    message_type: null,
  }),
  async mounted() {
    this.members = await fetch_collection("raid_members");
  },
  methods: {
    on_get_message(message, message_type) {
      this.message = message;
      this.message_type = message_type;
      setTimeout(() => {
        this.message = "";
      }, 1000 * 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.message {
  position: fixed;
  left: 45vw;
  top: 7vh;
  opacity: 0.8;
  z-index: 10;
}

.success {
  background-color: #4caf50;
  color: white;
}
.error {
  background-color: #f44336;
  color: white;
}
</style>