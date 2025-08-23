import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { StoreComponent } from './pages/store/store.component';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';
import { BannerComponent } from './components/banner/banner.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'primeng/carousel';


@NgModule({
  declarations: [
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    StoreComponent,
    CustomerLayoutComponent,
    BannerComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    NgbModule,
    CarouselModule
    
    
  ]
})
export class CustomerModule { }
