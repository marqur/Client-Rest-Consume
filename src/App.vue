<template>
  <main id="etr"
        v-bind:class="{ 'main-overlay': isCartOpen || isNavOpen || isLoginOpen, 'transition': transition, 'contactOpen': isContactOpen}">
    <!-- USER LOGIN MODAL -->
    <etr-login></etr-login>
    <!-- Contact Modal-->
    <etr-contact></etr-contact>
    <!-- NAVIGATION -->
    <etr-nav v-on:navopen="hideScroll"
             v-on:opencart="openCart"></etr-nav>
    <!-- SHOPPING CART -->
    <etr-cart v-bind:isCartOpen="isCartOpen"
              v-on:closecart="closeCart"></etr-cart>
    <!-- ROUTER VIEW -->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <!-- FOOTER -->
    <etr-footer></etr-footer>
  </main>
</template>

<script>
  import Vue from 'vue'
  import Nav from './components/nav.vue'
  import Cart from './components/cart.vue'
  import Footer from './components/footer.vue'
  import Contact from './components/contact.vue'
  import VueSEO from 'vue-seo'
  import LogIn from './components/login.vue'
  import store from './app-store.js'
  import {HTTP} from './components/http-helper.vue';
  import { EventBus } from './event-bus.js';
  import { router } from './router.js'

  export default {
    data () {
      return {
          products: [],
          isCartOpen: false,
          isNavOpen: false,
          isLoginOpen: false,
          transition: false,
          isContactOpen: false
      }
    },
    created() {
        let app = this

        // when product is selected
        EventBus.$on('selectProduct', (product) => {
            store.state.selectedProduct[0] = product
        })

        // login modal open
        EventBus.$on('loginOpen', data => {
            app.isLoginOpen = true
            document.body.className = 'no-scroll'
        });

        // login modal close
        EventBus.$on('loginClose', data => {
            app.isLoginOpen = false
            document.body.className = ''
        })

        // navigation close
        EventBus.$on('navClose', data => {
            if (app.isNavOpen) {
                app.hideScroll()
            }
        })

        // contact open event
        EventBus.$on('contactOpen', data => {
            app.isContactOpen = !app.isContactOpen
        })

        // do page transition animation
        EventBus.$on('doTransition', (callback) => {
            this.transition = true
            document.getElementById("transition-element").className = 'animate'
            callback()
        })

        EventBus.$on('stopTransition', () => {
            let app = this
            setTimeout(function(){
                document.getElementById("transition-element").className = ''
            }, 1000);
            setTimeout(function(){
                app.transition = false
            }, 500);
        })

        // open cart
        EventBus.$on('opencart', () => {
            this.openCart()
        })

        // get products and store them
        HTTP.get(`products`)
            .then(response => {
                store.state.products = response.data.products
            })
            .catch(e => {
                console.log(e)
            })

        // get products and store them
        HTTP.get(`herbs`)
            .then(response => {
                store.state.herbs = response.data.herbarijum
            })
            .catch(e => {
                console.log(e)
            })

        // Get User from local storage
        if (this.$localStorage.get('user')) {
            store.state.user = this.$localStorage.get('user')
        }
    },
    methods:{
        getProducts: function(){
            this.products = [{
                name: 'dasd'
            },
            {
                name: 'blalalal'
            }]
        },
        getFeaturedProduct: function(){
            let that = this;
            $.get('be-mock/featured-product.json').then(function(response){
                that.featured = response[0];
            }, function(error){
                console.log(error.statusText);
            });
        },
        closeCart: function() {
            this.isCartOpen = false;
            document.body.className = this.isNavOpen ? 'no-scroll' : ''
        },
        openCart: function() {
            this.isCartOpen = true;
            document.body.className = 'no-scroll'
        },
        hideScroll: function() {
            this.isNavOpen = !this.isNavOpen;
            document.body.className = this.isNavOpen ? 'no-scroll' : ''
        },
        beautifyString(string) {
            return string.replace(/\W/g, '-')
        }
    },
    mounted: function () {
        this.getProducts();
    },
    events: {
        some () {
            console.log('asdasd');
        }
    },
    components: {
        'etr-nav': Nav,
        'etr-cart': Cart,
        'etr-footer': Footer,
        'etr-login': LogIn,
        'etr-contact': Contact
    }
  }
</script>
