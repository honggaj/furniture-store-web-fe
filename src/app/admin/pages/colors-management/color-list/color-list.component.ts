import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColorResponse } from '../../../../api/models';
import { Router } from '@angular/router';
import { ColorsService } from '../../../../api/services';



@Component({
  selector: 'app-color-list',
  standalone:false,
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.css']
})
export class ColorListComponent implements OnInit {
  colors: ColorResponse[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient,private router:Router,private colorService:ColorsService) {}

  ngOnInit(): void {
    this.loadColors();
  }

  loadColors() {
    this.loading = true;
    this.http.get<ColorResponse[]>('http://localhost:5168/api/Colors').subscribe({
      next: (res) => {
        this.colors = res;  // trả về array
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Không tải được danh sách màu sắc';
        this.loading = false;
      }
    });
  }
  deleteColor(colorId: number): void {
  if (!confirm(`Bạn có chắc muốn xóa màu này không?`)) return;

  this.colorService.apiColorsIdDelete({ id: colorId }).subscribe({
    next: () => {
      alert('Xoá thành công!');
      this.colors = this.colors.filter(c => c.colorId !== colorId);
    },
    error: (err) => console.error('Lỗi xoá màu:', err)
  });
}

editColor(color: ColorResponse): void {
  this.router.navigate(['/admin/colors-management/update', color.colorId]);
}

  
    addColor(): void {
      this.router.navigate(['/admin/colors-management/create']);
    }
    
}
