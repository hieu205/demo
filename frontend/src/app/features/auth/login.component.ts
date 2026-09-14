import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-96">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800">Hệ thống Quản lý</h2>
          <p class="text-gray-500 text-sm mt-1">Đăng nhập dành cho Admin</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- Username -->
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
              Tài khoản
            </label>
            <input
              formControlName="username"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              [ngClass]="{'border-red-500': submitted() && f['username'].errors}"
              id="username"
              type="text"
              placeholder="admin01">
            <p *ngIf="submitted() && f['username'].errors?.['required']" class="text-red-500 text-xs italic mt-1">
              Vui lòng nhập tài khoản.
            </p>
          </div>

          <!-- Password -->
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Mật khẩu
            </label>
            <input
              formControlName="password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              [ngClass]="{'border-red-500': submitted() && f['password'].errors}"
              id="password"
              type="password"
              placeholder="******">
            <p *ngIf="submitted() && f['password'].errors?.['required']" class="text-red-500 text-xs italic mt-1">
              Vui lòng nhập mật khẩu.
            </p>
          </div>

          <!-- Error message from server -->
          <div *ngIf="errorMessage()" class="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded text-sm text-center">
            {{ errorMessage() }}
          </div>

          <div class="flex items-center justify-between">
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              [disabled]="isLoading()">
              <svg *ngIf="isLoading()" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading() ? 'Đang xử lý...' : 'Đăng nhập' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  submitted = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        // Lưu token vào LocalStorage
        this.authService.setToken(res.accessToken);
        // Lưu thông tin user
        this.authService.setCurrentUser(res.admin);
        // Chuyển hướng vào trang trong
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Có lỗi xảy ra từ máy chủ');
      }
    });
  }
}
