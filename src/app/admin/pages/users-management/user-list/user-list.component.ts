import { Component } from '@angular/core';
import { UserService } from '../../../../api/services';
import { UserResponse } from '../../../../api/models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: UserResponse[] = []; // đổi type
  loading = true;
  keyword: string = '';
statusOptions = [
  { label: 'Hoạt động', value: true },
  { label: 'Không hoạt động', value: false }
];
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.apiUserGet$Json().subscribe({
      next: (res: UserResponse[]) => {
        this.users = res;   // assign được dữ liệu
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
      }
    });
  }

onSearch() {
  if (!this.keyword) {
    // nếu rỗng thì load tất cả
    this.loadUsers();
    return;
  }

  this.userService.apiUserSearchGet$Json({ keyword: this.keyword }).subscribe({
    next: (res: UserResponse[]) => {
      this.users = res;
    },
    error: (err) => {
      console.error('Search failed', err);
    }
  });
}

// user-list.component.ts
onStatusChange(user: UserResponse) {
  if (!user.userId) return;

  const params = { id: user.userId }; // chỉ cần path param

  this.userService.apiUserIdChangeActivePatch$Json(params).subscribe({
    next: (updatedUser) => {
      // sync lại trạng thái với server
      user.isActive = updatedUser.isActive;
      console.log(`User ${user.userId} status toggled to ${user.isActive}`);
    },
    error: (err) => {
      console.error('Error toggling status', err);
      // rollback local state nếu lỗi
      user.isActive = !user.isActive;
    }
  });
}

deleteUser(userId: number): void {
  if (!confirm(`Bạn có chắc muốn xóa user này không?`)) return;

  this.userService.apiUserIdDelete({ id: userId }).subscribe({
    next: () => {
      alert('Xoá thành công!');
      this.users = this.users.filter(u => u.userId !== userId);
    },
    error: (err) => console.error('Lỗi xoá user:', err)
  });
}


editUser(user: UserResponse): void { this.router.navigate(['/admin/users-management/update', user.userId]); }

  addUser(): void {
    this.router.navigate(['/admin/users-management/create']);
  }
  
}