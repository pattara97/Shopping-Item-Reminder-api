<template>
  <div id="listproduct">
    <div id="top">
      <h4>รายการสินค้า</h4>
      <span
        style="margin-top:-20px;margin-left:5%;float:left;cursor:pointer;"
        @click="openNav()"
      >&#9776; ตัวเลือกสินค้า : {{groupnameShow}} {{type}}</span>
      <br />
      <b-row class="justify-content-md-center">
        <b-row>
          <b-col sm="10" md="12">
            <b-container>
              <b-form-input v-model="name" placeholder="ค้นหาสินค้า"></b-form-input>
            </b-container>
          </b-col>
        </b-row>
        <b-col class="col-lg-11 col-md-11 col-sm-12">
          <div align="right">
            <router-link to="/addproduct">
              <b-button class="rightbutton" variant="success">เพิ่มสินค้า</b-button>
            </router-link>
          </div>
          <br />
          <b-card style="overflow-x: auto" class="text-center">
            <b-table striped hover :items="filteredList" :fields="fields">
              <template v-slot:cell(price)="items">
                <!-- `data.value` is the value after formatted by the Formatter -->
                <a>{{ Number(items.value).toLocaleString() }}</a>
              </template>
              <template v-slot:cell(timestamp)="items">{{items.value}}</template>
              <template v-slot:cell(pic)="items">
                <img style="width:100px" v-bind:src="`${items.value}`" />
              </template>
              <template v-slot:cell(edit)="data">
                <div class="h2 mb-0">
                  <b-icon
                    @click="edit_product(data.item.product_id)"
                    icon="pencil"
                    aria-hidden="true"
                    variant="secondary"
                  ></b-icon>
                </div>
              </template>
              <template v-slot:cell(delete)="data">
                <div class="h2 mb-0">
                  <b-icon
                    @click="delete_product(data.item.product_id)"
                    icon="trash-fill"
                    aria-hidden="true"
                    variant="danger"
                  ></b-icon>
                </div>
              </template>
            </b-table>
          </b-card>
        </b-col>
      </b-row>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div id="bot"></div>
    </div>
    <button v-scroll-to="{ element: '#top',  offset: -200, }" id="gotop">กลับด้านบน</button>
    <button v-scroll-to="{ element: '#bot' }" id="gobot">ไปด้านล่าง</button>

    <div id="mySidenav" class="sidenav">
      <b @click="closeNav" style="font-size:20px">Shopping Item Reminder</b>
      <div role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-3 variant="info">หมวดหมู่สินค้า</b-button>
          </b-card-header>
          <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <a style="cursor:pointer" @click="searchtypegroup('')">ทุกหมวดหมู่</a>
              <a
                style="cursor:pointer"
                v-for="item of typegroup"
                @click="searchtypegroup(item.typegroup)"
              >{{item.typegroup}}</a>
            </b-card-body>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-1" v-if="groupname!=''">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-4 variant="info">ประเภทสินค้า</b-button>
          </b-card-header>
          <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <a style="cursor:pointer" @click="searchType('')">ทุกประเภท</a>
              <a
                style="cursor:pointer"
                v-for="item of types"
                @click="searchType(item.type)"
              >{{item.type}}</a>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
      <a href="javascript:void(0)" class="closebtn" @click="closeNav()">&times;</a>
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
  name: "listproduct",
  data: () => ({
    fields: [
      {
        key: "product_id",
        label: "ID",
        sortable: true
      },
      {
        key: "name",
        label: "ชื่อ",
        sortable: true
      },
      {
        key: "detail",
        label: "รายละเอียด"
      },
      {
        key: "typegroup",
        label: "หมวดหมู่",
        sortable: true
      },
      {
        key: "type",
        label: "ประเภท",
        sortable: true
      },
      {
        key: "size",
        label: "ขนาด",
        sortable: true
      },
      {
        key: "price",
        label: "ราคา/บาท",
        sortable: true
      },
      {
        key: "timestamp",
        label: "อัพเดทล่าสุด",

        sortable: true,
        formatter(value) {
          return datetothai(value);
        }
      },
      {
        key: "pic",
        label: "รูป"
      },
      { key: "edit", label: "แก้ไข" },
      { key: "delete", label: "ลบ" }
    ],
    items: [],
    types: [],
    type: "",
    pro: "",
    typegroup: [],
    groupname: "",
    groupnameShow: "",
    name: ""
  }),
  mounted() {
    this.type = "";
    this.groupnameShow = "ทุกหมวดหมู่";
    axios.post(api.url + "/gettypegroupProduct").then(response => {
      for (let i = 0; i < response.data.length; i++) {
        this.typegroup.push({
          typegroup: response.data[i].typegroup
        });
      }
    });
    this.listproduct();
    axios.post(api.url + "/getTypeProduct").then(response => {
      for (let i = 0; i < response.data.length; i++) {
        this.types.push({
          type: response.data[i].type
        });
      }
    });
  },
  computed: {
    filteredList() {
      return this.items.filter(product => {
        return (
          product.name.toLowerCase().includes(this.name.toLowerCase()) &&
          product.type.toLowerCase().includes(this.type.toLowerCase()) &&
          product.typegroup.toLowerCase().includes(this.groupname.toLowerCase())
        );
      });
    }
  },
  methods: {
    listproduct() {
      axios.post(api.url + "/listproduct").then(response => {
        this.items = response.data;
      });
    },
    edit_product(id) {
      this.$session.set("product_id", id);
      this.$router.push("/editproduct");
    },
    delete_product(id) {
      Swal.fire({
        title: "ต้องการลบ ID " + id + " หรือไม่",
        // text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then(result => {
        if (result.value) {
          axios
            .post(api.url + "/deleteproduct", {
              product_id: id
            })
            .then(response => {
              this.listproduct();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "ลบรายการเรียบร้อย",
                showConfirmButton: false,
                timer: 1500
              });
            });
        }
      });
    },
    openNav() {
      document.getElementById("mySidenav").style.width = "250px";
    },
    closeNav() {
      document.getElementById("mySidenav").style.width = "0";
    },
    searchType(type) {
      this.type = type;
      this.$session.set("type", this.type);

      document.getElementById("mySidenav").style.width = "0";
    },
    searchtypegroup(groupname) {
      if (groupname != "") {
        this.groupname = groupname;
        this.groupnameShow = groupname;
      } else {
        this.groupname = "";
        this.groupnameShow = "ทุกหมวดหมู่";
      }

      this.type = "";
      document.getElementById("mySidenav").style.width = "0";
      axios
        .post(api.url + "/getTypeProduct", {
          typegroup: groupname
        })
        .then(response => {
          this.types = [];
          for (let i = 0; i < response.data.length; i++) {
            this.types.push({
              type: response.data[i].type
            });
          }
        });
    },
    searchType(type) {
      this.type = type;
      document.getElementById("mySidenav").style.width = "0";
    }
  }
};
function datetothai(data) {
  let year = parseInt(moment(data).format("YYYY"));
  let month = moment(data).format("MM");
  let day = moment(data).format("DD");
  let yearthai = year + 543;
  return day + "/" + month + "/" + yearthai;
}
</script>
<style scoped>
.rightbutton {
  margin: 0px 5px 0px 5px;
}

#gotop {
  /* display: none; */
  position: fixed;
  bottom: 90px;
  right: 30px;
  z-index: 99;
  font-size: 10px;
  border: none;
  outline: none;
  background-color: green;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 4px;
}
#gobot {
  /* display: none; */
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99;
  font-size: 10px;
  border: none;
  outline: none;
  background-color: red;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 4px;
}
img {
  border-radius: 2%;
}
.sidenav {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-image: linear-gradient(to bottom right, white, gray);
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
}

.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;

  color: #818181;
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: #f1f1f1;
}

.sidenav .closebtn {
  position: absolute;
  top: 0px;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

@media screen and (max-height: 450px) {
  .sidenav {
    padding-top: 15px;
  }
  .sidenav a {
    font-size: 18px;
  }
}
</style>