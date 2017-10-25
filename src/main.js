import Vue from 'vue'
import App from './App.vue'
import VeeValidate from 'vee-validate'
import { Validator } from 'vee-validate'
import { router } from './router.js'
import lodash from 'lodash'
import VueLodash from 'vue-lodash/dist/vue-lodash.min'
import SocialSharing from 'vue-social-sharing'
import VueLocalStorage from 'vue-localstorage'
import vScroll from 'vue-scroll'
import { EventBus } from './event-bus.js';
import VueAnalytics from 'vue-analytics'
import moment from 'moment'
import VueSEO from 'vue-seo'


// VUE USE
Vue.use(VueAnalytics, {
    id: 'UA-52573300-8',
    router,
    ignoreRoutes: ['checkout', 'profil', 'account', 'product-history']
})
Vue.use(vScroll)
Vue.use(VueLocalStorage)
Vue.use(VueLodash, lodash)
Vue.use(SocialSharing)
Vue.use(VeeValidate)
// Vue.use(VueSEO);


// FILTERS
// format date filter
Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('MM/DD/YYYY')
    }
})
// reverse order of array filter
Vue.filter('reverse', function (array) {
    return array.reverse()
})

// INIRIALIZE APP
new Vue({
    el: '#app',
    router: router,
    localStorage: {
        user: {
            type: Object,
            default: {
                name: ''
            }
        }
    },
    created(){
        router.beforeEach((to, from, next) => {
            EventBus.$emit('doTransition', next)
            EventBus.$emit('navClose')
        })

        router.afterEach((to, from) => {
            window.scrollTo(0, 0)
            EventBus.$emit('stopTransition')
        })
    },
    render (h) {
        return h(App)
    }
})

// ERROR MESSAGES OVERRIDE
// Validate overrides
const dictionary = {
    srb: {
        messages: {
            required: (e) => 'Polje '+ e +' je obavezno',
            numeric: () => 'Dzvoljeni su samo brojevi',
            email: () => 'Email nije validan',
            max: (e,n) => 'Broj dozvoljenih karaktera je ' + n[0]
        }
    }
};

Validator.updateDictionary(dictionary);
const validator = new Validator();
validator.setLocale('srb'); // now this validator will generate messages in arabic.
