<template>
  <a class="shadow-1 btn" :class="btn_type_class">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    class_text: String,
    button_type: String,
  },
  computed: {
    btn_type_class() {
      switch (this.button_type) {
        case "icon":
          return `circle ${this.class_text}`;
        default:
          return this.class_text;
      }
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
}
.btn:hover {
  content: "";
  filter: invert(30%);
  top: 0;
  left: 0;
  z-index: 2;
  // background: rgba(0, 0, 0, 0.5);
  transition: cubic-bezier(0.8, 0, 0.2, 1) 0.4s;
  box-shadow: 0 0 0 0;
}
</style>