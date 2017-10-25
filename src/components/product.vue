<template>
    <div>
        <!-- Main -->
        <section class="product-detail-main">
            <div class="container frow centered">
                <div class="product-image">
                    <div class="image-holder frow">
                        <div class="certificates certificates-vertical">
                            <img src="../images/icons/certificate_1.png" alt="">
                            <img src="../images/icons/certificate_2.png" alt="">
                        </div>
                        <img class="product" :src="'http://eterra.brainzined.com/storage/'+product.slika" :alt="product.naziv">
                    </div>
                </div>

                <div class="product-info">
                    <span class="caption serif">{{ product.kategorija_id.kategorija_name }}</span>
                    <h1>{{ product.naziv }}</h1>

                    <div class="rating">
                        <span class="rating-star rating-star-checked" v-for="(star, index) in rating"></span>
                        <span class="rating-star" v-for="(star, index) in 5 - rating"></span>
                        <span class="rating-text">({{ product.comments.length }} recenzija korisnika)</span>
                    </div>

                    <div class="price-quantity">
                        <span class="price">{{ product.cena }}<span class="currency">Rsd</span></span>
                        <span class="quantity">/ {{ product.zapremina }}ml</span>
                    </div>

                    <div class="btn-holder">
                        <div class="quantity-input">
                            <span class="quantity-minus" v-on:click="decreaseAmount"></span>
                            <span class="quantity-number big">{{ amountNumber }}</span>
                            <span class="quantity-plus" v-on:click="increaseAmount"></span>
                        </div>
                        <etr-btn-prod-add :product="product"
                                          :quantity="amountNumber"
                                          :class="{ 'btn-disabled': !amountNumber || amountNumber < 0 }"
                                          :disabled="!amountNumber || amountNumber < 0"></etr-btn-prod-add>
                    </div>

                    <!-- Social sharing -->
                    <div class="social-sharing-wrap">
                        <span class="caption small">Podeli</span>
                        <social-sharing :url="'http://etr.brainzined.com/'+share.url" inline-template>
                            <div>
                                <network network="facebook">
                                    <i class="s-icon s-facebook"></i>
                                </network>
                                <network network="googleplus">
                                    <i class="s-icon s-google-plus"></i>
                                </network>
                                <network network="twitter">
                                    <i class="s-icon s-twitter"></i>
                                </network>
                            </div>
                        </social-sharing>
                    </div>
                    <!--// Social sharing -->

                </div>
            </div>
        </section>
        <!--// Main -->

        <section class="product-details">
            <div class="container">
                <div class="tabs">
                    <ul>
                        <li @click="activetab = 1" :class="{active: activetab === 1}" class="tabLink" >Lista tagova</li>
                        <li @click="activetab = 2" :class="{active: activetab === 2}" class="tabLink">Opis proizvoda</li>
                        <li @click="activetab = 3" :class="{active: activetab === 3}" class="tabLink">Komentari</li>
                    </ul>

                    <div :class="{active: activetab === 1}" class="product-details_inner tabContent">
                        <div class="tags">
                            <span class="tag-item" v-for="(tag, index) in tags">{{ tag }}</span>
                        </div>
                    </div>

                    <div :class="{active: activetab === 2}" class="product-details_inner tabContent">
                        <article v-html="productDescription"></article>
                    </div>

                    <div :class="{active: activetab === 3}" class="product-details_inner tabContent">
                        <form action="" class="comments-form">
                            <div class="frow">
                                <div class="input-group col-sm-2-4">
                                    <input type="text" name="name" v-model="comment.name" required>
                                    <label for="name">Ime</label>
                                </div>

                                <div class="input-group col-sm-2-4">
                                    <input type="text" name="email" v-model="comment.email" required>
                                    <label for="name">Email</label>
                                </div>
                            </div>

                            <div class="input-group">
                                <label class="not-abs">Vasa ocena</label>
                                <div class="rating">
                                    <span class="rating-star"
                                          :class="{'rating-star-checked': isChecked(index)}"
                                          v-for="(star, index) in 5" @click="changeRating(index)"></span>
                                </div>
                            </div>

                            <div class="input-group">
                                <textarea type="text" name="comment" v-model="comment.comment" required></textarea>
                                <label for="comment">Komentar</label>
                            </div>
                            <div class="btn btn-green" @click="addComment">Dodaj komentar</div>
                        </form>

                        <div class="comments-wrapper">
                            <div class="comments-item" v-for="comment in sortedComment">
                                <span class="caption">
                                    {{ comment.name}} <small>{{ comment.created_at | formatDate }}</small>
                                </span>
                                <p>{{ comment.comment_text }}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
        <!-- Popular products -->
        <etr-popular-products :products="similarProducts"></etr-popular-products>
        <!--// Popular products -->
    </div>
</template>

<script>
    import Popular from './similar-products.vue'
    import btnProdAdd from './btn-prod-add.vue'
    import {HTTP} from './http-helper.vue';
    import store from '../app-store.js'
    import { EventBus } from '../event-bus.js';

    export default {
        data() {
            return {
                activetab: 2,
                product: {},
                tags: [],
                amountNumber: 0,
                comment: {
                    name: '',
                    comment: '',
                    rating: 0
                },
                share: {
                    url: this.$route.fullPath
                },
                similarProducts: []
            }
        },
        created() {
            // when product is selected
            EventBus.$on('selectProduct', (product) => {
                this.setProduct(null, product)
            })

            if (store.state.selectedProduct.length > 0) {
                this.setProduct(null, store.state.selectedProduct[0])
            } else {
                HTTP.get(`product/`+this.$route.params.id)
                    .then(response => {
                        this.setProduct(null, response.data.products)
                    })
                    .catch(e => {
                        // Log error
                    })
            }

            //
            this.nesto();
        },
        watch: {
            // call again the method if the route changes
            '$route': function() {
                setTimeout(this.nesto, 500)
            }
        },
        computed: {
            sortedComment: function() {
                return this.product.comments.reverse();
            },
            productDescription: function() {
                let find = 'style="[^"]*"';
                let re = new RegExp(find, 'g');
                let str = this.product.opis.replace(re, '');
                return str
            },
            products: function() {
                return _.sampleSize(store.state.products, 3)
            },
            rating: function() {
                let ratingSum = 0
                let ratingNumber = 0
                if (this.product.comments.length) {
                    _.forEach(this.product.comments, function(comment) {
                        ratingSum += comment.recenzija
                        ratingNumber += 1
                    })

                    return ratingSum / ratingNumber
                } else {
                    return 0
                }
            }
        },
        methods: {
            setProduct(err, product) {
                this.product = product
                this.generateTags()
            },
            nesto() {
                this.similarProducts = []
                this.similarProducts = _.sampleSize(store.state.products, 3)
            },
            generateTags: function() {
                this.tags = []
                _.forEach(this.product.filteri, (item) => {
                    this.tags.push(item.filteri)
                })
            },
            increaseAmount: function() {
                this.amountNumber += 1
            },
            decreaseAmount: function() {
                this.amountNumber = this.amountNumber > 0 ? this.amountNumber -= 1 : 0
            },
            addComment() {
                let app = this
                HTTP.post('comment', {
                    product_id: app.$route.params.id,
                    recenzija: app.comment.rating,
                    comment_text: app.comment.comment,
                    name: app.comment.name
                })
                .then(response => {
                    app.product.comments.push(response.data.Comment)
                })
                .catch(response => {
                    // show some error
                })
            },
            isChecked(index) {
                return index + 1 <= this.comment.rating
            },
            changeRating(index) {
                this.comment.rating = index + 1
            }
        },
        components: {
            'etr-popular-products': Popular,
            'etr-btn-prod-add': btnProdAdd
        }
    }
</script>