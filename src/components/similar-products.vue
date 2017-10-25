<template>
    <section class="popular-products">
        <div class="section-title">
            <div class="section-title_inner">
                <h4>Najtrazeniji proizvodi</h4>
                <span class="under-title">Popularno ovog meseca</span>
            </div>
        </div>

        <slider class="container" ref="slick" :options="slickOptions">
            <etr-product-item :product="product" v-for="(product, index) in products" :key="index"></etr-product-item>
        </slider>
    </section>
</template>

<script>
    import Slick from 'vue-slick'
    import productItem from './product-item.vue'
    import store from '../app-store.js'
    import { router } from '../router.js'
    import { EventBus } from '../event-bus.js';

    export default {
        props: ['products'],
        data() {
            return {
                slickOptions: {
                    centerMode: this.products.length < 4,
                    infinite: this.products.length < 4,
                    slidesToShow: this.products.length < 3 ? this.products.length : 3,
                    slidesToScroll: 1,
                    dots: true,
                    speed: 600,
                    prevArrow: '<div class="slider-arrow slider-prev"></div>',
                    nextArrow: '<div class="slider-arrow slider-next"></div>',
                    responsive: [
                        {
                            breakpoint: 960,
                            settings: {
                                slidesToShow: 2,
                                dots: true,
                                arrows: false,
                                swipe: true
                            }
                        },
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: 1,
                                dots: true,
                                arrows: false
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            beautifyString(string) {
                string = string.replace(/[^a-zA-Z0-9 ]/g, "")
                return string.replace(/\s/g, "-")
            }
        },
        components: {
            'etr-product-item': productItem,
            'slider': Slick
        }
    }
</script>