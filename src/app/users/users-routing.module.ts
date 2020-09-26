import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const usersRoutes: Routes = [
  { path: 'users', redirectTo: '/superusers' },
  { path: 'user/:id', redirectTo: '/superuser/:id' },
  { path: 'superusers',  component: UserListComponent, data: { animation: 'users' } },
  { path: 'superuser/:id', component: UserDetailComponent, data: { animation: 'user' } }
];

@NgModule({
  imports: [
    RouterModule.forChild(usersRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UsersRoutingModule { }
