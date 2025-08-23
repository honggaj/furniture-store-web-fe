import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // 👈 Quan trọng

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

// Theme config
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AdminLayoutComponent,
   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // 👈 Thêm cái này
    AppRoutingModule,
    HttpClientModule,
 
    FormsModule
  ],
  providers: [
    providePrimeNG({
      theme: {
        preset: Aura,
         options: {
          darkModeSelector: '.my-app-dark' // 👈 Thêm dòng này
        }
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
