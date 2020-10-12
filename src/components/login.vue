<template>
  <div id="login">
    <!-- <input v-model="username" type="text" required />
    <input v-model="password" type="text" />
    <button @click="login()">ยืนยัน</button>-->
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <h1>Shopping Item Reminder</h1>
    <br />
    <div class="container">
      <div class="row">
        <div class="col-md-4 col-lg-4"></div>
        <div class="col-sm-12 col-md-4 col-lg-4">
          <input
            type="text"
            v-model="username"
            name="username"
            class="form-control"
            placeholder="username หรือ email"
          />
          <br />
          <input
            type="password"
            v-model="password"
            name="password"
            class="form-control"
            placeholder="password"
          />
          <br />
          <div v-if="showDismissibleAlert">
            <b-alert show variant="danger">กรอกข้อมูลไม่ครบ</b-alert>
          </div>
          <div v-if="showDismissibleAlert2">
            <b-alert show variant="danger">ชื่อผู้ใช้ /อีเมล หรือรหัสผ่านไม่ถูกต้อง</b-alert>
          </div>
          <b-button variant="success" @click="login()">login</b-button>
          <a class="btn btn-link">
            <router-link to="/register">register</router-link>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import VueRouter from "vue-router";
import { api } from "../db/config.js";
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
      showDismissibleAlert: false,
      showDismissibleAlert2: false
    };
  },
  mounted() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role == "user") {
        this.$router.push("/product");
      } else if (user.role == "admin") {
        this.$router.push("/listproduct");
      }
    }
  },
  methods: {
    login() {
      if (this.username == "" || this.password == "") {
        this.showDismissibleAlert = true;
      } else {
        this.showDismissibleAlert = false;
        axios
          .post(api.url + "/login", {
            username: this.username,
            password: this.password
          })
          .then(response => {
            if (response.data.length > 0) { 
              localStorage.setItem("user", JSON.stringify(response.data[0]));
              if (response.data[0].role == "user") { 
                location.reload();
              } else { 
                location.reload();
              }
            } else {
              this.showDismissibleAlert2 = true;
            }
          });
      }
    }
  }
};
</script>
<style scoped>
b-card {
  max-width: 20rem;
}
</style>