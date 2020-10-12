<template>
  <div id="list_history">
    <div class="container">
      <div class="row">
        <div class="col-sm-0 col-md-1 col-lg-1"></div>
        <div class="col-sm-12 col-md-10 col-lg-10">
          <h4 v-if="products">รายละเอียดรายการ</h4>
          <h5 v-if="products">{{history_data.name}} {{date}}</h5>
          <h4 v-else>ไม่มีรายการสินค้า</h4>
          <div class="row" style="overflow-x: auto">
            <div class="col-sm-12">
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
                          <b-icon icon="dash" scale="2" variant="status"></b-icon>
                        </b-col>

                        <b-col sm="10" md="4">
                          <center>
                            <b-form-input
                              disabled
                              v-model="props.row.amount"
                              type="number"
                              step="1"
                              v-on:keydown="filterKey"
                              v-on:input="filterInput(props.row.product_id,props.row.amount)"
                            ></b-form-input>
                          </center>
                        </b-col>
                        <b-col sm="1" md="4">
                          <b-icon icon="plus" scale="2" variant="status"></b-icon>
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
                        v-if="props.row.status=='false'"
                        icon="square"
                        scale="2"
                        variant="success"
                      ></b-icon>
                      <b-icon
                        v-if="props.row.status=='true'"
                        icon="check"
                        scale="2"
                        variant="success"
                      ></b-icon>
                    </div>
                  </div>-->
                  <div v-if="props.column.field == 'del'" style="text-align:center">
                    <b-icon
                      v-if="props.row.name!='รวม'&&props.row.del=='false'"
                      @click="del(props.row.product_id)"
                      icon="x-circle"
                      scale="2"
                      variant="danger"
                    ></b-icon>
                    <b-icon
                      v-if="props.row.name!='รวม'&&props.row.del=='true'"
                      @click="del(props.row.product_id)"
                      icon="check"
                      scale="2"
                      variant="success"
                    ></b-icon>
                  </div>
                </template>
              </vue-good-table>
              <br />
              <div>
                <b-button class="but" onclick="window.history.back()">กลับ</b-button>
                <b-button class="but" variant="danger" @click="delete_list()">ลบ</b-button>
                <b-button v-if="liststatus == 'true'" class="but" variant="success" @click="reUse()">ใช้งาน</b-button>
                <b-button v-if="liststatus != 'true'" class="but" variant="success" @click="reUse()">เพิ่ม</b-button>
              </div>
            </div>
          </div>
          <!-- <div class="col-sm-0 col-md-1 col-lg-1"></div> -->
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
let balance;
let product;
var loggedIn;
export default {
  name: "list_history",
  data: () => ({
    products: [],
    countItem: 0,
    balance: 0,
    history_data: [],
    date: "",
    liststatus: "",
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
        label: "เลือกใช้",
        field: "del"
      }
    ],
    rows: []
  }),
  mounted() {
    loggedIn = JSON.parse(localStorage.getItem("user"));
    axios
      .post(api.url + "/getHistoryName", {
        history_id: this.$session.get("list")[0]
      })
      .then(response => {
        this.history_data = response.data[0];
        this.liststatus = response.data[0].complete;
        this.date = datetothai(this.history_data.timestamp);
        if (
          (this.liststatus == "true" || this.liststatus == "half") &&
          this.$session.get("list")[1] == true
        ) {
          axios
            .post(api.url + "/getHistoryListtrue", {
              list_id: this.$session.get("list")[0]
            })
            .then(response => {
              this.products = response.data;
              for (let index = 0; index < this.products.length; index++) {
                this.products[index].del = "true";
                this.balance=this.balance+response.data[index].total
              }
              // this.balance = response.data[0].total;
              this.countItem = getAmount(this.products);
              this.updatetable;
            });
        } else if (
          (this.liststatus == "false" || this.liststatus == "half") &&
          this.$session.get("list")[1] == false
        ) {
          axios
            .post(api.url + "/getHistoryListfalse", {
              list_id: this.$session.get("list")[0]
            })
            .then(response => {
              this.products = response.data;
              for (let index = 0; index < this.products.length; index++) {
                this.products[index].del = "true";
                 this.balance=this.balance+response.data[index].total
              }
              // this.balance = response.data[0].total;
              this.countItem = getAmount(this.products);
              this.updatetable;
            });
        }
      });
  },
  computed: {
    updatetable() {
      product = this.products;
      if (groups() != {}) {
        for (const property in groups()) {
          this.rows.push({
            mode: "span", // span means this header will span all columns
            label: property, // this is the label that'll be used for the header
            html: false, // if this is true, label will be rendered as html
            children: groups()[property]
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
    delete_list() {
      Swal.fire({
        title: "ต้องการลบรายการ " + this.name + " หรือไม่",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then(result => {
        if (result.value) {
          axios
            .post(api.url + "/select_list", {
              list_id: this.$session.get("list")[0]
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
                  list_id: this.$session.get("list")[0]
                })
                .then(response => {
                  this.$router.push("/history");
                });
            });
          Swal.fire({
            position: "center",
            icon: "success",
            title: "ลบรายการเรียบร้อย",
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    },
    savelist: function() {
      this.$router.push("/product");
    },
    reUse: function() {
      this.$session.set("reUseHis", this.history_data);
      this.$session.set("reUseHisData", this.products);
      this.$session.set("cart", null);
      this.$router.push("/product");
    },
    plus(index) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].product_id == index) {
          if (this.products[i].amount > 0) {
            this.countItem += 1;
            this.products[i].amount = parseInt(this.products[i].amount) + 1;
            this.products[i].total =
              parseInt(this.products[i].amount) *
              parseInt(this.products[i].price);
          }
        }
      }
      this.balance = getBalance(this.products);
    },
    sub(index) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].product_id == index) {
          if (this.products[i].amount > 1) {
            this.countItem -= 1;
            this.products[i].amount = parseInt(this.products[i].amount) - 1;
            this.products[i].total =
              parseInt(this.products[i].amount) *
              parseInt(this.products[i].price);
          }
        }
      }
      this.balance = getBalance(this.products);
    },
    del(index) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].product_id == index) {
          if (this.products[i].del == "false") {
            this.products[i].del = "true";
            this.rows = [];
            this.updatetable;
          } else if (this.products[i].del == "true") {
            this.products[i].del = "false";
            this.rows = [];
            this.updatetable;
          }
        }
      }
    },
    filterInput(id, amount) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].product_id == id) {
          if (this.products[i].amount > 1) {
            this.products[i].amount = this.products[i].amount = amount;
            this.products[i].total =
              this.products[i].amount * this.products[i].price;
          }
        }
      }
      this.countItem = getAmount(this.products);
      this.balance = getBalance(this.products);
      this.$session.set("cart", this.products);
    },
    filterKey(e) {
      const key = e.key;

      // If is '.' key, stop it
      if (key === ".") return e.preventDefault();

      // OPTIONAL
      // If is 'e' key, stop it
      if (key === "e") return e.preventDefault();
      if (key === "0") return e.preventDefault();
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
function boo(value) {
  if (value == "true") {
    return "false";
  } else {
    return "true";
  }
}
function getBalance(x) {
  balance = 0;
  for (let i = 0; i < x.length; i++) {
    balance += parseInt(x[i].amount * parseInt(x[i].price));
  }
  return balance;
}
function getAmount(x) {
  let amount = 0;
  for (let i = 0; i < x.length; i++) {
    amount += parseInt(x[i].amount);
  }
  return amount;
}
function datetothai(data) {
  let year = parseInt(moment(data).format("YYYY"));
  let month = moment(data).format("MM");
  let day = moment(data).format("DD");
  let yearthai = year + 543;
  return day + "/" + month + "/" + yearthai;
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
function groups() {
  var listproduct = [];
  for (let index = 0; index < product.length; index++) {
    const element = product[index];
    if (element.amount > 0) {
      listproduct.push(element);
    }
  }
  return groupBy(listproduct, "type");
}
</script>
<style scoped>
.but {
  margin: 0px 5px 0px 5px;
}
</style>

