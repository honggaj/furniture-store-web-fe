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
    stockQuantity: 0,
    isActive: true,
    isFeatured: false,
    colorIds: [] as number[]
  };

  files: File[] = [];
  previewUrls: string[] = [];
  maxFiles = 4;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  categories: any[] = [];
  colors: any[] = [];   // ✅ danh sách màu từ API
  isSubmitting = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadColors(); // ✅ load màu
  }

  ngOnDestroy(): void {
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
  }

  loadCategories() {
    this.http.get<any[]>('http://localhost:5168/api/categories')
      .subscribe({
        next: (res) => this.categories = res,
        error: (err) => console.error('Load category fail:', err)
      });
  }

  loadColors() {
    this.http.get<any[]>('http://localhost:5168/api/colors')
      .subscribe({
        next: (res) => this.colors = res,
        error: (err) => console.error('Load colors fail:', err)
      });
  }

  onFileChange(event: any) {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files) as File[];
      if (this.files.length + selectedFiles.length > this.maxFiles) {
        alert(`Chỉ được chọn tối đa ${this.maxFiles} ảnh`);
        event.target.value = '';
        return;
      }
      const oversizedFiles = selectedFiles.filter(file => file.size > this.maxFileSize);
      if (oversizedFiles.length > 0) {
        alert('Một số file có kích thước quá lớn (>5MB)');
        event.target.value = '';
        return;
      }
      const invalidTypes = selectedFiles.filter(file => !file.type.startsWith('image/'));
      if (invalidTypes.length > 0) {
        alert('Chỉ được chọn file ảnh (JPG, PNG, GIF, v.v.)');
        event.target.value = '';
        return;
      }

      this.files = [...this.files, ...selectedFiles];
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      this.previewUrls = [...this.previewUrls, ...newPreviewUrls];
      event.target.value = '';
    }
  }

  removeImage(index: number) {
    URL.revokeObjectURL(this.previewUrls[index]);
    this.files.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  resetForm() {
    this.form = {
      categoryId: '',
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      isActive: true,
      isFeatured: false,
      colorIds: []
    };
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
onColorChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);
  if (target.checked) {
    this.form.colorIds.push(value);
  } else {
this.form.colorIds = this.form.colorIds.filter((id: number) => id !== value);
  }
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
    formData.append('StockQuantity', String(this.form.stockQuantity));
    formData.append('IsActive', String(this.form.isActive));
    formData.append('IsFeatured', String(this.form.isFeatured));

    // ✅ append ColorIds an toàn
    (this.form.colorIds || []).forEach((id: number) => {
      if (id != null) {
        formData.append('ColorIds', String(id));
      }
    });

    // ✅ append Images
    this.files.forEach(file => {
      formData.append('NewImages', file, file.name);
    });

    this.http.post('http://localhost:5168/api/products', formData)
      .subscribe({
        next: () => {
          alert('✅ Tạo sản phẩm thành công!');
          this.resetForm();
          this.isSubmitting = false;
          this.router.navigate(['/admin/products-management']);
        },
        error: (err) => {
          console.error('HTTP 400:', err);
          alert('❌ Lỗi khi tạo sản phẩm!');
          this.isSubmitting = false;
        }
      });
  }

}
