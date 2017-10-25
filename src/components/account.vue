<template>
    <div class="view-inner">
        <h3>Moj Profil</h3>
        <div class="content">
            <div class="content-inner">
                <form action="" class="frow gutters justify-start">
                    <div class="input-group col-sm-6-12">
                        <input type="text" v-model="user.name" required :disabled="loader.loading">
                        <label for="">Ime</label>
                    </div>
                    <div class="input-group col-sm-6-12">
                        <input type="text" v-model="user.last_name" required :disabled="loader.loading">
                        <label for="">Prezime</label>
                    </div>
                    <div class="input-group col-sm-6-12">
                        <input type="text" v-model="user.email" :value="user.email" disabled>
                        <label for="">Email</label>
                    </div>
                    <div class="input-group col-sm-6-12">
                        <input type="text" v-model="user.telefon" required :disabled="loader.loading">
                        <label for="">Telefon</label>
                    </div>
                    <div class="input-group col-sm-4-12">
                        <input type="text" v-model="user.grad" required :disabled="loader.loading">
                        <label for="">Grad</label>
                    </div>
                    <div class="input-group col-sm-8-12">
                        <input type="text" v-model="user.adresa" required :disabled="loader.loading">
                        <label for="">Adresa</label>
                        <span class="col-sm-1-1">Adresa za dostavu bla bla bla</span>
                    </div>

                </form>

                <div class="btn btn-grey"
                     @click="updateInfo()"
                     :class="{'btn-spinner btn-disabled': loader.loading}"
                     :disabled="loader.loading">
                    <pulse-loader :loading="loader.loading" :size="loader.options.size" :color="loader.options.color"></pulse-loader>
                    Sacuvaj izmene
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import store from '../app-store.js'
    import {HTTP} from './http-helper.vue'
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

    export default {
        data() {
            return {
                user: store.state.user,
                loader: {
                    loading: false,
                    options: {
                        size: '16px',
                        color: '#000'
                    }
                }
            }
        },
        methods: {
            updateInfo: function() {
                let comp = this
                comp.loader.loading = true
                HTTP.put('user/'+this.user.id, {
                    name: this.user.name,
                    last_name: this.user.last_name,
                    telefon: this.user.telefon,
                    grad: this.user.grad,
                    adresa: this.user.adresa
                })
                .then(response => {
                    // update store user
                    comp.loader.loading = false
                    store.state.user = response.data.user
                    store.state.user.loggedIn = true
                    this.$localStorage.set('user', store.state.user)
                })
                .catch(e => {
                    comp.loader.loading = false
                    console.log(e)
                })
            }
        },
        components: {
            PulseLoader: ClipLoader
        }
    }
</script>