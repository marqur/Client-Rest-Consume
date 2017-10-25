<template>
    <!-- Slider -->
    <section class="product-slider">
        <slider class="slider-wrapper" ref="slick" :options="slickOptions">
            <!-- SLIDE -->
            <div class="slide" v-for="(slide, index) in products">
                <div class="slide-inner frow">
                    <div class="slide-image col-md-7-12">
                        <figure>
                            <img :src="slide.image" alt="">
                        </figure>
                    </div>
                    <div class="slide-content frow col-md-5-12">
                        <!--<img class="slide-product-image" :src="slide.productImage" alt="">-->
                        <div class="slide-text">
                            <h3>{{ slide.title }}</h3>
                            <p>{{ slide.subTitle }}</p>
                            <div class="btn btn-green">POGLEDAJ</div>
                        </div>
                    </div>
                </div>
            </div>
        </slider>
    </section>
    <!--// Slider -->
</template>

<script>
    import Slick from 'vue-slick';

    export default {
        data() {
            return {
                products: [
                    {
                        title: 'Ulje divljeg origana najjači prirodni antiseptik',
                        subTitle: 'Ulje divljeg origana – ubica bakterija, rival najjačim antibioticima',
                        image: '/dist/herb-Image.png',
                        productImage: '/dist/product-image.png'
                    },
                    {
                        title: 'Ulje divljeg origana najjači prirodni antiseptik',
                        subTitle: 'Ulje divljeg origana – ubica bakterija, rival najjačim antibioticima',
                        image: '/dist/moringa.jpg',
                        productImage: '/dist/Moringa-i-nim-sapun.png'
                    }
                ],
                slickOptions: {
                    centerMode: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 600,
                    infinite: false,
                    prevArrow: '<div class="slider-arrow slider-prev"></div>',
                    nextArrow: '<div class="slider-arrow slider-next"></div>',
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                dots: true,
                                arrows: false,
                                swipe: true
                            }
                        }
                    ]
                }
            }
        },
        methods: {
        },
        components: {
            'slider': Slick
        }
    }
</script>