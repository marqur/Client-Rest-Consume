<template>
    <div>
        <!-- Hero -->
        <section class="hero hero_main">
            <div class="container frow">
                <div class="hero__text col-lg-1-2 col-sm-1-2">
                    <h1>Dosegnite himalajske visine zdravlja uz ETERRA proizvode</h1>
                    <p class="under-h1 p-big">Drevna tajna koja je pažljivo čuvana od savremenog sveta sada je dostupna i vama</p>
                    <a target="_blank" href="dist/Katalog-2015.pdf"><div class="btn btn-green">Preuzmite katalog</div></a>
                </div>
            </div>
        </section>
        <!--// Hero -->
        <!-- Slider -->
        <etr-slider-big></etr-slider-big>
        <!--// Slider -->
        <!-- Featured -->
        <etr-featured></etr-featured>
        <!--// Featured -->
        <!-- Popular products -->
        <etr-popular-products></etr-popular-products>
        <!--// Popular products -->
    </div>
</template>

<script>
    import Slider from './slider-big.vue'
    import Featured from './featured.vue'
    import Popular from './similar-products.vue'

    export default {
        data() {
            return {}
        },
        methods: {
        },
        components: {
            'etr-slider-big': Slider,
            'etr-featured': Featured,
            'etr-popular-products': Popular
        }
    }
</script>