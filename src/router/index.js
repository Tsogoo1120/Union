import { createRouter, createWebHistory } from 'vue-router'
import HomeView          from '../views/HomeView.vue'
import LibraryView       from '../views/LibraryView.vue'
import CourseView        from '../views/CourseView.vue'
import RegisterView      from '../views/auth/RegisterView.vue'
import ConfirmEmailView  from '../views/auth/ConfirmEmailView.vue'

const routes = [
  { path: '/',             component: HomeView },
  { path: '/library',      component: LibraryView },
  { path: '/course',       component: CourseView },
  { path: '/register',     component: RegisterView },
  { path: '/auth/confirm', component: ConfirmEmailView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
