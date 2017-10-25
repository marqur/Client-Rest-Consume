<template>
    <div :class="{zIndex: showInfo}">
        <section class="herbarijum">
            <div class="container">

                <!-- H item group -->
                <div class="herbarijum-item_group" v-for="(category,index) in categories">
                    <!-- H item letter -->
                    <div class="herbarijum-letter">{{ category.letter }}</div>
                    <!--// H item letter

                    <!-- H Item -->
                    <div class="herbarijum-item" v-for="(herb,index) in category.herbs">
                        <div class="herbarijum-item_text frow centered">
                            <div>
                                <h2 class="big">{{ herb.naziv }}</h2>
                                <p class="p-big">{{ herb.podnaslov }}</p>
                                <div class="btn-holder">
                                    <div class="btn btn-green" @click="showItemInfo(herb)">Pročitaj više</div>
                                </div>
                            </div>
                        </div>
                        <div class="herbarijum-item_image">
                            <img :src="'http://eterra.brainzined.com/storage/'+herb.slika" :alt="herb.naziv">
                        </div>
                    </div>
                    <!--// H Item -->
                </div>
                <!--// H item group -->

            </div>
        </section>

        <div class="herbarijum-info" :class="{visible: showInfo, closing: closingInfo}">
            <div class="herbarijum-info_left" :style="{ 'background-image': 'url(http://eterra.brainzined.com/storage/' + selectedHerb.slika + ')' }"></div>
            <div class="herbarijum-info_right">
                <!-- Clos modal btn -->
                <div class="delete-btn animated-vertical" @click="closeInfo()"></div>
                <span class="caption">{{ selectedHerb.naziv }}</span>
                <h1>{{ selectedHerb.podnaslov }}</h1>
                <div v-html="selectedHerb.text" class="p-big"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import store from '../app-store.js'

    export default{
        data() {
            return {
                showInfo: false,
                closingInfo: false,
                selectedHerb: {},
                categories: [],
                herbs: store.state.herbs
            }
        },
        created() {
            let app = this
            // fetch herbs data if it is not stored
            if (store.state.herbs.length > 0) {
                this.createCategories(this.herbs)
            } else {
                HTTP.get(`herbs`)
                    .then(response => {
                        app.herbs = response.data.herbarijum
                        app.createCategories(app.herbs)
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
            // Listen to window scroll event
            window.addEventListener('scroll', this.handleScroll);
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll);
        },
        methods: {
            createCategories(herbs) {
                let app = this
                _.forEach(_.sortBy(herbs,['naziv']), (herb) => {
                    if (app.categories.length > 0) {
                        if(_.some(app.categories, (category) => {return _.toLower(category.letter) === _.toLower(herb.naziv[0])})) {
                            let i = _.findIndex(app.categories, ['letter', _.toLower(herb.naziv[0])])
                            app.categories[i].herbs.push(herb)
                        } else {
                            app.categories.push({
                                letter: _.toLower(herb.naziv[0]),
                                herbs: [herb]
                            })
                        }
                    } else {
                        app.categories.push({
                            letter: _.toLower(herb.naziv[0]),
                            herbs: [herb]
                        })
                    }
                })
            },
            handleScroll(e) {

            },
            showItemInfo(herb) {
                this.selectedHerb = herb
                this.showInfo = true
                document.body.className = 'no-scroll'
            },
            closeInfo() {
                let app = this
                app.closingInfo = true

                setTimeout(function() {
                    app.showInfo = false
                    app.closingInfo = false
                    document.body.className = ''
                }, 400)
            }
        }
    }
</script>