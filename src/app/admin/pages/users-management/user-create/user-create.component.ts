import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../api/services';
import { UserCreateRequest, UserResponse } from '../../../../api/models';

@Component({
  selector: 'app-user-create',
  standalone: false,
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute  // thêm dòng này

  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: [''],
      address: [''],
      role: ['employee'], // default
      isActive: [true] // hoặc null
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    const payload: UserCreateRequest = this.form.value;

    this.userService.apiUserPost$Json({ body: payload })
      .subscribe({
        next: (res: UserResponse) => {
          this.loading = false;
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('Create user failed', err);
          this.loading = false;
        }
      });

  }
}