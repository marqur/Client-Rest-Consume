<template>
    <section class="savet">
        <div class="savet-inner">
            <div class="container">
                <div class="featured_image"></div>
                <div class="featured_text frow centered justify-end">
                    <div class="featured_text-inner col-sm-1-2">

                        <div class="savet-text frow centered" :class="{active: !formVisible}">
                            <div>
                                <span class="caption">{{ featured.caption }}</span>
                                <h2 class="big">{{ featured.name }}</h2>
                                <p class="p-big">{{ featured.text }}</p>
                                <div class="btn-holder">
                                    <div class="btn btn-green" @click="showForm">Zatraži savet <span class="arrow-icon"></span></div>
                                </div>
                            </div>
                        </div>

                        <div class="savet-form frow centered" :class="{active: formVisible}">
                            <div>
                                <div class="arrow-icon" @click="formVisible = false"></div>
                                <p>Popunite sva polja. Napišite šta Vas zanima, a naš aromaterapeut će Vam odgovoriti u što kraćem periodu. Odgovor ćete dobiti na email adresu koju upišete.</p>
                                <form action="" class="frow gutters">
                                    <div class="input-group col-sm-1-2">
                                        <input type="text"
                                               v-model="advice.email"
                                               name="email"
                                               required
                                               v-validate="'required|email'">
                                        <label for="">Email</label>
                                        <span v-show="errors.has('email')" class="is-danger">{{ errors.first('email') }}</span>
                                    </div>
                                    <div class="input-group col-sm-1-2">
                                        <input type="text"
                                               name="name"
                                               v-model="advice.name"
                                               required
                                               v-validate="'required'">
                                        <label for="">Ime</label>
                                        <span v-show="errors.has('name')" class="is-danger">{{ errors.first('name') }}</span>
                                    </div>
                                    <div class="input-group col-sm-1-1">
                                        <textarea required
                                                  name="poruka"
                                                  v-model="advice.poruka"
                                                  v-validate="'required'">
                                        </textarea>
                                        <label for="">Vaša poruka</label>
                                        <span v-show="errors.has('poruka')" class="is-danger">{{ errors.first('poruka') }}</span>
                                    </div>
                                </form>

                                <div class="btn-holder">
                                    <div class="btn btn-green"
                                         :class="{'btn-disabled': btnDisable || busy, 'btn-spinner': busy}"
                                         :disabled="btnDisable || busy"
                                         @click="sendAdvice">
                                        <clip-loader :loading="busy" :size="loader.options.size" :color="loader.options.color"></clip-loader>
                                        <span v-show="!busy">Pošalji</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
    // HTTP
    import { HTTP } from './http-helper.vue'
    // Spinner
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

    export default {
        data() {
            return {
                featured: {
                    caption: 'Aromatrapeut i farmaceut',
                    name: 'Dr. Snežana Mitrović',
                    text: 'Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette tatsoi pea sprouts fava bean collard greens dandelion okra wakame tomato. Dandelion cucumber earthnut pea peanut soko zucchini.'
                },
                advice: {
                    name: '',
                    email: '',
                    poruka: ''
                },
                formVisible: false,
                error: {
                    visible: false,
                    message: 'Sva polja moraju biti popunjena'
                },
                busy: false,
                loader: {
                    options: {
                        size: '16px',
                        color: '#000'
                    }
                }
            }
        },
        computed: {
          btnDisable: function() {
              return _.some(this.advice, field => {
                  return field.length < 1
              })
          }
        },
        methods: {
            showForm() {
                this.formVisible = true
            },
            showError() {
                this.error.visible = true
            },
            sendAdvice() {
                let page = this
                if (_.some(page.advice, field => {
                    return field.length < 1
                    }))
                {
                    page.showError()
                } else {
                    page.busy = true
                    HTTP.post('advice', page.advice)
                        .then(response => {
                            page.busy = false
                        })
                        .catch(response => {
                            page.busy = false
                        })
                }
            }
        },
        components: {
            ClipLoader: ClipLoader
        }
    }
</script>