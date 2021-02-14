import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vSelect from "vue-select"
import "vue-select/dist/vue-select.css"
import VueApexCharts from 'vue-apexcharts'
import moment from 'moment'

Vue.prototype.$moment = moment

Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

Vue.component("v-select", vSelect);


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
