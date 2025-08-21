import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResponse } from '../../../../api/models';
import { UserService } from '../../../../api/services';

@Component({
  selector: 'app-user-update',
  standalone: false,
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent {
  form!: FormGroup;
  loading = false;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
    });

    this.loadUser();
  }

  loadUser() {
    this.userService.apiUserIdGet$Json({ id: this.userId }).subscribe({
      next: (user: UserResponse) => {
        this.form.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        
        });
      },
      error: err => console.error('Load user failed', err)
    });
  }

  submit() {

    this.userService.apiUserIdPut$Json({ id: this.userId, body: this.form.value }).subscribe({
      next: res => {
        alert('User updated successfully!');
        this.router.navigate(['/users']);
      },
      error: err => {
        console.error('Update failed', err);
        this.loading = false;
      }
    });

  }
}