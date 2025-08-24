import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-product-update',
  standalone:false,
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit, OnDestroy {
  productId!: number;
  form: any = {
    categoryId: '',
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    isActive: true,
    isFeatured: false,
    colorIds: [] as number[]
  };

  files: File[] = [];
  previewUrls: string[] = [];
  existingImages: string[] = [];
  categories: any[] = [];
  colors: any[] = [];
  maxFiles = 4;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  isSubmitting = false;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    
    forkJoin([this.loadCategories(), this.loadColors()]).subscribe(() => this.loadProduct());
  }

  ngOnDestroy(): void {
    this.previewUrls.forEach((url, i) => {
      if (i >= this.existingImages.length) URL.revokeObjectURL(url);
    });
  }

  loadCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5168/api/categories')
      .pipe(tap(res => this.categories = res));
  }

  loadColors(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5168/api/colors')
      .pipe(tap(res => this.colors = res));
  }

  loadProduct() {
    this.http.get<any>(`http://localhost:5168/api/products/${this.productId}`)
      .subscribe(product => {
        this.form.categoryId = product.categoryId;
        this.form.name = product.name;
        this.form.description = product.description;
        this.form.price = product.price;
        this.form.stockQuantity = product.stockQuantity;
        this.form.isActive = product.isActive;
        this.form.isFeatured = product.isFeatured;
        this.form.colorIds = product.colors?.map((c: any) => c.colorId) || [];

        if (product.images?.length) {
          // backend có thể trả string hoặc object {url}
          this.existingImages = product.images.map((img: any) => img.url ? `http://localhost:5168${img.url}` : img);
          this.previewUrls = [...this.existingImages];
        }
      });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const selectedFiles = Array.from(input.files);
    const totalImages = this.previewUrls.length + selectedFiles.length;

    if (totalImages > this.maxFiles) {
      alert(`Chỉ được tối đa ${this.maxFiles} ảnh`);
      input.value = '';
      return;
    }

    const oversized = selectedFiles.filter(f => f.size > this.maxFileSize);
    if (oversized.length) { alert('Một số file >5MB'); input.value = ''; return; }

    const invalid = selectedFiles.filter(f => !f.type.startsWith('image/'));
    if (invalid.length) { alert('Chỉ chọn file ảnh'); input.value = ''; return; }

    this.files.push(...selectedFiles);
    this.previewUrls.push(...selectedFiles.map(f => URL.createObjectURL(f)));
    input.value = '';
  }

  removeImage(index: number) {
    if (index >= this.existingImages.length) {
      const fileIndex = index - this.existingImages.length;
      URL.revokeObjectURL(this.previewUrls[index]);
      this.files.splice(fileIndex, 1);
    } else {
      this.existingImages.splice(index, 1);
    }
    this.previewUrls.splice(index, 1);
  }

  onColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    this.form.colorIds = target.checked
      ? [...new Set([...this.form.colorIds, value])]
      : this.form.colorIds = this.form.colorIds.filter((id: number) => id !== value);

  }

  validateForm(): boolean {
    if (!this.form.categoryId) { alert('Chọn danh mục'); return false; }
    if (!this.form.name?.trim()) { alert('Nhập tên sản phẩm'); return false; }
    if (this.form.price <= 0) { alert('Giá > 0'); return false; }
    if (this.form.stockQuantity < 0) { alert('Số lượng >= 0'); return false; }
    return true;
  }

  onSubmit() {
    if (this.isSubmitting || !this.validateForm()) return;
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('CategoryId', String(this.form.categoryId));
    formData.append('Name', this.form.name.trim());
    formData.append('Description', this.form.description || '');
    formData.append('Price', String(this.form.price));
    formData.append('StockQuantity', String(this.form.stockQuantity));
    formData.append('IsActive', String(this.form.isActive));
    formData.append('IsFeatured', String(this.form.isFeatured));

    this.form.colorIds.forEach((id: number) => formData.append('ColorIds', String(id)));
    this.files.forEach(f => formData.append('NewImages', f, f.name));

    this.http.put(`http://localhost:5168/api/products/${this.productId}`, formData)
      .subscribe({
        next: (res) => { alert('Cập nhật thành công'); this.router.navigate(['/admin/products-management']); },
        error: (err) => {
          let msg = 'Lỗi!';
          if (err.error?.errors) {
            msg = Object.entries(err.error.errors)
              .map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
              .join('\n');
          } else if (err.error?.title) msg = err.error.title;
          else msg = `Lỗi ${err.status}: ${err.statusText}`;
          alert(msg);
          this.isSubmitting = false;
        }
      });
  }
}
