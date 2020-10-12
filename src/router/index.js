import Vue from "vue";
import VueRouter from "vue-router";
import product from "@/components/product.vue";
import list from "@/components/list.vue";
import profile from "@/components/profile.vue";
import history from "@/components/history.vue";
import login from "@/components/login.vue";
import list_history from "@/components/list_history.vue";
import addproduct from "@/components/addproduct.vue";
import register from "@/components/register.vue";
import listproduct from "@/components/listproduct.vue";
import editproduct from "@/components/editproduct.vue";
import complete_history from "@/components/complete_history.vue";
import alllist from "@/components/alllist.vue";
import historylast from "@/components/historylast.vue";
// import { Role } from "./role";
Vue.use(VueRouter);
const routes = [{
    path: "/",
    name: "login",
    component: login
}, {
    path: "/login",
    name: "login",
    component: login
}, {
    path: "/product",
    name: "product",
    component: product,
    meta: {
        authorize: ["user"]
    }
}, {
    path: "/list",
    name: "list",
    component: list,
    meta: {
        authorize: ["user"]
    }
},
{
    path: "/profile",
    name: "profile",
    component: profile,
    meta: {
        authorize: ["user"]
    }
},
{
    path: "/history",
    name: "history",
    component: history,
    meta: {
        authorize: ["user"]
    }
},
{
    path: "/list_history",
    name: "list_history",
    component: list_history,
    meta: {
        authorize: ["user"]
    }
},
{
    path: "/complete_history",
    name: "complete_history",
    component: complete_history,
    meta: {
        authorize: ["user"]
    }
},
{
    path: "/addproduct",
    name: "addproduct",
    component: addproduct,
    meta: {
        authorize: ["admin"]
    }
}, {
    path: "/listproduct",
    name: "listproduct",
    component: listproduct,
    meta: {
        authorize: ["admin"]
    }
},
{
    path: "/register",
    name: "register",
    component: register
},
{
    path: "/editproduct",
    name: "editproduct",
    component: editproduct,
    meta: {
        authorize: ["admin"]
    }
},
{
    path: "/alllist",
    name: "alllist",
    component: alllist,
    meta: {
        authorize: ["user"]
    }
},
{
    path: "/historylast",
    name: "historylast",
    component: historylast,
    meta: {
        authorize: ["user"]
    }
},
{
    path: '*',
    redirect: '/'
}
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const {
        authorize
    } = to.meta;
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (authorize) {
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return next({
                path: "/login",
                query: {
                    returnUrl: to.path
                }
            });
        }
        // check if route is restricted by role
        if (authorize.length && !authorize.includes(currentUser.role)) {
            // role not authorised so redirect to home page
            return next({
                path: "/"
            });
        }
    }

    next();
});
export default router;