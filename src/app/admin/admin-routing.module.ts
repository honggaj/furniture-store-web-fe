import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'users-management',
        loadChildren: () =>
          import('./pages/users-management/users-management.module').then(
            m => m.UsersManagementModule
          ),
      },
      {
        path: 'products-management',
        loadChildren: () =>
          import('./pages/products-management/products-management.module').then(
            m => m.ProductsManagementModule
          ),
      },
       {
        path: 'colors-management',
        loadChildren: () =>
          import('./pages/colors-management/colors-management.module').then(
            m => m.ColorManagementModule
          ),
      },
      { path: '', redirectTo: 'users-management', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
