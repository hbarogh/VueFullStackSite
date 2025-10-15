<template>
  <div v-if="product">
    <div class="img-wrap">
      <img :src="product.imageUrl" />
    </div>
    <div class="product-details">
      <h1>{{ product.name }}</h1>
      <h3 class="price">{{ product.price }}</h3>
      <button @click="addToCart"  class="add-to-cart" v-if="user && !itemIsInCart">Add to cart</button>
      <button class="grey-button" v-if="user && itemIsInCart">Item is already in cart</button>
      <button class="sign-in" @click="signIn" v-if="!user">Sign in to add to cart</button>
    </div>
  </div>
  <div v-if="!product">
    <NotFoundPage/>
  </div>
</template>

<script>
  import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink  } from "firebase/auth";
  import axios from 'axios';
  import NotFoundPage from './NotFoundPage.vue';
  export default {
    name: "ProductDetailPage",
    props: ['user'],
    data(){
      return{
        product: {},
        cartItems: [],
      }
    },
    computed: {
      itemIsInCart() {
        return this.cartItems.some(item => item.id === this.$route.params.productId);
      }
    },
    watch: {
      async user(newUserValue) {
        if (newUserValue) {
        const cartResponse = await axios.get(`/api/users/${newUserValue.uid}/cart`);
        const cartItems = cartResponse.data;
        this.cartItems = cartItems; 
        }
      }
    },
    methods: {
      async addToCart() {
        await axios.post(`/api/users/${this.user.uid}/cart`, {id: this.$route.params.productId});
        alert('Successfully added item to cart!');
      },
      async signIn() {
        const email = prompt('Please enter your email address:'); //here I am asking the user for their email address
        const auth = getAuth(); //references the firebase auth object
        const actionCodeSettings = {
          // url: `https://vuefullstacksite-deployment.onrender.com/products/${this.$route.params.productId}`,
          url: `http://localhost:8001/products/${this.$route.params.productId}`,
          handleCodeInApp: true, //just tells firebase that we want to handle the code in app 
        }
        await sendSignInLinkToEmail(auth, email, actionCodeSettings); //sends the sign in link to the user's email address
        alert('Check your email for the sign in link!'); //could change this to a modal popup for when an email link is sent to the user
        window.localStorage.setItem('emailForSignIn', email); //saves the email address to local storage so we can use it later        
      }
    },
    components: {
      NotFoundPage
    },
    async created () {
      //here I am validating the email sign in and then removing the email from local storage
      const auth = getAuth();
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = window.localStorage.getItem('emailForSignIn');
        await signInWithEmailLink(auth, email, window.location.href);
        alert('Successfully signed in!');
        window.localStorage.removeItem('emailForSignIn'); 
      }
      
      const response = await axios.get(`/api/products/${this.$route.params.productId}`);
      const product = response.data;
      this.product = product;
      if (this.user) {
        const cartResponse = await axios.get(`/api/users/${this.user.uid}/cart`);
        const cartItems = cartResponse.data;
        this.cartItems = cartItems; 
      }
    },
  }
</script>