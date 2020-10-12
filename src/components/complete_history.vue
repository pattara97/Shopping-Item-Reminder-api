<template>
  <div>
    <div v-if="items.length > 0 || items.length != []">
      <br />
      <b-row class="justify-content-md-center">
        <b-col class="col-lg-8 col-md-10 col-sm-12">
          <b-card>
            <template v-slot:header>
              <h4 class="mb-0">ประวัติรายการที่เสร็จสิ้น</h4>
            </template>
            <div class="row" style="overflow-x: auto">
              <div class="col-sm-12">
                <div
                  v-for="itemyear in yearlist"
                  style="text-align:left;font-size:20px"
                >
                  {{ itemyear.year + 543 }}
                  <div
                    v-for="itemmonth in monthlist"
                    style="text-align:left;font-size:20px"
                  >
                    {{ month(itemmonth.month) }}

                    <table class="table" style="text-align:center">
                      <thead>
                        <tr>
                          <th scope="col">ลำดับ</th>
                          <th scope="col">ชื่อรายการ</th>
                          <th scope="col">จำนวน</th>
                          <th scope="col">ราคาทั้งหมด</th>
                          <th scope="col">วัน/เดือน/ปี</th>
                          <th scope="col">ดูรายละเอียด</th>
                          <th scope="col">ลบ</th>
                        </tr>
                      </thead>
                      <tbody
                        v-for="deepdata in items"
                        v-if="
                          yeartimestamp(deepdata.timestamp) == itemyear.year &&
                            monthtimestamp(deepdata.timestamp) ==
                              itemmonth.month
                        "
                      >
                        <tr>
                          <td>{{ deepdata.count }}</td>
                          <td>
                            {{ deepdata.name.name }}
                                 <b-icon
                              @click="changename(deepdata.name)"
                              icon="pencil"
                            ></b-icon>
                          </td>
                          <td>
                            {{ Number(deepdata.amount).toLocaleString() }} ชิ้น
                          </td>
                          <td>
                            {{ Number(deepdata.total).toLocaleString() }} บาท
                          </td>
                          <td>{{ deepdata.timestamp }}</td>
                          <td>
                            <div class="h2 mb-0">
                              <b-icon
                                @click="listHistory(deepdata.view)"
                                icon="search"
                                variant="success"
                              ></b-icon>
                            </div>
                          </td>
                          <td>
                            <div class="h2 mb-0">
                              <b-icon
                                @click="delete_list(deepdata.delete)"
                                icon="trash-fill"
                                variant="danger"
                              ></b-icon>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </div>

    <div v-else>
      <br />
      <h2>ไม่มีประวัติ</h2>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import VueRouter from "vue-router";
import { api } from "../db/config.js";
const Swal = require("sweetalert2");
var moment = require("moment");
var loggedIn;
export default {
  data: () => ({
    fields: [
      {
        key: "count",
        label: "ลำดับ",
        sortable: true
      },
      {
        key: "name",
        label: "ชื่อรายการ",
        sortable: true
      },
      {
        key: "amount",
        label: "จำนวน",
        sortable: true
      },
      {
        key: "total",
        label: "ราคาทั้งหมด",
        sortable: true
      },
      {
        key: "timestamp",
        label: "วัน/เดือน/ปี",
        sortable: true
      },
      {
        key: "view",
        label: "ดูรายละเอียด"
      },
      {
        key: "delete",
        label: "ลบ"
      }
    ],
    items: [],
    yearlist: [],
    monthlist: []
  }),
  mounted() {
    this.yeartimestamp;
    loggedIn = JSON.parse(localStorage.getItem("user"));
    axios
      .post(api.url + "/getHistory_true", {
        user: loggedIn.username
      })
      .then(response => {
        for (let i = 0; i < response.data.length; i++) {
          let count = i;
          this.items.push({
            count: count + 1,
            history_id: response.data[i].history_id,
            name: {
              id: response.data[i].history_id,
              name: response.data[i].name
            },
            total: response.data[i].total,
            timestamp: datetothai(response.data[i].timestamp),
            view: response.data[i].history_id,
            delete: {
              id: response.data[i].history_id,
              name: response.data[i].name
            },
            amount: response.data[i].amount
          });
        }
      });
    axios
      .post(api.url + "/getyear/his/true", {
        user: loggedIn.username
      })
      .then(response => {
        this.yearlist = response.data;
      });
    axios
      .post(api.url + "/getmount/his/true", {
        user: loggedIn.username
      })
      .then(response => {
        this.monthlist = response.data;
      });
  },
  methods: {
    delete_list(data) {
      Swal.fire({
        title: "ต้องการลบ " + data.name + " หรือไม่",
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
            .post(api.url + "/select_list", {
              list_id: data.id
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
                  list_id: data.id
                })
                .then(response => {
                  axios
                    .post(api.url + "/getHistory_true", {
                      user: loggedIn.username
                    })
                    .then(response => {
                      for (let i = 0; i < response.data.length; i++) {
                        let count = i;
                        this.items.push({
                          count: count + 1,
                          history_id: response.data[i].history_id,
                          name: {
                            id: response.data[i].history_id,
                            name: response.data[i].name
                          },
                          total: response.data[i].total,
                          timestamp: datetothai(response.data[i].timestamp),
                          view: response.data[i].history_id,
                          delete: {
                            id: response.data[i].history_id,
                            name: response.data[i].name
                          },
                          amount: response.data[i].amount
                        });
                      }
                      Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "ลบรายการเรียบร้อย",
                        showConfirmButton: false,
                        timer: 1500
                      });
                    });
                });
            });
        }
      });
    },
    listHistory: function(list_id) {
      var list_id_data = [];
      list_id_data.push(list_id);
      list_id_data.push(true);
      this.$session.set("list", list_id_data);
      this.$router.push("/list_history");
    },
    changename(data) {
      Swal.fire({
        title: "ชื่อรายการ",
        input: "text",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ยืนยัน",
        showLoaderOnConfirm: true,
        inputValue: data.name,
        inputValidator: value => {
          if (!value) {
            return "กรุณากรอกชื่อรายการ";
          }
        }
      }).then(result => {
        if (result.value) {
          axios
            .post(api.url + "/edit/name", {
              name: result.value,
              history_id: data.id
            })
            .then(response => {
              axios
                .post(api.url + "/getHistory_true", {
                  user: loggedIn.username
                })
                .then(response => {
                  this.items = [];
                  for (let i = 0; i < response.data.length; i++) {
                    let count = i;
                    this.items.push({
                      count: count + 1,
                      history_id: response.data[i].history_id,
                      name: {
                        id: response.data[i].history_id,
                        name: response.data[i].name
                      },
                      total: response.data[i].total,
                      timestamp: datetothai(response.data[i].timestamp),
                      view: response.data[i].history_id,
                      delete: {
                        id: response.data[i].history_id,
                        name: response.data[i].name
                      },
                      amount: response.data[i].amount
                    });
                  }
                });
            });
        }
      });
    },
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
    yeartimestamp(y) {
      return parseInt(y.split("/")[2]) - 543;
    },
    monthtimestamp(m) {
      let mm = m.split("/")[1];
      if (mm.split("").length > 1 && mm.split("")[0] == "0") {
        return parseInt(mm.split("")[1]);
      } else {
        return parseInt(m.split("/")[1]);
      }
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
<style scope>
.picProfile {
  border-radius: 10px;
}
.body_profile {
  text-align: center;
}
</style>
