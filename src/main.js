import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import * as VueRouter from 'vue-router'
import HomeForm from './views/HomeForm.vue'
import FormularioControl from './views/FormularioControl.vue'
import EditarDoc from './views/EditarDoc.vue'
import EscanearBarra from './components/EscanearBarra.vue'
import FormularioPeso from './views/FormularioPeso.vue'
import App from './App.vue'
loadFonts()

const routes = [
  { path: '/', component: HomeForm },
  { path: '/nuevoDocumento', name: 'NuevoDoc', component: FormularioControl },
  { path: '/editarDocumento/:id', name: 'EditarDoc', component: EditarDoc },
  { path: '/escanear', name: 'Escanear', component: EscanearBarra },
  { path: '/formPeso', name: 'FormPeso', component: FormularioPeso}

]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
})
const app = createApp(App)
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router)
app.use(vuetify)

app.mount('#app')
