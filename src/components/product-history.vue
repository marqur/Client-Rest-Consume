<template>
    <div class="view-inner">
        <h3>Kupljeni proizvodi</h3>
        <div class="content">
            <div class="content-inner">
                <table>
                    <thead>
                        <tr>
                            <th v-for="(column, index) in columns" @click="sortBy(column)">{{ column.name }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in products">
                            <td>{{ index }}</td>
                            <td>{{ product.naziv }}</td>
                            <td>22/12/2017</td>
                            <td><img :src="'http://eterra.brainzined.com/storage/'+product.slika" alt=""></td>
                            <td>{{ product.cena }}</td>
                            <td>1</td>
                            <td><etr-btn-prod-add v-bind:product="product"></etr-btn-prod-add></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
    import moment from 'moment'
    import {HTTP} from './http-helper.vue';
    import store from '../app-store.js'
    import btnProdAdd from './btn-prod-add.vue'

    export default {
        data() {
            return {
                columns: [
                    {name: '#', sortKey: 'index'},
                    {name: 'Ime proizvoda', sortKey: 'naziv'},
                    {name: 'Datum', sortKey: 'Datum'},
                    {name: 'Slika', sortKey: null},
                    {name: 'Cena', sortKey: 'Cena'},
                    {name: 'kolicina', sortKey: null},
                    {name: 'Kupi', sortKey: null},
                ],
                sortKey: 'naziv',
                reverse: false,
                products: []
            }
        },
        created() {
            let app = this
            HTTP.get(`order/`+store.state.user.id)
                .then(response => {
                    app.products = response.data.orders
                })
                .catch(e => {
                    this.errors.push(e)
                })
        },
        methods: {
            delete: function() {
                console.log('dasdas')
            },
            sortBy: function(column) {
                if (column.sortKey) {
                    this.reverse = (this.sortKey === column.sortKey) ? ! this.reverse : false;
                    this.sortKey = column.sortKey;
                    this.products = this.reverse ? _.sortBy(this.products, column.sortKey) : _.sortBy(this.products, column.sortKey).reverse();
                }
            },
        },
        components: {
            'etr-btn-prod-add': btnProdAdd
        }
    }
</script>