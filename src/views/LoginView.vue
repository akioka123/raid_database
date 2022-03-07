<template>
  <div class="login-view">
    <div class="login bg-main radius-lg">
      <div class="select mt-15" v-if="member_name_list.length > 0">
        <select v-model="selected">
          <template
            name="member_names"
            id="member_names"
            class="pa-2"
            v-for="member_name in member_name_list"
          >
            <option :value="`${member_name}`" :key="member_name">
              {{ member_name }}
            </option>
          </template>
        </select>
      </div>
      <div v-else>データ取得中…</div>
      <div class="password my-6">
        <input
          :type="password_type"
          placeholder="パスワードの入力"
          v-model="password"
          class="pa-0"
          autocomplete="current-password"
          required
        />
        <span class="password_watch" @click="change_password_type"
          ><fc-icon :icon_name="password_icon"
        /></span>
      </div>
      <fc-button
        class="py-2 px-7 radius-md bg-white"
        @click.native="login_user()"
      >
        ログイン
      </fc-button>
      <div v-if="error_message" class="bg-accent text-white radius-lg my-4">
        {{ error_message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FcButton from "../components/FcButton.vue";
import FcIcon from "../components/FcIcon.vue";
import { get_doc, set_doc } from "../firebase/firebase";
export default {
  components: { FcButton, FcIcon },
  data: () => ({
    member_infos: {},
    member_name_list: [],
    password: "",
    selected: "",
    error_message: "",
    can_password_watch: false,
  }),
  computed: {
    ...mapState(["user_name"]),
    password_type() {
      return this.can_password_watch ? "text" : "password";
    },
    password_icon() {
      return this.can_password_watch ? "eye-slash" : "eye";
    },
  },
  watch: {
    member_infos() {
      if (this.member_infos.member_name_list) {
        this.member_name_list = this.member_infos.member_name_list;
      }
    },
  },
  mounted() {
    this.fetch_member_infos();
  },
  methods: {
    ...mapActions(["set_user_name"]),
    async fetch_member_infos() {
      const member_infos_doc = await get_doc("members", "member_info");
      this.member_infos = member_infos_doc.data();
    },
    async logging_user_login(user_name) {
      const now = new Date();
      const doc_name =
        now.getFullYear().toString() +
        ("0" + (now.getMonth() + 1)).slice(-2) +
        ("0" + now.getDate()).slice(-2);
      const logging_login = (await get_doc("logs", doc_name)).data();
      console.log(logging_login);
      await set_doc("logs", doc_name, {
        ...logging_login,
        [user_name]: now.toString(),
      });
    },
    async login_user() {
      const password_hash = await this.encode_sha_256(this.password);
      const saved_hash = this.member_infos.member_password[this.selected];
      if (password_hash === saved_hash) {
        this.set_user_name(this.selected);
        sessionStorage.setItem("user_name", this.selected);
        this.logging_user_login(this.selected);
        this.$router.push("/equip_manage");
      } else {
        this.error_message = "パスワードが間違っています。";
        setTimeout(() => {
          this.error_message = "";
        }, 1000 * 1);
      }
    },
    async encode_sha_256(text) {
      const uint8 = new TextEncoder().encode(text);
      const digest = await crypto.subtle.digest("SHA-256", uint8);
      return Array.from(new Uint8Array(digest))
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("");
    },
    change_password_type() {
      this.can_password_watch = !this.can_password_watch;
    },
  },
};
</script>

<style lang="scss" scoped>
.login-view {
  position: relative;
  height: calc(80vh);
}
.login {
  position: relative;
  height: 250px;
  width: 325px;
  top: 10vh;
  margin-left: auto;
  margin-right: auto;
  padding: 8px;
}
.mt-15 {
  margin-top: 60px;
}
select {
  appearance: none;
  background: transparent;
  border: none;
  width: 100%;
  height: 100%;
  font-size: 16px;
  padding: 0 10px;
  color: black;
}
select:focus {
  outline: none;
}
.select {
  background: var(--sub-color);
  height: 40px;
  width: 300px;
  border-radius: 5px;
  z-index: 1;
  margin-left: auto;
  margin-right: auto;
  top: 20vh;
}
.select::after {
  position: absolute;
  content: "";
  right: 30px;
  top: 85px;
  width: 8px;
  height: 8px;
  transform: translateY(-50%) rotate(45deg);
  border-bottom: 2px solid black;
  border-right: 2px solid black;
  z-index: 2;
}
input {
  appearance: none;
  background: transparent;
  border: none;
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: black;
  text-indent: 0.5em;
}
input:focus {
  outline: none;
}
.password {
  background: var(--sub-color);
  height: 40px;
  width: 300px;
  border-radius: 5px;
  z-index: 1;
  margin-left: auto;
  margin-right: auto;
  top: 20vh;
}
.password_watch {
  position: relative;
  left: 8rem;
  bottom: 1.8rem;
}
</style>