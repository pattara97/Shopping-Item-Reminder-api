<template>
  <div class="container">
    <div class="list">
      <div class="row">
        <div class="col-sm-0 col-md-1 col-lg-1"></div>
        <div class="col-sm-12 col-md-10 col-lg-10">
          <h4 v-if="products.length>0">รายการสินค้า</h4>

          <h4 v-else>ไม่มีรายการสินค้า</h4>
          <h5 v-if="listname">{{listname}}</h5>

          <vue-good-table
            v-if="products.length>0"
            :columns="columns"
            :rows="rows"
            :group-options="{
    enabled: true
  }"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'name'">{{props.row.name}}</span>
              <span v-if="props.column.field == 'size'">{{props.row.size}}</span>

              <div v-if="props.column.field == 'amount'">
                <div v-if="props.row.name!='รวม'">
                  <b-row v-if="props.column.field == 'amount'">
                    <b-col sm="1" md="4" style="text-align:right">
                      <b-icon
                        @click="sub(props.row.product_id)"
                        icon="dash"
                        scale="2"
                        variant="status"
                      ></b-icon>
                    </b-col>

                    <b-col sm="10" md="4">
                      <center>
                        <b-form-input
                          v-model="props.row.amount"
                          type="number"
                          step="1"
                          min="1"
                          v-on:keydown="filterKey"
                          v-on:input="filterInput(props.row.product_id,props.row.amount)"
                        ></b-form-input>
                      </center>
                    </b-col>
                    <b-col sm="1" md="4">
                      <b-icon
                        @click="plus(props.row.product_id)"
                        icon="plus"
                        scale="2"
                        variant="status"
                      ></b-icon>
                    </b-col>
                  </b-row>
                </div>
                <div
                  v-if="props.row.name=='รวม'"
                  style="text-align:center"
                >{{Number(props.row.amount).toLocaleString()}} ชิ้น</div>
              </div>

              <div v-if="props.column.field == 'price'">
                <span
                  style="color:red"
                  v-if="props.row.price != 0"
                >{{ Number(props.row.price).toLocaleString() }}</span>
              </div>

              <div v-if="props.column.field == 'total'">
                <div
                  v-if="props.row.name!='รวม'"
                >{{Number(props.row.price*props.row.amount).toLocaleString()}} ฿</div>
                <div v-if="props.row.name=='รวม'">{{Number(props.row.total).toLocaleString()}} ฿</div>
              </div>

              <!-- <div v-if="props.column.field == 'status'" style="text-align:center">
                <div v-if="props.row.status!=null">
                  <b-icon
                    v-if="!props.row.status"
                    @click="status(props.row.product_id,props.row.status)"
                    icon="square"
                    scale="2"
                    variant="success"
                  ></b-icon>
                  <b-icon
                    v-if="props.row.status"
                    @click="status(props.row.product_id,props.row.status)"
                    icon="check"
                    scale="2"
                    variant="success"
                  ></b-icon>
                </div>
              </div>-->
              <div v-if="props.column.field == 'delete'" style="text-align:center">
                <b-icon
                  v-if="props.row.name!='รวม'"
                  @click="del(props.row.product_id)"
                  icon="x-circle"
                  scale="2"
                  variant="danger "
                ></b-icon>
              </div>
            </template>
          </vue-good-table>
          <br />
          <div>
            <router-link to="/product">
              <b-button class="but" variant="primary" style="color: black;">เพิ่ม</b-button>
            </router-link>
            <b-button class="but" variant="danger" @click="clear()">ล้าง</b-button>
            <b-button
              class="but"
              v-if="!save||save=='half'"
              variant="outline-primary"
              @click="savelist()"
            >บันทึก</b-button>
            <b-button
              class="but"
              v-if="save&&save!='half'"
              variant="success"
              @click="savelist()"
            >เสร็จสิ้น</b-button>
          </div>
        </div>
        <div class="col-sm-0 col-md-1 col-lg-1"></div>
      </div>
    </div>
  </div>
</template>
<script>
import VueRouter from "vue-router";
import axios from "axios";
import { api } from "../db/config.js";
import Vue from "vue";
const Swal = require("sweetalert2");
var moment = require("moment");
let balance;
var loggedIn;
let countstatus = 0;
let amount = 0;
export default {
  name: "list",
  props: {
    msg: String
  },
  data: () => ({
    name: "list",
    countItem: 0,
    balance: 0,
    products: [],
    save: false,
    listname: null,
    columns: [
      {
        label: "ชื่อ",
        field: "name"
      },
      {
        label: "ขนาด",
        field: "size"
      },
      {
        label: "จำนวน",
        field: "amount"
      },
      {
        label: "ราคา",
        field: "price",
        type: "number"
      },
      {
        label: "รวม",
        field: "total",
        type: "number"
      },
      // {
      //   label: "ซื้อ",
      //   field: "status"
      // },
      {
        label: "เอาออก",
        field: "delete"
      }
    ],
    rows: []
  }),
  mounted() {
    loggedIn = JSON.parse(localStorage.getItem("user"));
    if (this.$session.get("cart")) {
      this.products = this.$session.get("cart");
      this.balance = getBalance(this.products);
    }
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].status == true) {
        countstatus += 1;
      }
      if (this.products[i].amount > 0) {
        if (this.products[i].type) {
        }
        amount += 1;
      }
    }
    if (countstatus == amount) {
      this.save = countstatus == amount;
    } else if (countstatus == 0) {
      this.save = countstatus == amount;
    } else if (countstatus < amount) {
      this.save = "half";
    }
    this.countItem = getAmount(this.products);
    if (this.$session.get("reUseHis")) {
      this.listname = this.$session.get("reUseHis").name;
    }
    this.updatetable;
  },
  computed: {
    groups() {
      var listproduct = [];
      for (let index = 0; index < this.products.length; index++) {
        const element = this.products[index];
        if (element.amount > 0) {
          listproduct.push(element);
        }
      }
      return groupBy(listproduct, "type");
    },
    updatetable() {
      if (this.groups != {}) {
        for (const property in this.groups) {
          this.rows.push({
            mode: "span", // span means this header will span all columns
            label: property, // this is the label that'll be used for the header
            html: false, // if this is true, label will be rendered as html
            children: this.groups[property]
          });
        }
        this.rows[this.rows.length - 1].children.push({
          amount: this.countItem,
          countuse: 0,
          detail: "",
          name: "รวม",
          pic: "",
          price: "",
          product_id: 0,
          size: "",
          status: null,
          timestamp: "",
          total: this.balance,
          type: "0",
          typegroup: "0"
        });
      }
    }
  },

  methods: {
    clear() {
      this.products = [];
      this.$session.destroy();
      this.balance = getBalance(this.products);
      this.$router.push("/product");
    },
    savelist: function() {
      if (
        (this.$session.get("reUseHis") != null &&
          this.$session.get("reUseHis").complete == "false") ||
        (this.$session.get("reUseHis") != undefined &&
          this.$session.get("reUseHis").complete == "false")
      ) {
        Swal.fire({
          title: "กรุณากรอกชื่อรายการ",
          input: "text",
          inputAttributes: {
            autocapitalize: "off"
          },
          showCancelButton: true,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ยืนยัน",
          showLoaderOnConfirm: true,
          inputValue: this.$session.get("reUseHis").name,
          inputValidator: value => {
            if (!value) {
              return "กรุณากรอกชื่อรายการ";
            }
          }
        }).then(result => {
          if (result.value) {
            axios
              .post(api.url + "/select_list", {
                list_id: this.$session.get("reUseHis").history_id
              })
              .then(response => {
                for (let i = 0; i < response.data.length; i++) {
                  axios
                    .post(api.url + "/delect_his_list", {
                      his_id: response.data[i].history_detail_id
                    })
                    .then(response => {});
                }
                axios
                  .post(api.url + "/delete_list", {
                    list_id: this.$session.get("reUseHis").history_id
                  })
                  .then(response => {});
                let id = makeid(10);
                axios
                  .post(api.url + "/savelist", {
                    history_id: id,
                    total: this.balance,
                    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                    user: loggedIn.username,
                    complete: this.save,
                    name: result.value,
                    amount: this.countItem
                  })
                  .then(response => {
                    let product_id, amount, status;
                    for (let i = 0; i < this.products.length; i++) {
                      if (this.products[i].amount > 0) {
                        product_id = this.products[i].product_id;
                        amount = this.products[i].amount;
                        status = this.products[i].status;
                        axios
                          .post(api.url + "/savehistorylist", {
                            history_id: id,
                            product_id: product_id,
                            amount: amount,
                            status: status,
                            timestamp: moment().format("YYYY-MM-DD HH:mm:ss")
                          })
                          .then(response => {});
                      }
                    }
                    this.products = [];
                    this.$session.destroy();
                    this.balance = getBalance(this.products);
                    this.$router.push("/product");
                    Swal.fire({
                      position: "center",
                      icon: "success",
                      title: "บันทึกรายการ",
                      showConfirmButton: false,
                      timer: 1500
                    });
                  });
              });
          }
        });
      } else {
        Swal.fire({
          title: "กรุณากรอกชื่อรายการ",
          input: "text",
          inputAttributes: {
            autocapitalize: "off"
          },
          showCancelButton: true,
          cancelButtonText: "ยกเลิก",
          confirmButtonText: "ยืนยัน",
          showLoaderOnConfirm: true,
          inputValidator: value => {
            if (!value) {
              return "กรุณากรอกชื่อรายการ";
            }
          }
        }).then(result => {
          if (result.value) {
            let id = makeid(10);
            axios
              .post(api.url + "/savelist", {
                history_id: id,
                total: this.balance,
                timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                user: loggedIn.username,
                complete: this.save,
                name: result.value,
                amount: this.countItem
              })
              .then(response => {
                let product_id, amount, status;
                for (let i = 0; i < this.products.length; i++) {
                  if (this.products[i].amount > 0) {
                    product_id = this.products[i].product_id;
                    amount = this.products[i].amount;
                    status = this.products[i].status;
                    axios
                      .post(api.url + "/savehistorylist", {
                        history_id: id,
                        product_id: product_id,
                        amount: amount,
                        status: status,
                        timestamp: moment().format("YYYY-MM-DD HH:mm:ss")
                      })
                      .then(response => {});
                    axios
                      .post(api.url + "/addCountUse", {
                        product_id: product_id
                      })
                      .then(response => {});
                  }
                }
                this.products = [];
                this.$session.destroy();
                this.balance = getBalance(this.products);
                this.$router.push("/product");
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "บันทึกรายการ",
                  showConfirmButton: false,
                  timer: 1500
                });
              });
          }
        });
      }
    },
    plus(index) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].product_id == index) {
          if (this.products[i].amount > 0) {
            this.countItem += 1;
            this.products[i].amount = this.products[i].amount + 1;
            this.products[i].total =
              this.products[i].amount * this.products[i].price;
            this.balance = getBalance(this.products);
            this.$session.set("cart", this.products);
            this.rows = [];
            this.updatetable;
          }
        }
      }
    },
    sub(index) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].product_id == index) {
          if (this.products[i].amount > 1) {
            this.countItem -= 1;
            this.products[i].amount = this.products[i].amount - 1;
            this.products[i].total =
              this.products[i].amount * this.products[i].price;
            this.balance = getBalance(this.products);
            this.$session.set("cart", this.products);
            this.rows = [];
            this.updatetable;
          }
        }
      }
    },
    status(index, status) {
      let countstatus = 0;
      let amount = 0;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].product_id == index) {
          this.products[i].status = !status;
        }
        if (this.products[i].status == true) {
          countstatus += 1;
        }
        if (this.products[i].amount > 0) {
          amount += 1;
        }
      }
      this.$session.set("cart", this.products);
      if (countstatus == amount) {
        this.save = countstatus == amount;
      } else if (countstatus == 0) {
        this.save = countstatus == amount;
      } else if (countstatus < amount) {
        this.save = "half";
      }
    },
    del(index) {
      Swal.fire({
        title: "ต้องการเอารายการนี้หรือไม่",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่",
        cancelButtonText: "ไม่"
      }).then(result => {
        if (result.value) {
          for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].product_id == index) {
              if (this.products[i].amount >= 1) {
                this.countItem -= this.products[i].amount;
                this.products[i].amount = 0;
                this.products[i].status = false;
                this.products[i].total = 0;
                this.balance = getBalance(this.products);
                this.$session.set("cart", this.products);
                this.rows = [];
                if (this.countItem == 0) {
                  this.$router.push("/product");
                }
                this.updatetable;
              }
            }
          }
        }
      });
    },
    filterInput(id, amount) {
      console.log("sdf");
      if (amount == "") {
        amount = 0;
      } else {
        amount = parseInt(amount);
      }
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].product_id == id) {
          this.products[i].amount = amount;
          this.products[i].total =
            this.products[i].amount * this.products[i].price; 
          this.countItem = getAmount(this.products);
          this.balance = getBalance(this.products);
          this.$session.set("cart", this.products);
          this.rows = [];
          this.updatetable;
        }
      }
      if (this.countItem == 0) {
        this.$router.push("/product");
      }
    },
    filterKey(e) {
      const key = e.key;
      if (key === ".") return e.preventDefault();
      if (key === "e") return e.preventDefault();
      if (key === "E") return e.preventDefault();
      if (key === "0") return e.preventDefault();
      if (key === "-") return e.preventDefault();
    },
    sumCount(rowObj) {
      let sum = 0;
      for (let i = 0; i < rowObj.children.length; i++) {
        sum += rowObj.children[i].count;
      }
      return sum;
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
function getBalance(x) {
  balance = 0;
  for (let i = 0; i < x.length; i++) {
    balance += x[i].total;
  }
  return balance;
}
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function groupBy(array, key) {
  const result = {};
  array.forEach(item => {
    if (!result[item[key]]) {
      result[item[key]] = [];
    }
    result[item[key]].push(item);
  });
  return result;
}
</script>

<style scoped>
.list {
  padding: 30px 0px 30px 0px;
}
.but {
  margin: 0px 5px 0px 5px;
}
</style>