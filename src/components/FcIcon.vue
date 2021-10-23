<template>
  <font-awesome-icon :icon="icon_name" />
</template>
<script>
export default {
  props: {
    icon_name: { type: String, default: "coffee" },
  },
};
</script>
<style lang="scss" scoped>
</style>