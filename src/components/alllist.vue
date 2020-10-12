<template>
  <div>
    <br />
    <h3>ยอดค่าใช้จ่ายแต่ละเดือน</h3>
    <b-container class="bv-example-row">
      <b-row>
        <b-col md="6">
          ปี
          <b-form-select
            @change="changeyear($event)"
            v-model="yearselect"
            :options="optionsyear"
          ></b-form-select>
        </b-col>
        <b-col md="6">
          เดือน
          <b-form-select
            @change="changemonth($event)"
            v-model="monthselect"
            :options="optionsmonth"
          ></b-form-select>
        </b-col>
        <b-col sm="1" md="3"></b-col>
        <b-col sm="11" md="6">
          <div v-for="item in listmonth" style="text-align: left;">
            <span style="font-size:20px"
              >{{ month(item.MONTH) }} {{ item.YEAR + 543 }}</span
            >
            <br />
            <span style="font-size:17px"
              >จำนวน {{ Number(item.amount).toLocaleString() }} ชิ้น
              {{ Number(item.sum).toLocaleString() }} บาท</span
            >
            <v-expansion-panels
              :popout="true"
              :multiple="true"
              :focusable="true"
              :hover="true"
            >
              <v-expansion-panel
                v-for="items1 in listtype"
                v-if="items1.MONTH == item.MONTH && items1.YEAR == item.YEAR"
              >
                <v-expansion-panel-header
                  >{{ datetothai(items1.date) }}
                  {{ Number(items1.sum).toLocaleString() }}
                  บาท</v-expansion-panel-header
                >
                <v-expansion-panel-content>
                  <v-expansion-panels
                    :popout="true"
                    :multiple="true"
                    :focusable="true"
                    :hover="true"
                  >
                    <div
                      v-for="itemstype in typeid"
                      v-if="itemstype.date == items1.date"
                    >
                      <span style="font-size:20px">{{ itemstype.type }}</span>
                      <br />
                      <br />
                      <table class="table">
                        <thead>
                          <tr>
                            <th scope="col">ชื่อสินค้า</th>
                            <th scope="col">จำนวน</th>
                            <th scope="col">ราคา</th>
                            <th scope="col">รวม</th>
                          </tr>
                        </thead>
                        <tbody
                          v-for="deepdata in deepdata"
                          v-if="
                            deepdata.type == itemstype.type &&
                              deepdata.date == itemstype.date
                          "
                        >
                          <tr>
                            <td>{{ deepdata.name }}</td>
                            <td>
                              {{ Number(deepdata.amount).toLocaleString() }}
                              ชิ้น
                            </td>
                            <td>
                              {{ Number(deepdata.price).toLocaleString() }} บาท
                            </td>
                            <td>
                              {{ Number(deepdata.sum).toLocaleString() }} บาท
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </v-expansion-panels>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <!-- </div> -->
            <br />
          </div>
        </b-col>
        <b-col sm="1" md="3"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import VueRouter from "vue-router";
import { api } from "../db/config.js";
var moment = require("moment");
export default {
  data: () => ({
    listmonth: [],
    listtype: [],
    typeid: [],
    deepdata: [],
    yearselect: null,
    monthselect: null,
    optionsyear: [],
    optionsmonth: [
      {
        value: 1,
        text: "มกราคม"
      },
      {
        value: 2,
        text: "กุมภาพันธ์"
      },
      {
        value: 3,
        text: "มีนาคม"
      },
      {
        value: 4,
        text: "เมษายน"
      },
      {
        value: 5,
        text: "พฤษภาคม"
      },
      {
        value: 6,
        text: "มิถุนายน"
      },
      {
        value: 7,
        text: "กรกฎาคม"
      },
      {
        value: 8,
        text: "สิงหาคม"
      },
      {
        value: 9,
        text: "กันยายน"
      },
      {
        value: 10,
        text: "ตุลาคม"
      },
      {
        value: 11,
        text: "พฤศจิกายน"
      },
      {
        value: 12,
        text: "ธันวาคม"
      }
    ]
  }),
  mounted() {
    axios
      .post(api.url + "/getyear/select", {
        username: JSON.parse(localStorage.getItem("user")).username
      })
      .then(response => {
        if (response.data.length > 0) { 
          this.yearselect = new Date().getFullYear();
          this.monthselect = new Date().getMonth() + 1;
          for (
            let index = response.data[0].min;
            index <= new Date().getFullYear();
            index++
          ) {
            const element = response.data[index];
            this.optionsyear.push({
              value: index,
              text: index + 543
            });
          }
        }else {
            this.optionsyear.push({
              value: new Date().getFullYear()+543,
              text: new Date().getFullYear()+543
            });
           this.yearselect=new Date().getFullYear()+543
        }

        axios
          .post(api.url + "/getlistallmonth", {
            username: JSON.parse(localStorage.getItem("user")).username,
            YEAR: this.yearselect,
            MONTH: this.monthselect
          })
          .then(response => {
            this.listmonth = response.data;
            axios
              .post(api.url + "/getlistalltype", {
                username: JSON.parse(localStorage.getItem("user")).username
              })
              .then(response => {
                this.listtype = response.data;
                axios
                  .post(api.url + "/getteype/byhistoryid", {
                    username: JSON.parse(localStorage.getItem("user")).username
                  })
                  .then(response => {
                    this.typeid = response.data;
                    axios
                      .post(api.url + "/gettdata/byhistoryid", {
                        username: JSON.parse(localStorage.getItem("user"))
                          .username
                      })
                      .then(response => {
                        this.deepdata = response.data;
                      });
                  });
              });
          });
      });
  },
  computed: {},
  methods: {
    month(m) {
      if (m == 1) {
        return "มกราคม";
      } else if (m == 2) {
        return "กุมภาพันธ์";
      } else if (m == 3) {
        return "มีนาคม";
      } else if (m == 4) {
        return "เมษายน";
      } else if (m == 5) {
        return "พฤษภาคม";
      } else if (m == 6) {
        return "มิถุนายน";
      } else if (m == 7) {
        return "กรกฎาคม";
      } else if (m == 8) {
        return "สิงหาคม";
      } else if (m == 9) {
        return "กันยายน";
      } else if (m == 10) {
        return "ตุลาคม";
      } else if (m == 11) {
        return "พฤศจิกายน";
      } else if (m == 12) {
        return "ธันวาคม";
      }
    },
    datetothai(data) {
      let year = parseInt(moment(data).format("YYYY"));
      let month = moment(data).format("MM");
      let day = moment(data).format("DD");
      let yearthai = year + 543;
      return day + "/" + month + "/" + yearthai;
    },
    changeyear(year) {
      axios
        .post(api.url + "/getlistallmonth", {
          username: JSON.parse(localStorage.getItem("user")).username,
          YEAR: this.yearselect,
          MONTH: this.monthselect
        })
        .then(response => {
          this.listmonth = response.data;
        });
    },
    changemonth(month) {
      axios
        .post(api.url + "/getlistallmonth", {
          username: JSON.parse(localStorage.getItem("user")).username,
          YEAR: this.yearselect,
          MONTH: this.monthselect
        })
        .then(response => {
          this.listmonth = response.data;
        });
    }
  }
};
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

<style>
</style>