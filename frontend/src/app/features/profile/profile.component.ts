import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto mt-6">
      <div class="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
        <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold shadow-inner">
          {{ user?.fullName?.charAt(0) || 'A' }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Hồ sơ Quản trị viên</h1>
          <p class="text-gray-500 mt-1">Thông tin tài khoản đang đăng nhập</p>
        </div>
      </div>

      <div class="space-y-2">
        <div class="grid grid-cols-3 gap-4 py-4 border-b border-gray-50 hover:bg-gray-50 px-4 rounded transition-colors">
          <div class="text-gray-500 font-medium">Họ và Tên</div>
          <div class="col-span-2 text-gray-900 font-semibold text-lg">{{ user?.fullName || 'Không có' }}</div>
        </div>

        <div class="grid grid-cols-3 gap-4 py-4 border-b border-gray-50 hover:bg-gray-50 px-4 rounded transition-colors">
          <div class="text-gray-500 font-medium">Tên đăng nhập</div>
          <div class="col-span-2 text-gray-900">{{ user?.username || 'Không có' }}</div>
        </div>

        <div class="grid grid-cols-3 gap-4 py-4 hover:bg-gray-50 px-4 rounded transition-colors">
          <div class="text-gray-500 font-medium">Quyền hạn (Role)</div>
          <div class="col-span-2 text-blue-600 font-medium flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            Administrator
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-xs text-gray-400">Các thông tin này được đồng bộ từ tài khoản đăng nhập.</p>
      </div>
    </div>
  `
})
export class ProfileComponent {
  private authService = inject(AuthService);
  user = this.authService.getCurrentUser();
}

