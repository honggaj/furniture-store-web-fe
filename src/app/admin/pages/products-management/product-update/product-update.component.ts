import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-update',
  standalone: false,
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  productId!: number;

  form: any = {
    categoryId: '',
    name: '',
    description: '',
    price: 0,
    brand: '',
    material: '',
    color: '',
    stockQuantity: 0,
    dimensions: '',
    weight: 0,
    warrantyMonths: 0,
    originCountry: ''
  };

  files: File[] = []; // ảnh mới
  previewUrls: string[] = []; // preview ảnh cũ + mới
  existingImages: any[] = []; // ảnh cũ từ BE, có thêm flag keep
  maxFiles = 4;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  categories: any[] = [];
  isSubmitting = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productId = id;
      this.loadProduct(id);
    }
  }

  ngOnDestroy(): void {
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
  }

  loadCategories() {
    this.http.get<any[]>('http://localhost:5291/api/category')
      .subscribe({
        next: res => this.categories = res,
        error: err => console.error('Load categories failed', err)
      });
  }

  loadProduct(id: number) {
    this.http.get<any>(`http://localhost:5291/api/product/${id}`)
      .subscribe(res => {
        this.form = {
          categoryId: res.categoryId,
          name: res.name,
          description: res.description,
          price: res.price,
          brand: res.brand,
          material: res.material,
          color: res.color,
          stockQuantity: res.stockQuantity,
          dimensions: res.dimensions,
          weight: res.weight,
          warrantyMonths: res.warrantyMonths,
          originCountry: res.originCountry
        };

        // Map existing images + flag keep
        this.existingImages = res.productImages.map((i: any) => ({
          imageId: i.imageId,
          url: 'http://localhost:5291' + i.url,
          keep: true
        }));

        this.previewUrls = [...this.existingImages.map(i => i.url)];
      });
  }

  onFileChange(event: any) {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files) as File[];

    if (this.files.length + selectedFiles.length > this.maxFiles) {
      alert(`Chỉ được chọn tối đa ${this.maxFiles} ảnh`);
      event.target.value = '';
      return;
    }

    const oversized = selectedFiles.filter(f => f.size > this.maxFileSize);
    if (oversized.length) {
      alert('Một số file quá lớn (>5MB)');
      event.target.value = '';
      return;
    }

    const invalidType = selectedFiles.filter(f => !f.type.startsWith('image/'));
    if (invalidType.length) {
      alert('Chỉ được chọn ảnh (JPG, PNG, GIF)');
      event.target.value = '';
      return;
    }

    this.files = [...this.files, ...selectedFiles];
    this.previewUrls = [...this.previewUrls, ...selectedFiles.map(f => URL.createObjectURL(f))];
    event.target.value = '';
  }

  removeImage(index: number) {
    // Xóa ảnh cũ
    if (index < this.existingImages.length) {
      this.existingImages[index].keep = false;
    } else {
      // Xóa ảnh mới
      const newIndex = index - this.existingImages.length;
      this.files.splice(newIndex, 1);
    }
    URL.revokeObjectURL(this.previewUrls[index]);
    this.previewUrls.splice(index, 1);
  }

  validateForm(): boolean {
    if (!this.form.categoryId) { alert('Chọn danh mục'); return false; }
    if (!this.form.name || !this.form.name.trim()) { alert('Nhập tên sản phẩm'); return false; }
    if (this.form.price <= 0) { alert('Giá > 0'); return false; }
    if (this.previewUrls.length === 0) { alert('Chọn ít nhất 1 ảnh'); return false; }
    return true;
  }

  onUpdate() {
    if (!this.productId) return;
    if (this.isSubmitting) return;
    if (!this.validateForm()) return;

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('CategoryId', String(this.form.categoryId));
    formData.append('Name', this.form.name);
    formData.append('Description', this.form.description);
    formData.append('Price', String(this.form.price));
    formData.append('Brand', this.form.brand);
    formData.append('Material', this.form.material);
    formData.append('Color', this.form.color);
    formData.append('StockQuantity', String(this.form.stockQuantity));
    formData.append('Dimensions', this.form.dimensions);
    formData.append('Weight', String(this.form.weight));
    formData.append('WarrantyMonths', String(this.form.warrantyMonths));
    formData.append('OriginCountry', this.form.originCountry);

    // Thêm ảnh mới
    this.files.forEach(file => formData.append('AddImages', file, file.name));

    // ID ảnh cũ bị xóa
    const removeIds = this.existingImages
      .filter(img => !img.keep)
      .map(i => i.imageId);
    removeIds.forEach(id => formData.append('RemoveImageIds', String(id)));

    this.http.put(`http://localhost:5291/api/product/${this.productId}`, formData)
      .subscribe({
        next: () => {
          alert('✅ Cập nhật sản phẩm thành công!');
          this.router.navigate(['/admin/products-management']);
        },
        error: err => {
          console.error(err);
          alert('❌ Lỗi khi cập nhật sản phẩm!');
        }
      });
  }

  // Cho nút + click mở file input
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
}
