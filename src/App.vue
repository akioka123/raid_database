<template>
  <div id="app">
    <header class="tool-bar header">ヘッド</header>
    <div class="main back">
      <router-view />
    </div>
    <footer class="tool-bar footer">フット</footer>
  </div>
</template>

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
  display: block;
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
}
.main {
  min-height: calc(100vh - 96px - 16px);
  margin-top: 48px;
  margin-bottom: 48px;
  padding: 8px;
}
.back {
  background: whitesmoke;
  background-image: repeating-radial-gradient(
      circle at 2em 2.2em,
      var(--main-color),
      var(--main-color) 0.96em,
      transparent 0.96em,
      transparent 16em
    ),
    repeating-radial-gradient(
      circle at 0.9em 0.96em,
      var(--main-color),
      var(--main-color) 0.4em,
      transparent 0.44em,
      transparent 16em
    ),
    repeating-radial-gradient(
      circle at 2em 0.6em,
      var(--main-color),
      var(--main-color) 0.4em,
      transparent 0.4em,
      transparent 16em
    ),
    repeating-radial-gradient(
      circle at 3em 0.96em,
      var(--main-color),
      var(--main-color) 0.4em,
      transparent 0.4em,
      transparent 20em
    );
  background-position: 1.2em 1.8em;
  background-size: 7.2em 7.2em;
}
</style>
