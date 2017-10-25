<template>
    <section class="checkout">
        <div class="container">

            <div class="checkout-wrapper frow gutters justify-start" v-if="products.length > 0">
                <div class="content col-sm-2-3">
                    <h3>Detalji za Naplatu</h3>
                    <div class="content-inner">
                        <form action="" class="frow gutters justify-start">
                            <div class="input-group col-sm-6-12">
                                <input type="text"
                                       v-model="info.name"
                                       name="userName"
                                       required
                                       v-validate="'required'"
                                       data-vv-as="ime"
                                       @blur="btnEnable">
                                <label>Ime</label>
                                <span v-show="errors.has('userName')" class="is-danger">{{ errors.first('userName') }}</span>
                            </div>
                            <div class="input-group col-sm-6-12">
                                <input type="text"
                                       v-model="info.sureName"
                                       name="userSurename"
                                       required
                                       v-validate="'required'"
                                       data-vv-as="prezime"
                                       @blur="btnEnable">
                                <label>Prezime</label>
                                <span v-show="errors.has('userSurename')" class="is-danger">{{ errors.first('userSurename') }}</span>
                            </div>
                            <div class="input-group col-sm-6-12">
                                <input type="text"
                                       v-model="info.email"
                                       name="email"
                                       required
                                       v-validate="'required|email'"
                                       @blur="btnEnable">
                                <label>Email</label>
                                <span v-show="errors.has('email')" class="is-danger">{{ errors.first('email') }}</span>
                            </div>
                            <div class="input-group col-sm-6-12">
                                <input type="text"
                                       v-model="info.telephone"
                                       name="telephone"
                                       required
                                       data-vv-as="telefon"
                                       v-validate="'required|numeric'" :class="{'is-danger': errors.first('telephone')}"
                                       @blur="btnEnable">
                                <label>Telefon</label>
                                <span v-show="errors.has('telephone')" class="is-danger">{{ errors.first('telephone') }}</span>
                            </div>
                            <div class="input-group col-sm-1-1">
                                <input type="text"
                                       v-model="info.address"
                                       name="address"
                                       required
                                       v-validate="'required'"
                                       data-vv-as="adresa"
                                       @blur="btnEnable">
                                <label>Adresa</label>
                                <span class="col-sm-1-1">
                                    Adresa za dostavu. Mozete je izmeniti.
                                    <span v-show="errors.has('address')" class="is-danger">{{ errors.first('address') }}</span>
                                </span>
                            </div>
                            <div class="input-group col-sm-1-3">
                                <input type="text"
                                       v-model="info.country"
                                       disabled>
                                <label>Drzava</label>
                            </div>
                            <div class="input-group col-sm-1-3">
                                <input type="text"
                                       v-model="info.city"
                                       name="city"
                                       required
                                       v-validate="'required'"
                                       data-vv-as="grad"
                                       @blur="btnEnable">
                                <label>Grad</label>
                                <span v-show="errors.has('city')" class="is-danger">{{ errors.first('city') }}</span>
                            </div>
                            <div class="input-group col-sm-1-3">
                                <input type="text"
                                       name="postalCode"
                                       required
                                       v-model="info.postalCode"
                                       v-validate="'required|numeric|max:5'"
                                       data-vv-as="postanski broj"
                                       @blur="btnEnable">
                                <label>Postanski broj</label>
                                <span v-show="errors.has('postalCode')" class="is-danger">{{ errors.first('postalCode') }}</span>
                            </div>
                            <div class="input-group col-sm-1-1">
                                <textarea required v-model="note"></textarea>
                                <label>Napomena</label>
                            </div>
                        </form>
                    </div>

                    <div class="btn btn-grey"
                         @click="order()"
                         :class="{'btn-disabled': !enableButton || busy, 'btn-spinner': busy}"
                         :disabled="!enableButton || busy">
                        <clip-loader :loading="busy" :size="loader.options.size" :color="loader.options.color"></clip-loader>
                        <span v-show="!busy">Naruči</span>
                    </div>
                </div>

                <div class="content col-sm-1-3">
                    <h3>Vaša narudžbina</h3>
                    <div class="details">
                        <div class="detail">
                            <span class="caption">Proizvodi</span>

                            <div v-for="(product, index) in products" class="detail-product frow">
                                <div class="col-xs-7-12">
                                    <b>{{ product.product.naziv }}</b>, <span class="quantity">{{ product.product.zapremina }}{{ product.product.jedinica_mere.mera }}</span>
                                </div>
                                <div class="col-xs-1-12"> <b>{{ product.amount }}</b></div>
                                <div class="col-xs-4-12">
                                    <span class="price">{{ product.product.cena }}<span class="currency">Rsd</span></span>
                                </div>
                            </div>

                        </div>

                        <div class="detail">
                            <span class="caption">Dostava</span>
                            <div class="">
                                <p>Dostava se ne naplacuje na porudzbine preko 2000rsd</p>
                            </div>
                        </div>

                        <div class="detail">
                            <div class="frow">
                                <div class="col-xs-8-12">
                                    <p class="p-big">Ukupno</p>
                                </div>
                                <div class="col-xs-4-12">
                                    <p class="p-big price"><b>{{ total }}</b><span class="currency">RSD</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="success" class="empty-cart-message frow centered">
                <div class="empty-cart_info">
                    <h3>Hvala Vam na kupovini</h3>
                    <p class="p-big">Vasa narudzbina je uspesno poslata na obradu</p>
                    <div class="btn btn-green"
                         @click="goToProducts">Nastavite kupovinu</div>
                </div>
            </div>

            <div v-else class="empty-cart-message frow centered">
                <div class="empty-cart_info">
                    <h3>Korpa vam je prazna.</h3>
                    <p class="p-big">Počnite da kupujete!</p>
                    <div class="btn btn-green"
                         @click="goToProducts">Pogledajte proizvode</div>
                </div>
            </div>

        </div>
    </section>
</template>

<script>
    // HTTP
    import { HTTP } from './http-helper.vue'
    // Store
    import store from '../app-store.js'
    // Import router
    import { router } from '../router.js'
    // Spinner
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    // Import the EventBus
    import { EventBus } from '../event-bus.js';

    export default {
        data() {
            return {
                info: {
                    name: '',
                    sureName: '',
                    email: '',
                    telephone: '',
                    country: 'Srbija',
                    address: '',
                    flat: '',
                    city: '',
                    postalCode: '',
                },
                loader: {
                    options: {
                        size: '16px',
                        color: '#000'
                    }
                },
                enableButton: false,
                note: '',
                products: store.state.cart,
                busy: false,
                success: false
            }
        },
        created() {
            let checkout = this
            if (store.state.user.loggedIn) {
                checkout.info.name = store.state.user.name
                checkout.info.sureName = store.state.user.last_name
                checkout.info.email = store.state.user.email
                checkout.info.address = store.state.user.adresa
                checkout.info.city = store.state.user.grad
                checkout.info.telephone = store.state.user.telefon
            }
        },
        computed: {
            total: function(){
                let sum = 0;
                this.products.forEach(function(item) {
                    sum += parseInt(item.product.cena) * parseInt(item.amount);
                });
                return sum;
            }
        },
        methods: {
            btnEnable() {
                this.enableButton =  this.info.postalCode.length > 0 &&
                    this.info.name &&
                    this.info.sureName.length > 0 &&
                    this.info.email.length > 0 &&
                    this.info.address.length > 0 &&
                    this.info.city.length > 0 &&
                    this.info.telephone.length > 0
            },
            order() {
                let app = this
                if (this.enableButton) {
                    app.busy = true

                    HTTP.post('add-order', {
                        user_id: store.state.user.loggedIn ? store.state.user.id : null,
                        ime: app.info.name,
                        prezime: app.info.sureName,
                        email: app.info.email,
                        telefon: app.info.telephone,
                        adresa: app.info.address,
                        grad: app.info.city,
                        postanski_br: app.info.postalCode,
                        napomena: app.note,
                        product: app.parseProducts(store.state.cart)
                    })
                        .then(response => {
                            app.products = []
                            EventBus.$emit('empty-cart')
                            app.busy = false
                            app.success = true
                        })
                        .catch(response => {
                            app.busy = false
                            app.success = true
                            app.products = []
                            EventBus.$emit('empty-cart')
                        })
                } else {
                    return false
                }
            },
            goToProducts() {
                this.success = false
                router.push({ name: 'products'})
            },
            parseProducts(products) {
                let parsed = []
                _.forEach(products, product => {
                    parsed.push({
                        product_id: product.product.id,
                        quantity: product.amount
                    })
                })

                return parsed
            }
        },
        components: {
            ClipLoader: ClipLoader
        }
    }
</script>