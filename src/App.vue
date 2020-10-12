<template>
<div id="app">
  <div v-if="isUser">
    <b-navbar
      toggleable="lg"
      type="dark"
      style="background-color: #84fab0;
            background-image: linear-gradient(to bottom right, #FF3300, yellow)
            "
    >
      <b-navbar-brand @click="product()" style="cursor:pointer">Shopping Item Reminder</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
            <b-nav-item v-if="isUser=='user'">
            <router-link to="/historylast" tag="li" style="cursor:pointer">รายการ</router-link>
          </b-nav-item>
          <b-nav-item v-if="isUser=='user'">
            <router-link to="/history" tag="li" style="cursor:pointer">รายการที่ซื้อยังไม่ครบ</router-link>
          </b-nav-item>
          <b-nav-item v-if="isUser=='user'">
            <router-link to="/complete_history" tag="li" style="cursor:pointer">รายการที่ซื้อครบแล้ว</router-link>
          </b-nav-item>
          <b-nav-item v-if="isUser=='user'">
            <router-link to="/alllist" tag="li" style="cursor:pointer">ยอดค่าใช้จ่าย</router-link>
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template slot="button-content">
              <b style="color:black" v-if="user.username!=`admin`">{{user.name}} {{user.lname}}</b>
              <b style="color:black" v-if="user.username==`admin`">{{user.username}}</b>
            </template>
            <b-dropdown-item @click="logout()">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <body></body>
  </div>
  <router-view></router-view>
</div>
</template>
<script>
import axios from "axios";
import VueRouter from "vue-router";
import Cookies from "js-cookie";
import Vue from "vue";
import { api } from "./db/config.js";
const VueScrollTo = require("vue-scrollto");
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
Vue.use(VueScrollTo);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import product from "@/components/product.vue";
export default {
  name: "app",
  components: {
    product
  },
  el: "#app",
  data() {
    return {
      currentUser: null,
      user: null
    };
  },

  created() {
    this.currentUser = JSON.parse(localStorage.getItem("user")).role;
    axios
      .post(api.url + "/getProfile", {
        username: JSON.parse(localStorage.getItem("user")).username
      })
      .then(response => {
        this.user = response.data[0];
      });
  },
  computed: {
    isUser() {
      return this.currentUser;
    }
  },
  methods: {
    logout() {
      this.currentUser = null;
      this.$session.destroy();
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
    product() {
      var currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        if (currentUser.role == "admin") {
          this.$router.push("/listproduct");
        } else if (currentUser.role == "user") {
          this.$router.push("/product");
        }
      }
    },
    addproduct() {
      Cookies.remove("cart");
      this.$router.push("/product");
    }
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Kanit&display=swap");
html,
body {
  font-family: "Kanit", sans-serif;
}
#app {
  font-family: "Kanit", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.dropdown-toggle::after {
  color: #000;
}
</style>
