<template>
  <div id="register">
    <br />
    <br />
    <h2>ลงทะเบียน</h2>
    <div class="container">
      <div class="row">
        <div class="col-md-4 col-lg-4"></div>
        <div class="col-sm-12 col-md-4 col-lg-4">
          <div style="text-align:left;!important">
            ชื่อ
            <input type="text" v-model="name" class="form-control" />
            นามสกุล
            <input type="text" v-model="lname" class="form-control" />
            เพศ
            <b-form-select v-model="gender" :options="options"></b-form-select>อีเมล
            <input type="email" v-model="email" class="form-control" />
            ชื่อผู้ใช้
            <input type="text" v-model="username" class="form-control" />
            รหัสผ่าน
            <input type="password" v-model="password" class="form-control" />
            ยืนยันรหัสผ่าน
            <input
              type="password"
              v-model="password2"
              class="form-control"
            />
            <br />
          </div>
          <div v-if="errors.length">
            <b-alert show variant="danger">
              กรุณากรอกข้อมูลให้ครบถ้วน
              <p v-for="error in errors">{{ error }}</p>
            </b-alert>
          </div>
          <router-link to="/login">
            <b-button class="but">กลับ</b-button>
          </router-link>
          <b-button class="but" variant="success" @click="register()">ลงทะเบียน</b-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import VueRouter from "vue-router";
import { api } from "../db/config.js";
const Swal = require("sweetalert2");
var moment = require("moment");
export default {
  name: "register",
  data() {
    return {
      errors: [],
      name: "",
      lname: "",
      gender: null,
      email: "",
      timestamp: moment().format("YYYY-MM-DD"),
      username: "",
      password: "",
      password2: "",
      options: [
        { value: null, text: "เลือกเพศ", disabled: true },
        { value: "ชาย", text: "ชาย" },
        { value: "หญิง", text: "หญิง" },
        { value: "ไม่ระบุ", text: "ไม่ระบุ" }
      ]
    };
  },
  created() {},
  methods: {
    register() {
      this.errors = [];
      if (!this.name) {
        this.errors.push("กรุณากรอกชื่อ");
      } else if (!this.lname) {
        this.errors.push("กรุณากรอกนามสกุล");
      } else if (!this.gender) {
        this.errors.push("กรุณาเลือกเพศ");
      } else if (!this.validEmail(this.email)) {
        this.errors.push("กรุณากรอกอีเมลให้ถูกต้อง");
      } else if (!this.username) {
        this.errors.push("กรุณากรอกชื่อผู้ใช้");
      } else if (!this.password) {
        this.errors.push("กรุณากรอกรหัสผ่าน");
      } else if (!this.password2) {
        this.errors.push("กรุณากรอกรหัสผ่านยืนยัน");
      } else if (this.password != this.password2) {
        this.errors.push("กรุณากรอกรหัสผ่านให้ตรงกัน");
      }
      if (this.errors.length == 0) {
        // alert('sdf')
        axios
          .post(api.url + "/register", {
            name: this.name,
            lname: this.lname,
            gender: this.gender,
            email: this.email,
            timestamp: this.timestamp,
            username: this.username,
            password: this.password,
            role: "user"
          })
          .then(response => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "ลงทะเบียนเรียบร้อย",
              showConfirmButton: false,
              timer: 1500
            });
            this.$router.push("/login");
          });
      }
    },
    validEmail: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
</script>
<style scoped>
.but {
  margin: 0px 5px 0px 5px;
}
input,
select {
  margin-bottom: 10px !important;
}
</style>