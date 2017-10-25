<template>
    <div class="post">
        <div class="container frow centered">
            <div class="post-above-fold">
                <span class="caption">{{ post.kategorija_id.kategorija_name }} /</span>
                <span class="caption sans-serif green">{{ formatDate(post.created_at) }}</span>
                <h1>{{ post.naslov }}</h1>
                <p class="p-big">{{ post.autor }}</p>
            </div>

            <article>
                <p v-html="post.glavni_text"></p>
            </article>

            <div class="video-wrapper">
                <img :src="'http://eterra.brainzined.com/'+post.slika" :alt="post.naslov">
                <youtube v-if="videoId.length > 0" :video-id="videoId" player-width="960"></youtube>
            </div>


        </div>
    </div>
</template>
<script>
    import { HTTP } from './http-helper.vue'
    import store from '../app-store.js'
    import moment from 'moment'

    export default {
        data() {
            return {
                post: {},
                videoId: '' //'KKts9bVxAyk'
            }
        },
        created() {
            if (store.state.posts.length > 0) {
                this.post = _.find(store.state.posts, ['id', this.$route.params.id])
            } else {
                HTTP.get('article/'+this.$route.params.id)
                    .then(response => {
                        console.log(response)
                        this.post = response.data.article
                    })
                    .catch(response => {
                        console.log(response)
                    })
            }

        },
        methods: {
            formatDate(date) {
                return moment(date).format('MMM DD.YYYY')
            }
        }
    }
</script>