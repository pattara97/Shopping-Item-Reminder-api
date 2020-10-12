<template>
  <div id="editproduct">
    <b-row class="justify-content-md-center">
      <b-col class="col-lg-5 col-md-6 col-sm-12">
        <b-card>
          <h3>เพิ่มสินค้า</h3>
          <div style="text-align:left;!important">
            <b>ชื่อสินค้า</b>
            <b-form-input v-model="name" type="text"></b-form-input>
            <b>รายละเอียด</b>
            <b-form-input v-model="detail" type="text"></b-form-input>
            <b>หมวดหมู่</b>
            <b-form-select
              @change="selectgrouptype($event)"
              v-model="typegroup"
              :options="options"
            ></b-form-select>
            <div v-if="typegroup == 'newtypegroup'">
              <b>เพิ่มหมวดหมู่</b>
              <b-form-input v-model="newtypegroup" type="text"></b-form-input>
            </div>

            <div v-if="typegroup != null">
              <b>ประเภท</b>
              <b-form-select v-model="type" :options="option"></b-form-select>
            </div>
            <div v-if="type == 'newtype'">
              <b>เพิ่มประเภท</b>
              <b-form-input v-model="newtype" type="text"></b-form-input>
            </div>
            <b>ขนาด</b>
            <b-form-input v-model="size" type="text"></b-form-input>
            <b>ราคา</b>
            <b-form-input v-model="price" type="number"></b-form-input>
            <b>Link รูปภาพ</b>
            <b-form-input v-model="pic" type="text"></b-form-input>
          </div>
          <div v-if="errors.length">
            <b-alert show variant="danger">
              <b>กรุณากรอกข้อมูลให้ครบถ้วน</b>
              <p v-for="error in errors">{{ error }}</p>
            </b-alert>
          </div>
          <br />
          <router-link to="/listproduct">
            <b-button class="but">กลับ</b-button>
          </router-link>
          <b-button class="but" variant="success" @click="saveproduct()"
            >บันทึก</b-button
          >
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import axios from "axios";
import VueRouter from "vue-router";
import { api } from "../db/config.js";
const Swal = require("sweetalert2");
var moment = require("moment");
export default {
  name: "editproduct",
  data: function() {
    return {
      product_id: "",
      name: "",
      detail: "",
      type: "",
      size: "",
      price: "",
      pic: "",
      newtype: "",
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      errors: [],
      option: [],
      options: [],
      typegroup: "",
      newtypegroup: ""
    };
  },
  mounted() {
    axios
      .post(api.url + "/getproduct", {
        product_id: this.$session.get("product_id")
      })
      .then(response => {
        (this.product_id = response.data[0].product_id),
          (this.name = response.data[0].name),
          (this.detail = response.data[0].detail),
          (this.typegroup = response.data[0].typegroup),
          (this.type = response.data[0].type),
          (this.size = response.data[0].size),
          (this.price = response.data[0].price),
          (this.pic = response.data[0].pic);
        axios.post(api.url + "/getTypeGroupProduct").then(response => {
          this.options.push({
            value: null,
            text: "เลือกหมวดหมู่",
            disabled: true
          });
          for (let i = 0; i < response.data.length; i++) {
            this.options.push({
              value: response.data[i].typegroup,
              text: response.data[i].typegroup
            });
          }
          this.options.push({
            value: "newtypegroup",
            text: "***เพิ่มหมวดหมู่***"
          });
          axios
            .post(api.url + "/getTypeProduct", {
              typegroup: this.typegroup
            })
            .then(response => {
              this.option.push({
                value: null,
                text: "เลือกประเภท",
                disabled: true
              });
              for (let i = 0; i < response.data.length; i++) {
                this.option.push({
                  value: response.data[i].type,
                  text: response.data[i].type
                });
              }
              this.option.push({
                value: "newtype",
                text: "***เพิ่มประเภท***"
              });
            });
        });
      });
  },
  methods: {
    saveproduct() {
      this.errors = [];
      if (!this.name) {
        this.errors.push("กรุณากรอกชื่อสินค้า");
      } else if (!this.detail) {
        this.errors.push("กรุณากรอกรายละเอียด");
      } else if (!this.typegroup) {
        this.errors.push("กรุณาเลือกหมวดหมู่สินค้า");
      } else if (this.typegroup == "newtypegroup" && !this.newtypegroup) {
        this.errors.push("กรุณากรอกหมวดหมู่สินค้า");
      } else if (!this.type) {
        this.errors.push("กรุณาเลือกประเภทสินค้า");
      } else if (this.type == "newtype" && !this.newtype) {
        this.errors.push("กรุณากรอกประเภทสินค้า");
      } else if (!this.size) {
        this.errors.push("กรุณากรอกขนาด");
      } else if (!this.price) {
        this.errors.push("กรุณากรอกราคา");
      } else if (!this.pic) {
        this.errors.push("กรุณากรอกlinkรูปภาพ");
      }

      if (this.errors.length == 0) {
        if (this.type == "newtype") {
          this.type = this.newtype;
        }
        if (this.typegroup == "newtypegroup") {
          this.typegroup = this.newtypegroup;
        }
        axios
          .post(api.url + "/checkdupproductedit", {
            product_id: this.product_id,
            name: this.name,
            detail: this.detail
          })
          .then(response => {
            console.log(response.data);
            if (response.data.length > 0) {
                 this.errors.push("ข้อมูลสินค้าซ้ำ");
            
               
            } else {
              
                    axios
                      .post(api.url + "/editproduct", {
                        product_id: this.product_id,
                        name: this.name,
                        detail: this.detail,
                        type: this.type,
                        size: this.size,
                        price: this.price,
                        pic: this.pic,
                        timestamp: this.timestamp,
                        typegroup: this.typegroup
                      })
                      .then(response => {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          title: "บันทึกรายการ",
                          showConfirmButton: false,
                          timer: 1500
                        });
                        this.$router.push("/listproduct");
                      });
            }
          });
      }
    },
    selectgrouptype(typegroup) {
      axios
        .post(api.url + "/getTypeProduct", {
          typegroup: typegroup
        })
        .then(response => {
          this.option = [];

          this.option.push({
            value: null,
            text: "เลือกประเภท",
            disabled: true
          });
          for (let i = 0; i < response.data.length; i++) {
            this.option.push({
              value: response.data[i].type,
              text: response.data[i].type
            });
          }

          this.option.push({
            value: "newtype",
            text: "***เพิ่มประเภท***"
          });
          this.type = null;
        });
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

