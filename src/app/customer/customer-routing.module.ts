import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { StoreComponent } from './pages/store/store.component';

const routes: Routes = [
  {
    path: '', // /customer
    component: CustomerLayoutComponent,
    children: [
      { path: '', component: HomeComponent },       // /customer -> Home
      { path: 'about', component: AboutComponent }, // /customer/about
      { path: 'store', component: StoreComponent }  // /customer/store
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
