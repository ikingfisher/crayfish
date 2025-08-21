import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
    mounted() {
    document.title = 'Tools';
  }
}).$mount('#app');
