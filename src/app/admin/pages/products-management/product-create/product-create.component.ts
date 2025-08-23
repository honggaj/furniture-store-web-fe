import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit, OnDestroy {
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

  files: File[] = [];
  previewUrls: string[] = [];
  maxFiles = 4;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  categories: any[] = [];
  isSubmitting = false; // Prevent double submit

  constructor(private http: HttpClient, private router:Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    // Cleanup preview URLs to prevent memory leaks
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
  }

  loadCategories() {
    this.http.get<any[]>('http://localhost:5291/api/category')
      .subscribe({
        next: (res) => this.categories = res,
        error: (err) => console.error('Load category fail:', err)
      });
  }

  onFileChange(event: any) {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files) as File[];
      
      // Check file count limit
      if (this.files.length + selectedFiles.length > this.maxFiles) {
        alert(`Chỉ được chọn tối đa ${this.maxFiles} ảnh`);
        event.target.value = ''; // Reset input
        return;
      }

      // Check file size
      const oversizedFiles = selectedFiles.filter(file => file.size > this.maxFileSize);
      if (oversizedFiles.length > 0) {
        alert('Một số file có kích thước quá lớn (>5MB)');
        event.target.value = ''; // Reset input
        return;
      }

      // Check file type
      const invalidTypes = selectedFiles.filter(file => !file.type.startsWith('image/'));
      if (invalidTypes.length > 0) {
        alert('Chỉ được chọn file ảnh (JPG, PNG, GIF, v.v.)');
        event.target.value = ''; // Reset input
        return;
      }

      // Add new files
      this.files = [...this.files, ...selectedFiles];
      
      // Create preview URLs for new files
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      this.previewUrls = [...this.previewUrls, ...newPreviewUrls];
      
      event.target.value = ''; // Reset input để có thể chọn lại cùng file
    }
  }

  removeImage(index: number) {
    // Revoke URL to prevent memory leak
    URL.revokeObjectURL(this.previewUrls[index]);
    
    // Remove file and preview URL
    this.files.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  resetForm() {
    this.form = {
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
    
    // Clear images
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.files = [];
    this.previewUrls = [];
  }

  validateForm(): boolean {
    if (!this.form.categoryId) {
      alert('Vui lòng chọn danh mục');
      return false;
    }
    if (!this.form.name || this.form.name.trim() === '') {
      alert('Vui lòng nhập tên sản phẩm');
      return false;
    }
    if (this.form.price <= 0) {
      alert('Giá sản phẩm phải lớn hơn 0');
      return false;
    }
    if (this.files.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ảnh sản phẩm');
      return false;
    }
    return true;
  }
onSubmit() {
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

  this.files.forEach(file => formData.append('Images', file, file.name));

  this.http.post('http://localhost:5291/api/product', formData)
    .subscribe({
      next: (res) => {
        alert('✅ Tạo sản phẩm thành công!');
        console.log(res);
        this.resetForm();
        this.isSubmitting = false;
                this.router.navigate(['/admin/products-management']); // <-- redirect

      },
      error: (err) => {
        console.error('HTTP 400:', err);
        alert('❌ Lỗi khi tạo sản phẩm! Kiểm tra dữ liệu gửi đi.');
        this.isSubmitting = false;
      }
    });
}


}