import { Component } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ProductResponse } from '../../../../api/models';
import { ProductService } from '../../../../api/services';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent { products: ProductResponse[] = [];
  allProductsBackup: ProductResponse[] = []; // nếu muốn fallback client filter
  keyword = '';
  loading = false;
  error = '';

  private search$ = new Subject<string>();
  private sub?: Subscription;

  constructor(private productService: ProductService, private router:Router) {}

  ngOnInit(): void {
    this.loadProducts(); // initial load

    // stream search với debounce
    this.sub = this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(kw => {
          this.loading = true;
          this.error = '';
          // server-side search: GET /api/product?keyword=kw
          return this.productService.apiProductSearchGet$Json({ name: kw }).pipe(
            catchError(err => {
              this.error = 'Tìm kiếm lỗi. Thử lại sau.';
              console.error(err);
              return of([] as ProductResponse[]);
            })
          );
        })
      )
      .subscribe(res => {
        this.products = res;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

loadProducts(): void {
  this.loading = true;
  this.productService.apiProductGet$Json()
    .subscribe({
      next: res => {
        // Không map gì, dùng trực tiếp imageUrls
        this.products = res.map(p => ({
          ...p,
          imageUrls: p.imageUrls || [] // đảm bảo luôn có array
        }));
        this.allProductsBackup = this.products;
        this.loading = false;
      },
      error: err => {
        this.error = 'Không tải được danh sách sản phẩm.';
        console.error(err);
        this.loading = false;
      }
    });
}



  onSearchInput(): void {
    // nếu rỗng -> load all (không gọi API search)
    const kw = this.keyword?.trim() || '';
    if (!kw) {
      this.products = this.allProductsBackup;
      return;
    }
    this.search$.next(kw);
  }

 editProduct(product: ProductResponse): void { this.router.navigate(['/admin/products-management/update', product.productId]); }
 
   addProduct(): void {
     this.router.navigate(['/admin/products-management/create']);
   }

  deleteProduct(id: number): void {
    // gọi API xóa -> reload
    this.productService.apiProductIdDelete({ id }).subscribe(() => this.loadProducts());
  }

  onStatusChange(p: ProductResponse): void {
    // gọi API cập nhật trạng thái nếu có endpoint
    // this.api.apiProductIdPatch({ id: p.productId, body: { isActive: p.isActive } }).subscribe();
  }
}