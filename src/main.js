import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import * as VueRouter from 'vue-router'
import HomeForm from './views/HomeForm.vue'
import FormularioControl from './views/FormularioControl.vue'
import EditarDoc from './views/EditarDoc.vue'
import FormularioEscaneo from './views/FormularioEscaneo.vue'
import HomeEscaneo from './views/HomeEscaneo.vue'
import App from './App.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
loadFonts()

const routes = [
  { path: '/', component: HomeForm },
  { path: '/nuevoDocumento', name: 'NuevoDoc', component: FormularioControl },
  { path: '/editarDocumento/:id/:nroRevision', name: 'EditarDoc', component: EditarDoc },
  { path: '/escanear', component: HomeEscaneo },
  { path: '/formEscaneo/:id', name: 'FormEscaneo', component: FormularioEscaneo }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes, 
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.component('VueDatePicker', VueDatePicker);
app.mount('#app')
