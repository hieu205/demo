import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div class="flex items-center gap-4 mb-6">
        <div class="p-3 bg-blue-100 rounded-full text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Trang chủ Quản trị</h1>
          <p class="text-gray-500">Chào mừng bạn đến với Hệ thống quản lý Học sinh</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 class="text-blue-800 font-semibold text-lg">Tổng số Học sinh</h3>
          <p class="text-3xl font-bold text-blue-600 mt-2">1,245</p>
        </div>
        <div class="bg-green-50 p-6 rounded-lg border border-green-100">
          <h3 class="text-green-800 font-semibold text-lg">Tổng số Phụ huynh</h3>
          <p class="text-3xl font-bold text-green-600 mt-2">1,102</p>
        </div>
        <div class="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <h3 class="text-purple-800 font-semibold text-lg">Học sinh mới (Tháng)</h3>
          <p class="text-3xl font-bold text-purple-600 mt-2">+42</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}

