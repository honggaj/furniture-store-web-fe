import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColorsService } from '../../../../api/services';
import { ColorResponse } from '../../../../api/models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-color-update',
  standalone:false,
  templateUrl: './color-update.component.html',
  styleUrls: ['./color-update.component.css']
})
export class ColorUpdateComponent implements OnInit {
  colorId!: number;
  form: { name: string; isActive: boolean } = { name: '', isActive: true };
  loading = false;
  isSubmitting = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private colorService: ColorsService,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    this.colorId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadColor();
  }

loadColor() {
  this.loading = true;

  this.http.get<ColorResponse>(`http://localhost:5168/api/Colors/${this.colorId}`)
    .subscribe({
      next: (res) => {
        // res chắc chắn là ColorResponse
        this.form.name = res?.name || '';
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Không tải được thông tin màu!');
        this.loading = false;
      }
    });
}


  onSubmit() {
    this.isSubmitting = true;
    this.colorService.apiColorsIdPut({ id: this.colorId, body: this.form }).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Cập nhật màu sắc thành công!');
        this.router.navigate(['/admin/colors-management']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        this.error = 'Cập nhật thất bại';
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/colors-management']);
  }
}
