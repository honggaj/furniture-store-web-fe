import { Component } from '@angular/core';
import {  ProductsService } from '../../../api/services';
import { ProductResponse } from '../../../api/models';

@Component({
  selector: 'app-featured-products',
  standalone: false,
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css'
})
export class FeaturedProductsComponent {
  products: ProductResponse[] = [];
  loading = false;

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
