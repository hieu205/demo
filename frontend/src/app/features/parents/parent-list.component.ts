import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ParentService } from '../../core/services/parent.service';
import { Parent } from '../../core/models/parent.model';

@Component({
  selector: 'app-parent-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Header & Search -->
      <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Danh sách Phụ huynh</h2>
          <p class="text-sm text-gray-500 mt-1">Quản lý thông tin phụ huynh toàn trường</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <!-- Search box -->
          <div class="relative w-full sm:w-64">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (keyup.enter)="loadParents()"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="Tìm theo tên, SĐT...">
          </div>

          <button
            (click)="loadParents()"
            class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors hidden sm:block">
            Tìm
          </button>

          <button
            routerLink="/parents/new"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors">
            <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm mới
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và Tên</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nghề nghiệp</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr *ngIf="isLoading()">
              <td colspan="5" class="px-6 py-12 text-center">
                <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </td>
            </tr>
            <tr *ngIf="!isLoading() && parents().length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                Không tìm thấy phụ huynh nào.
              </td>
            </tr>
            <tr *ngFor="let p of parents()" class="hover:bg-blue-50/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{{ p.fullName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ p.phoneNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ p.email || '—' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ p.occupation || '—' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <a [routerLink]="['/parents/edit', p.id]" class="text-orange-500 hover:text-orange-700">Sửa</a>
                <button (click)="deleteParent(p.id)" class="text-red-500 hover:text-red-800">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination (Tương tự Học sinh) -->
      <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <p class="text-sm text-gray-600">
            Tổng số <span class="font-medium">{{ totalCount() }}</span> phụ huynh
          </p>
        </div>
      </div>
    </div>
  `
})
export class ParentListComponent implements OnInit {
  private parentService = inject(ParentService);

  parents = signal<Parent[]>([]);
  totalCount = signal(0);
  isLoading = signal(true);

  currentPage = signal(1);
  pageSize = 10;
  searchTerm = '';

  ngOnInit() {
    this.loadParents();
  }

  loadParents() {
    this.isLoading.set(true);
    this.parentService.getParents(this.currentPage(), this.pageSize, this.searchTerm)
      .subscribe(res => {
        this.parents.set(res.items);
        this.totalCount.set(res.totalCount);
        this.isLoading.set(false);
      });
  }

  deleteParent(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa phụ huynh này? Học sinh liên kết có thể bị ảnh hưởng.')) {
      this.parentService.deleteParent(id).subscribe(() => {
        this.loadParents();
      });
    }
  }
}

