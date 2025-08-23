import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: false,
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  products = [
    { name: 'Item 1', img: 'assets/images/banner_1.jpeg' },
    { name: 'Item 2', img: 'assets/images/banner_2.jpeg' },
    { name: 'Item 3', img: 'assets/images/banner_2.jpeg' },
  ];
}