import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersManagementRoutingModule } from './users-management-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserCreateComponent } from './user-create/user-create.component';


@NgModule({
  declarations: [
    UserListComponent,
    UserUpdateComponent,
    UserCreateComponent
  ],
  imports: [
    CommonModule,
    UsersManagementRoutingModule
  ]
})
export class UsersManagementModule { }
