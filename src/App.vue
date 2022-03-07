<template>
  <div id="app">
    <div class="row tool-bar header text-white">
      <h3 class="ma-3">装備チェック_V5</h3>
      <h3 class="ma-3">{{ user_name }}</h3>
    </div>
    <div class="main back">
      <router-view />
    </div>
    <div class="row tool-bar footer text-white">
      <h3 class="ma-3">
        (C) SQUARE ENIX CO., LTD. All Rights Reserved. 2022 Toi et Moi
      </h3>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["user_name"]),
  },
};
</script>

<style lang="scss">
@import "./src/assets/main.scss";
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

:root {
  --main-color: #00979b;
  --sub-color: #ebd880;
  --accent-color: #c03619;
  --red-color: #ee827c;
}
body {
  margin: 0;
}
.tool-bar {
  margin-top: 0px;
  display: flex;
  flex: 1 1 auto;
  max-width: 100%;
  position: absolute;
  left: 0px;
  right: 0px;
  z-index: 1;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    left 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    right 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--main-color);
}
.header {
  height: 48px;
  position: fixed;
  top: 0;
}
.footer {
  height: 48px;
  position: fixed;
  bottom: 0;
  margin-bottom: 0px !important;
}
.main {
  min-height: calc(100vh - 96px - 16px);
  margin-top: 48px;
  margin-bottom: 48px;
  padding: 8px;
}
.back {
  background: whitesmoke;
  background-position: 1.2em 1.8em;
  background-size: 7.2em 7.2em;
}
.height20 {
  height: 20px;
}
.f-size-20 {
  font-size: 20px;
}
</style>
