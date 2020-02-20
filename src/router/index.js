import Vue from 'vue'
import Router from 'vue-router'
import homeIndex from '@/pages/index'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home/:channel?',
      name: 'homeIndex',
      component: homeIndex
    }
  ]
})
