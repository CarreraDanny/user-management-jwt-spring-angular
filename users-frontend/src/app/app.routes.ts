import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user';
import { FormUser } from './components/form-user/form-user';
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UserComponent
  },
  {
    path: 'users/create',
    component: FormUser
  },
  {
    path: 'users/edit/:id',
    component: FormUser
  }
];