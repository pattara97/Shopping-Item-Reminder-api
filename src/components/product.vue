<template>
  <div class="hello" id="top">
    <span
      style="margin-top:-20px;margin-left:5%;float:left;cursor:pointer;"
      @click="openNav()"
      >&#9776; ตัวเลือกสินค้า : {{ pro }} {{ groupname }} {{ type }}</span
    >
    <br />
    <b-row>
      <b-col sm="1" md="4">
        <!-- <vue-range-slider v-model="value" :min="min" :max="max" :enable-cross="enableCross"></vue-range-slider> -->
      </b-col>
      <b-col sm="10" md="4">
        <b-container>
          <b-form-input
            v-model="search"
            placeholder="ค้นหาสินค้า"
          ></b-form-input>
        </b-container>
      </b-col>
    </b-row>
    <br />
    <b-container>
      <div v-if="filteredList.length > 0">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-sm-12" v-for="item in filteredList">
            <div>
              <img v-bind:src="item.pic" />
            </div>
            <div class="hello">
              <span>
                <p>
                  {{ item.name }} {{ item.size }}
                  <span style="color:red">{{ item.price }}</span
                  >฿
                </p>
                <p>{{ item.detail }}</p>
                <p>จำนวน ({{ Number(item.amount).toLocaleString() }})</p>
                <div class="dot">
                  <a @click="sub(item.product_id)">
                    <b-icon icon="dash" style="color:white"></b-icon>
                  </a>
                </div>
                <div class="dot">
                  <a @click="plus(item.product_id)">
                    <b-icon icon="plus" style="color:white"></b-icon>
                  </a>
                </div>
              </span>
            </div>
          </div>
        </div>
        <b-button variant="success" @click="PreviousPage">ก่อนหน้า</b-button
        >&nbsp; &nbsp;
        <b-button variant="success" @click="NextPange">ถัดไป</b-button>
      </div>
      <div v-else>
        <br />
        <p>ไม่พบสินค้า</p>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div id="bot"></div>
    </b-container>

    <template>
      <div class="banner">
        <a
          class="btn-floating btn-large red"
          @click="goToList()"
          style="padding: 12px;"
          id="tooltip-target-1"
          v-if="countItem > 0"
        >
          <b-icon v-if="btn" class="h3" icon="cart-check"></b-icon>
          <b-icon v-if="!btn" class="h4" icon="cart-check"></b-icon>
        </a>
      </div>
      <button v-scroll-to="{ element: '#top', offset: -200 }" id="gotop">
        กลับด้านบน
      </button>
      <button v-scroll-to="{ element: '#bot' }" id="gobot">ไปด้านล่าง</button>
    </template>

    <div id="mySidenav" class="sidenav">
      <b @click="closeNav" style="font-size:20px">Shopping Item Reminder</b>

      <div role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button
              block
              v-b-toggle.accordion-1
              variant="info"
              @click="popproduct()"
              >สินค้ายอดนิยม</b-button
            >
          </b-card-header>
          <b-collapse
            id="accordion-1"
            accordion="my-accordion"
            role="tabpanel"
          ></b-collapse>
        </b-card>

        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button
              block
              v-b-toggle.accordion-2
              variant="info"
              @click="newproduct"
              >สินค้าใหม่</b-button
            >
          </b-card-header>
          <b-collapse
            id="accordion-2"
            accordion="my-accordion"
            role="tabpanel"
          ></b-collapse>
        </b-card>
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-3 variant="info"
              >หมวดหมู่สินค้า</b-button
            >
          </b-card-header>
          <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <a style="cursor:pointer" @click="searchtypegroup('')"
                >ทุกหมวดหมู่</a
              >
              <a
                style="cursor:pointer"
                v-for="item of typegroup"
                @click="searchtypegroup(item.typegroup)"
                >{{ item.typegroup }}</a
              >
            </b-card-body>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-1" v-if="groupname != ''">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-4 variant="info"
              >ประเภทสินค้า</b-button
            >
          </b-card-header>
          <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <a style="cursor:pointer" @click="searchType('')">ทุกประเภท</a>
              <a
                style="cursor:pointer"
                v-for="item of types"
                @click="searchType(item.type)"
                >{{ item.type }}</a
              >
            </b-card-body>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-5 variant="info"
              >ช่วงราคา</b-button
            >
          </b-card-header>
          <b-collapse id="accordion-5" accordion="my-accordion" role="tabpanel">
            <div>
              <br />
              <b-form-select
                v-model="value"
                :options="option"
                @change="seleceprice"
              ></b-form-select>
              <br />
              <br />
            </div>
          </b-collapse>
        </b-card>
      </div>
      <a href="javascript:void(0)" class="closebtn" @click="closeNav()"
        >&times;</a
      >
    </div>
    <b-tooltip
      target="tooltip-target-1"
      triggers="hover"
      placement="Tooltip on the left"
      >จำนวน {{ countItem }} ชิ้น</b-tooltip
    >
  </div>
</template>

<script>
import axios from "axios";
import VueRouter from "vue-router";
import { api } from "../db/config.js";
import Vue from "vue";
import VueSession from "vue-session";
import "vue-range-component/dist/vue-range-slider.css";
import VueRangeSlider from "vue-range-component";
Vue.use(VueSession);
let amount;
let product = [];
let max = 0;
export default {
  name: "product",
  components: {
    VueRangeSlider
  },
  data: () => ({
    name: "product",
    countItem: amount,
    products: product,
    search: "",
    user: JSON.parse(localStorage.getItem("user")).role,
    types: [],
    type: "",
    pro: "",
    typegroup: [],
    groupname: "",
    value: "",
    max: 0,
    option: [],
    btn: true,
    page:1
  }),

  components: {
    VueRangeSlider
  },

  created() {
    this.pro = "สินค้าใหม่";
    axios.post(api.url + "/gettypegroupProduct").then(response => {
      for (let i = 0; i < response.data.length; i++) {
        this.typegroup.push({
          typegroup: response.data[i].typegroup
        });
      }
    });
    if (
      this.$session.get("groupname") != null ||
      this.$session.get("groupname") != undefined
    ) {
      this.groupname = this.$session.get("groupname");
    } else {
      this.groupname = "";
    }
    if (
      this.$session.get("type") != null ||
      this.$session.get("type") != undefined
    ) {
      this.type = this.$session.get("type");
    } else {
      this.type = "";
    }
    if (
      this.$session.get("cart") != null ||
      this.$session.get("cart") != undefined
    ) {
      product = this.$session.get("cart");
      this.products = product;
      this.countItem = getAmount(product);
    } else {
      product = [];
      axios.post(api.url + "/getData").then(response => {
        for (let i = 0; i < response.data.length; i++) {
          product.push({
            product_id: response.data[i].product_id,
            detail: response.data[i].detail,
            typegroup: response.data[i].typegroup,
            type: response.data[i].type,
            size: response.data[i].size,
            name: response.data[i].name,
            price: response.data[i].price,
            pic: response.data[i].pic,
            amount: 0,
            total: 0,
            status: false,
            countuse: response.data[i].countuse,
            timestamp: response.data[i].timestamp
          });
        }
        this.products = product;
        this.$session.set("cart", this.products);
        this.countItem = getAmount(product);
        if (
          this.$session.get("reUseHis") != null ||
          this.$session.get("reUseHis") != undefined
        ) {
          var data = [];
          data = this.$session.get("reUseHisData");
          for (let i = 0; i < data.length; i++) {
            if (data[i].del == "true") {
              for (let j = 0; j < product.length; j++) {
                if (product[j].product_id == data[i].product_id) {
                  product[j].amount = data[i].amount;
                  product[j].total = data[i].amount * product[j].price;
                  product[j].status = false;
                }
              }
            }
          }
          this.countItem = getAmount(product);
          this.$session.set("cart", this.products);
        }
      });
    }
    axios.post(api.url + "/maxprice").then(response => {
      this.max = response.data[0].maxprice;

      max = this.max;
      this.setpriceselect();
      this.value = "all";
    });
    // this.filteredList
  },
  computed: {
    filteredList() {
      let value1 = spritselectprice1(this.value);
      let value2 = spritselectprice2(this.value);
      return this.products.filter(product => {
        return (
          product.name.toLowerCase().includes(this.search.toLowerCase()) &&
          product.typegroup
            .toLowerCase()
            .includes(this.groupname.toLowerCase()) &&
          product.type.toLowerCase().includes(this.type.toLowerCase()) &&
          product.price >= value1 &&
          product.price <= value2
        );
      });
    }
  },
  methods: {
    plus(index) {
      for (let i = 0; i < product.length; i++) {
        if (product[i].product_id == index) {
          this.countItem += 1;
          product[i].amount = product[i].amount + 1;
          product[i].total = product[i].amount * product[i].price;
        }
      }
      this.$session.set("cart", this.products);
      this.btn = false;
      setTimeout(() => {
        this.btn = true;
      }, 100);
    },
    sub(index) {
      for (let i = 0; i < product.length; i++) {
        if (product[i].product_id == index) {
          if (product[i].amount > 0) {
            this.countItem -= 1;
            product[i].amount = product[i].amount - 1;
            product[i].total = product[i].amount * product[i].price;
            if (product[i].amount == 0) {
              product[i].status = false;
            }
          }
        }
      }
      this.$session.set("cart", this.products);
      this.btn = false;
      setTimeout(() => {
        this.btn = true;
      }, 100);
    },
    goToList() {
      if (this.countItem > 0) {
        this.$router.push("/list");
      }
    },
    openNav() {
      document.getElementById("mySidenav").style.width = "250px";
    },
    closeNav() {
      document.getElementById("mySidenav").style.width = "0";
    },
    searchtypegroup(groupname) {
      this.groupname = groupname;
      this.type = "";
      this.$session.set("groupname", this.groupname);
      if (this.groupname == "") {
        this.pro = "สินค้าใหม่";
      }
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
      this.$session.set("type", this.type);
      if (this.type == "") {
        this.pro = "สินค้าใหม่";
      }
      document.getElementById("mySidenav").style.width = "0";
    },
    newproduct() {
      this.sortedNew();
      this.pro = "สินค้าใหม่";
      this.type = "";
      this.groupname = "";
      document.getElementById("mySidenav").style.width = "0";
    },
    popproduct() {
      this.sortedPop();
      this.pro = "สินค้ายอดนิยม";
      this.type = "";
      this.groupname = "";
      document.getElementById("mySidenav").style.width = "0";
    },
    computedFonksiyon() {
      this.products.sort(function(x, y) {
        return y.countuse - x.countuse;
      });
      return this.products;
    },
    sortedPop() {
      return this.products.sort((a, b) => b.countuse - a.countuse);
    },
    sortedNew() {
      return this.products.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    },
    setpriceselect() {
      this.option.push({
        value: "all",
        text: "ทั้งหมด"
      });
      this.option.push({
        value: "0-100",
        text: "0-100"
      });
      this.option.push({
        value: "101-200",
        text: "101-200"
      });
      this.option.push({
        value: "201-300",
        text: "201-300"
      });
      this.option.push({
        value: "301-400",
        text: "301-400"
      });
      this.option.push({
        value: "401-500",
        text: "401-500"
      });
      this.option.push({
        value: "501-600",
        text: "501-600"
      });
      this.option.push({
        value: "601-700",
        text: "601-700"
      });
      this.option.push({
        value: "701-800",
        text: "701-800"
      });
      this.option.push({
        value: "801-900",
        text: "801-900"
      });
      this.option.push({
        value: "901-1000",
        text: "901-1000"
      });
      this.option.push({
        value: "1001+",
        text: "1001+"
      });
    },
    seleceprice() {
      document.getElementById("mySidenav").style.width = "0";
    },
    PreviousPage() {
      console.log("ก่อนห");
    },
    NextPange() {
          console.log("ถภถัดไปผ");
    }
  }
};

function getAmount(x) {
  amount = 0;
  for (let i = 0; i < x.length; i++) {
    amount += parseInt(x[i].amount);
  }
  return amount;
}
function spritselectprice1(a) {
  if (a == "all") {
    return 1;
  } else if (a == "1001+") {
    return 1001;
  } else {
    return parseInt(a.split("-")[0]);
  }
}
function spritselectprice2(b) {
  if (b == "all") {
    return max;
  } else if (b == "1001+") {
    return 99999;
  } else {
    return parseInt(b.split("-")[1]);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.dot {
  height: 25px;
  width: 25px;
  background-color: lightseagreen;
  border-radius: 50%;
  display: inline-block;
}
.hello {
  padding: 30px 0px 30px 0px;
}
.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: auto;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  padding: 15px;
}
.btn-floating.btn-large {
  width: 56px;
  height: 56px;
  padding: 0;
  position: absolute;
  right: 15px;
}
.btn-large {
  height: 54px;
  line-height: 54px;
  font-size: 15px;
  padding: 0 28px;
}
.btn-floating {
  display: inline-block;
  color: #fff;
  position: relative;
  overflow: hidden;
  z-index: 1;
  width: 40px;
  height: 40px;
  line-height: 40px;
  padding: 0;
  background-color: #26a69a;
  border-radius: 50%;
  -webkit-transition: background-color 0.3s;
  transition: background-color 0.3s;
  cursor: pointer;
  vertical-align: middle;
}
.btn,
.btn-large,
.btn-small {
  text-decoration: none;
  color: #fff;
  background-color: rgb(255, 102, 0);
  text-align: center;
  letter-spacing: 0.5px;
  -webkit-transition: background-color 0.2s ease-out;
  transition: background-color 0.2s ease-out;
  cursor: pointer;
}
div.banner {
  margin: 0;
  font-size: 80% /*smaller*/;
  font-weight: bold;
  line-height: 1.1;
  text-align: center;
  position: fixed;
  top: 8em;
  left: auto;
  width: 8.5em;
  right: 2em;
}
div.banner p {
  margin: 0;
  padding: 0.3em 0.4em;
  font-family: Arial, sans-serif;
  background: #900;
  border: thin outset #900;
  color: white;
}

div.banner a,
div.banner em {
  display: block;
  margin: 0 0.5em;
}
div.banner a,
div.banner em {
  border-top: 2px groove #900;
}
div.banner a:first-child {
  border-top: none;
}
div.banner em {
  color: #cfc;
}

div.banner a:link {
  text-decoration: none;
  color: white;
}
div.banner a:visited {
  text-decoration: none;
  color: #ccc;
}
div.banner a:hover {
  background: black;
  color: white;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 2%;
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
