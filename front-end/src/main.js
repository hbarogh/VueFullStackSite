import { createApp } from 'vue'
import App from './App.vue'
import './main.css';
import * as VueRouter from 'vue-router'
import ShoppingCartPage from './pages/ShoppingCartPage.vue'
import ProductsPage from './pages/ProductsPage.vue'
import ProductDetailPage from './pages/ProductDetailPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDm75lJRCU9WMbyojAMkZXWnUjXRS7CnII",
  authDomain: "vue-site-cdb9c.firebaseapp.com",
  projectId: "vue-site-cdb9c",
  storageBucket: "vue-site-cdb9c.firebasestorage.app",
  messagingSenderId: "968034649563",
  appId: "1:968034649563:web:be9db8db8f8f369e6b53fe"
};


initializeApp(firebaseConfig);

createApp(App)
.use(VueRouter.createRouter({
  history: VueRouter.createWebHistory(process.env.BASE_URL),
  routes: [{
    path: '/cart', 
    component: ShoppingCartPage,
  }, {
    path: '/products', 
    component: ProductsPage
  }, {
    path: '/products/:productId', 
    component: ProductDetailPage,
  }, {
    path: '/',
    redirect: '/products',
  }, {
    path: '/:pathMatch(.*)*',
    component: NotFoundPage
  }]
}))
.mount('#app')
