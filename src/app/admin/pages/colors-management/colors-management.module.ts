import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorManagementRoutingModule } from './colors-management-routing.module';
import { ColorCreateComponent } from './color-create/color-create.component';
import { ColorUpdateComponent } from './color-update/color-update.component';
import { ColorListComponent } from './color-list/color-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ColorCreateComponent,
    ColorUpdateComponent,
    ColorListComponent
  ],
  imports: [
    CommonModule,
    ColorManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ColorManagementModule { }
