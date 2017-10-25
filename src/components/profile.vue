<template>
	<section class="profile">
		<div class="container frow justify-center">
			<div class="profile-options">
				<ul>
					<li class="account-link"><i></i><router-link to="account">Moj profil</router-link></li>
					<li class="purchase-history-link"><i></i><router-link to="product-history">Moje porudžbine</router-link></li>
					<li @click="logOut" class="logout-link"><i></i>Izloguj se</li>
				</ul>
			</div>
			<div class="profile-views">
				<router-view></router-view>
			</div>
		</div>
	</section>
</template>

<script>
import axios from 'axios';
import { router } from '../router.js'
import store from '../app-store.js'

	export default {
		data() {
			return {
			    user: store.state.user
			}
		},
		created() {
		    if (!store.state.user.loggedIn) {
                router.push({ path: '/' })
			}
		},
		methods: {
		    logOut() {
                this.$localStorage.remove('user')
                store.state.user.loggedIn = false
                router.push({ path: '/' })
			}
		}
	}

</script>
