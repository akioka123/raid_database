<template>
  <span
    class="chip radius-md px-3 py-1 ma-1"
    :class="class_text"
    :style="styles"
  >
    <slot></slot>
  </span>
</template>
<script>
export default {
  props: {
    chip_text: [String, Number],
    class_text: String,
    width: { type: String, default: "" },
    height: { type: String, default: "" },
  },
  computed: {
    styles() {
      return {
        "--chip-width": this.width,
        "--chip-height": this.height,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.chip {
  width: var(--chip-width);
  height: var(--chip-height);
  cursor: pointer;
}
</style>