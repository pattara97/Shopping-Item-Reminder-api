<template>
  <div>
    <b-container class="bv-example-row">
      <b-row class="justify-content-md-center">
        <b-col class="col-lg-5 col-md-6 col-sm-12">
          <b-card
            no-body
            style="max-width: 31rem;margin-top:1rem;"
            img-src="https://placekitten.com/380/200"
            img-alt="Image"
            img-top
          >
            <template v-slot:header>
              <h4 class="mb-0">ข้อมูลส่วนตัว</h4>
            </template>

            <b-card-body>
              <b-card-text>ชื่อ-สกุล : {{name}} {{lastn}}</b-card-text>
              <b-card-text>เบอร์โทร : {{phone}}</b-card-text>
              <b-card-text>E-mail : {{mail}}</b-card-text>
              <b-card-text>ที่อยู่ : {{address}}</b-card-text>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import axios from "axios";
import VueRouter from "vue-router";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      name: "",
      lastn:"",
      phone: "",
      mail: "",
      address: "",
      info:""
    };
  },
  mounted() {
      axios
        .post('http://127.0.0.1:8081/test_data')
        .then(response => {
            this.name = response.data[0]._NAME
            this.lastn = response.data[0]._LASTNAME
            this.phone = response.data[0].PHONE
            this.mail = response.data[0].EMAIL
            this.address = response.data[0]._ADDRESS
        })
  },

};
</script>
<style scope>
.picProfile {
  border-radius: 10px;
}
.body_profile {
  text-align: center;
}
</style>
