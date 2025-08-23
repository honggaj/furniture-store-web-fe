import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsManagementRoutingModule } from './products-management-routing.module';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductUpdateComponent,
    ProductCreateComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    ProductsManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProductsManagementModule { }
