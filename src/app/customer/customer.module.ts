import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { StoreComponent } from './pages/store/store.component';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';


@NgModule({
  declarations: [
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    StoreComponent,
    CustomerLayoutComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    
    
  ]
})
export class CustomerModule { }
