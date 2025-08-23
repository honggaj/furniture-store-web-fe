import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersManagementRoutingModule } from './users-management-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserCreateComponent } from './user-create/user-create.component';

// Thêm PrimeNG
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';


@NgModule({
  declarations: [
    UserListComponent,
    UserUpdateComponent,
    UserCreateComponent
  ],
  imports: [
    CommonModule,
    UsersManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsersManagementModule { }
