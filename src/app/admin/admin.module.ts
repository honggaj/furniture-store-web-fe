import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersManagementModule } from './pages/users-management/users-management.module';
import { FormsModule } from '@angular/forms';
import { ProductsManagementModule } from './pages/products-management/products-management.module';
import { ColorManagementModule } from './pages/colors-management/colors-management.module';

@NgModule({
  declarations: [
  
  
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    UsersManagementModule,
    FormsModule,
    ProductsManagementModule,
    ColorManagementModule
  ]
})
export class AdminModule { }
