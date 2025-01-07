<template>
  <h1>Shopping Cart</h1>
  <ShoppingCartList :cartItems="cartItems"/>
</template>

<script>
  import ShoppingCartList from '../components/ShoppingCartList.vue';
  import {cartItems} from '../temp-data';
  export default {
    name: "ShoppingCartPage",
    components: {
      ShoppingCartList,
    },
    data(){
      return{
        cartItems,
      }
    }
  }
</script>