<template>
    <section class="featured">
        <div class="container">
            <div class="featured_image"></div>
            <div class="featured_text frow centered justify-end">
                <div class="featured_text-inner col-sm-1-2">
                    <span class="caption">{{ featured.caption }}</span>
                    <h2 class="big">{{ featured.name }}</h2>
                    <p class="p-big">{{ featured.text }}</p>
                    <div class="btn-holder">
                        <div class="btn btn-green">Saznaj više</div>
                        <etr-btn-prod-add v-bind:product="featured"></etr-btn-prod-add>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import btnProdAdd from './btn-prod-add.vue'
    export default {
        data() {
            return {
                featured: {
                    caption: 'Herbarijum',
                    name: 'Bosiljak - Samo začin ili nešto više?',
                    text: 'Moderna naučna istraživanja potvrđuju da cimet, „začin vredniji od zlata“, pozitivno deluje kod mnogih bolesti.'
                }
            }
        }
    }
</script>