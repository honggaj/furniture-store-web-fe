import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { HttpClientModule } from '@angular/common/http';



// Theme config
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AdminLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule

  ],
  providers: [
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark'
        }
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }