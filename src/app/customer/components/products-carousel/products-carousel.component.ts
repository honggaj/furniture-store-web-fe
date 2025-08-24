import { Component } from '@angular/core';
import {  ProductsService } from '../../../api/services';
import { ProductResponse } from '../../../api/models';

@Component({
  selector: 'app-products-carousel',
  standalone: false,
  templateUrl: './products-carousel.component.html',
  styleUrl: './products-carousel.component.css'
})
export class ProductsCarouselComponent {
    products: ProductResponse[] = [];
  loading = false;
responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1
  }
];

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.apiProductsGet$Json().subscribe({
      next: res => {
        // 👉 lọc chỉ lấy sản phẩm active = true
        this.products = res.filter(p => p.isActive === true);
        this.loading = false;
      },
      error: err => {
        console.error('❌ Lỗi load sản phẩm', err);
        this.loading = false;
      }
    });
  }
}