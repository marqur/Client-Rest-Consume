<template>
    <div>
        <!-- Hero -->
        <section class="hero hero_blog">
            <div class="container frow centered">
                <div class="hero__text col-lg-1-2">
                    <h1>Novosti</h1>
                    <p class="p-big">Informacije o biljkama, dešavanjima, novim proizvodima i promocijama</p>
                </div>
            </div>
        </section>
        <!--// Hero -->

        <!-- Filters -->
        <div class="filters" :class="{ sticky: fixed }">
            <div class="container">
                <div class="filters-inner frow justify-between">
                    <div class="left">
                        <span class="caption sans-serif grey">filtriraj po</span>
                        <div class="filter-options">
							<span v-for="(category, index) in filterCategories"
                                  class="filter-option caption sans-serif black"
                                  :class="{active: category.name === selectedCategory}"
                                  @click="openFilterTab(category)"
                                  data-category="bolesti">{{ category.name }}</span>
                        </div>
                    </div>
                    <div class="right">
                        <div class="sort-wrapper">
                            <span class="sort">Sortiraj po </span>
                            <select class="sort-select"
                                    v-model="sortBy"
                                    @change="sortPosts">
                                <option disabled value="">Izaberite</option>
                                <option v-for="(option, index) in sortOptions" :value="option.value">{{ option.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="filter-dropdown" :class="{'drop': filterTabOpen}">
					<span v-for="(filter, index) in filters"
                          class="filter-item"
                          @click="addFilter(filter)"
                          :class="{active: isSelected(filter)}">{{ filter }}</span>
                </div>
            </div>
        </div>
        <!--// Filters -->

        <!-- Selected filters -->
        <div class="selected-filters" v-show="selectedFilters.length > 0">
            <div class="container">
                <div class="selected-filters-inner">
					<span v-for="(filter,index) in selectedFilters"
                          class="filter-item">{{ filter }}
						<i class="remove-filter"
                           @click="removeFilter(filter)"></i>
					</span>
                    <span @click="resetFilters()"
                          v-if="selectedFilters.length > 0"
                          class="filter-item remove-all">izbriši filtere</span>
                </div>
            </div>
        </div>
        <!--// Selected filters -->

        <!-- Posts section -->
        <section class="posts">
            <div class="container frow">
                <router-link
                        :to="{ name: 'post', params: { id: post.id, title: beautifyString(post.naslov) }}"
                        class="post"
                        v-for="(post, index) in filteredPosts" :key="index"
                        :class="{red: post.kategorija_id.id == 1, green: post.kategorija_id.id == 2, orange: post.kategorija_id.id == 3, blue: post.kategorija_id.id == 4, brown: post.kategorija_id.id == 5}">
                    <div class="post_inner">
                        <span class="post-date caption sans-serif">{{ formatDate(post.created_at) }}</span>
                        <div class="post-info">
                            <span class="caption">{{ post.kategorija_id.kategorija_name }} - {{ post.autor }}</span>
                            <h4>{{ post.naslov }}</h4>
                            <p v-html="post.glavni_text"></p>
                        </div>
                    </div>
                </router-link>
            </div>
        </section>
        <!--// Posts section -->
    </div>
</template>
<script>
    // HTTP
    import { HTTP } from './http-helper.vue'
    import moment from 'moment'
    import store from '../app-store.js'

    export default {
        data() {
            return{
                posts: [],
                filteredPosts: [],
                fixed: false,
                selectedCategory: null,
                selectedFilters: [],
                filterCategories: [
                    {
                        name: 'kategorija',
                        filters: ['dešavanja', 'media', 'herbarijum', 'proizvodi', 'akcija']
                    }
                ],
                filters: [],
                filterTabOpen: false,
                sortBy: '',
                sortOptions: [
                    {name: 'Najnoviji postovi', value: 'created_at.desc'},
                    {name: 'Najstariji postovi', value: 'created_at.asc'},
                ]
            }
        },
        created() {
            this.fetchData()
        },
        methods: {
            fetchData() {
                if (store.state.posts.length > 0) {
                    this.posts = store.state.posts
                    this.filteredPosts = store.state.posts
                } else {
                    HTTP.get('news')
                        .then(response => {
                            // response.data.novosti
                            this.posts = response.data.novosti
                            this.filteredPosts = response.data.novosti
                            store.state.posts = response.data.novosti
                        })
                        .catch(response => {
                            console.log(response)
                        })
                }
            },
            openFilterTab(category) {
                if (this.filterTabOpen && category.name === this.selectedCategory) {
                    this.filterTabOpen = false
                    this.selectedCategory = ''
                } else {
                    this.selectedCategory = category.name
                    this.filters = category.filters
                    this.filterTabOpen = true
                }
            },
            addFilter(filter) {
                if (_.indexOf(this.selectedFilters, filter) > -1) {
                    this.removeFilter(filter)
                } else {
                    this.selectedFilters.push(filter)
                }
                this.applyFilters()
            },
            removeFilter(filter){
                this.selectedFilters.splice(_.indexOf(this.selectedFilters, filter), 1)
                this.applyFilters()
            },
            resetFilters() {
                this.selectedFilters = []
                this.applyFilters()
            },
            isSelected(filter) {
                return _.indexOf(this.selectedFilters, filter) > -1
            },
            applyFilters() {
                let app = this
                this.filteredPosts = []
                if (this.selectedFilters.length === 0) {
                    app.filteredPosts = app.posts
                } else {
                    _.forEach(app.posts, (post) => {
                        let maches = _.some(app.selectedFilters, (filter) => {
                            return _.toLower(post.kategorija_id.kategorija_name) === _.toLower(filter)
                        })

                        if (maches) {
                            app.filteredPosts.push(post)
                        }
                    })
                }
            },
            formatDate(date) {
                return moment(date).format('MMM DD.YYYY')
            },
            sortPosts() {
                let sort = this.sortBy.split(".");
                this.filteredPosts = _.orderBy(this.filteredPosts, [sort[0]], [sort[1]]);
            },
            beautifyString(string) {
                string = string.replace(/[^a-zA-Z0-9 ]/g, "")
                return string.replace(/\s/g, "-")
            }
        }
    }
</script>