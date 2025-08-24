import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorListComponent } from './color-list/color-list.component';
import { ColorCreateComponent } from './color-create/color-create.component';
import { ColorUpdateComponent } from './color-update/color-update.component';

const routes: Routes = [
  { path: '', component: ColorListComponent },
  { path: 'create', component: ColorCreateComponent },
  { path: 'update/:id', component: ColorUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColorManagementRoutingModule { }
