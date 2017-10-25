<template>
	<div>
		<!-- Hero -->
		<section class="hero hero_products">
			<div class="container frow centered">
				<div class="hero__text col-lg-1-2">
					<h3>Shop – Izaberite i poručite proizvod</h3>
				</div>
			</div>
		</section>
		<!--// Hero -->

		<!-- Filters -->
		<div class="filters" :class="{ sticky: fixed }">
			<div class="container">
				<div class="filters-inner frow justify-between">
					<div class="left">
						<span class="caption grey sans-serif">filtriraj po</span>
						<div class="filter-options">
							<span v-for="(category, index) in filterCategories"
								  class="filter-option caption black sans-serif"
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
									@change="sortProducts">
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

		<!-- Product list -->
		<section class="products">
			<div class="container">
				<etr-product-item :product="product"
								  v-for="(product, index) in filteredProducts"
								  :key="index"></etr-product-item>
			</div>
		</section>
	</div>
</template>

<script>
	import {HTTP} from './http-helper.vue';
	import productItem from './product-item.vue'
    import store from '../app-store.js'
    import { router } from '../router.js'
    import { EventBus } from '../event-bus.js';

	export default {
		data() {
			return {
                products: [],
                filteredProducts: [],
                errors: [],
                filterTabOpen: false,
				selectedCategory: '',
				filterCategories: [
					{
					    name: 'bolesti',
						filters: ['tonira i ishranjuje', 'akne']
					},
                    {
                        name: 'cakre',
                        filters: ['podmlađuje kožu', 'protiv raka']
                    }
				],
				filters: [],
				selectedFilters: [],
				fixed: false,
                sortBy: '',
                sortOptions: [
                    {name: 'Rastuća cena', value: 'cena.asc'},
                    {name: 'Opadajuća cena', value: 'cena.desc'},
                    {name: 'Rastuća zapremina', value: 'zapremina.asc'},
                    {name: 'Opadajuća zapremina', value: 'zapremina.desc'}
                ]
			}
		},
		created() {
		    let app = this

			// Fetch products if they are not yet cached
			if (store.state.products.length > 0) {
                app.products = store.state.products
                app.filteredProducts = store.state.products
			} else {
                HTTP.get(`products`)
                    .then(response => {
                        app.products = response.data.products
						app.filteredProducts = response.data.products
                    })
                    .catch(e => {
                        console.log(e)
                        this.errors.push(e)
                    })
			}

            // Listen to window scroll event
            window.addEventListener('scroll', this.handleScroll);
		},
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll);
        },
		methods: {
		    initFilters() {

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
                this.filteredProducts = []
				if (this.selectedFilters.length === 0) {
                    app.filteredProducts = app.products
				} else {
                    _.forEach(app.products, (product) => {
                        let notMaches = _.some(app.selectedFilters, (filter) => {
                            return _.every(product.filteri, (item) => {
                                return _.toLower(filter) !== _.toLower(item.filteri)
							})
                        })

                        if (!notMaches) {
                            app.filteredProducts.push(product)
                        }
                    })
				}
			},
            handleScroll(e) {
                this.fixed = e.srcElement.scrollingElement.scrollTop > 250
            },
            sortProducts() {
				let sort = this.sortBy.split(".");
                this.filteredProducts = _.orderBy(this.filteredProducts, [sort[0]], [sort[1]]);
            }
		},
		components: {
            'etr-product-item': productItem
		}
	}
</script>