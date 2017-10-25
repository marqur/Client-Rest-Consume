<template>
    <div class="btn btn-green" @click.prevent="addToCart">Stavi u korpu</div>
</template>
<script>
    import { EventBus } from '../event-bus.js';

    export default {
        props: ['product', 'quantity', 'disabled'],
        data() {
            return {}
        },
        methods: {
            addToCart: function() {
                if(!this.disabled) {
                    EventBus.$emit('addToCart', {product: this.product, quantity: this.quantity ? this.quantity:1})
                }
            }
        }
    }
</script>