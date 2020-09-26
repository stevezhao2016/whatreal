import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

import { UsersRoutingModule } from './users-routing.module';
import {UserService} from "./user.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UsersRoutingModule
  ],
  providers: [
    UserService
  ],
  declarations: [
    UserListComponent,
    UserDetailComponent
  ]
})
export class UsersModule {}
