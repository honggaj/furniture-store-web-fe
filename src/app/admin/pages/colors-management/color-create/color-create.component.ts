import { Component } from '@angular/core';
import { ColorsService } from '../../../../api/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-color-create',
  standalone: false,
  templateUrl: './color-create.component.html',
  styleUrl: './color-create.component.css'
})
export class ColorCreateComponent {
 form = {
    name: '',
    isActive: true
  };
  isSubmitting = false;

  constructor(private colorService: ColorsService, private router: Router) {}

  onSubmit() {
    if (!this.form.name) return alert('Tên màu không được để trống');

    this.isSubmitting = true;
    // gọi API POST tạo màu
    this.colorService.apiColorsPost({ body: { name: this.form.name } }).subscribe({
      next: () => {
        alert('Tạo màu thành công!');
        this.router.navigate(['/admin/colors-management']);
      },
      error: (err) => {
        console.error(err);
        alert('Tạo màu thất bại!');
        this.isSubmitting = false;
      }
    });
  }
  onCancel() {
  this.router.navigate(['/admin/colors-management']);
}

}
