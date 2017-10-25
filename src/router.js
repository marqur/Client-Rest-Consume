import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './components/home.vue'
import Products from './components/products.vue'
import Product from './components/product.vue'
import Profile from './components/profile.vue'
import Account from './components/account.vue'
import ProductHistory from './components/product-history.vue'
import Savet from './components/savet.vue'
import Herbarijum from './components/herbarijum.vue'
import Checkout from './components/checkout.vue'
import Blog from './components/blog.vue'
import Post from './components/post.vue'

Vue.use(VueRouter);

const routes = [
    {path:'/', component: Home},
    {path:'/savet', name: 'savet', component: Savet},
    {path:'/proizvodi', name: 'products', component: Products},
    {path:'/herbarijum', name: 'herbarijum', component: Herbarijum},
    {path:'/checkout', name: 'checkout', component: Checkout},
    {path:'/novosti', name: 'blog', component: Blog},
    {path:'/post-:id-:title', name: 'post', component: Post},
    {
        path:'/:id-:name',
        name: 'product',
        component: Product
    },
    {
        path:'/profil', component: Profile, name: 'profil',
        children: [
            {
                name: 'account',
                path:'/account',
                component: Account
            },
            {
                name: 'product-history',
                path:'/product-history',
                component: ProductHistory
            },
        ]
    }
];

export const router = new VueRouter ({
    mode: 'history',
    routes: routes
});