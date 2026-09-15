import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
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
              (ngModelChange)="onSearchChange()"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              placeholder="Tìm theo tên, SĐT...">
          </div>

          <button
            routerLink="/parents/new"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center transition-all shadow-sm hover:shadow-md">
            <svg class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm phụ huynh
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-gray-50 to-white">
            <tr>
              <th scope="col" (click)="toggleSort('fullName')" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors group select-none">
                <div class="flex items-center gap-1">
                  Họ và Tên
                  <svg *ngIf="sortColumn() !== 'fullName'" class="w-4 h-4 text-gray-300 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                  <svg *ngIf="sortColumn() === 'fullName' && sortDirection() === 'asc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                  <svg *ngIf="sortColumn() === 'fullName' && sortDirection() === 'desc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </th>
              <th scope="col" (click)="toggleSort('phoneNumber')" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors group select-none">
                <div class="flex items-center gap-1">
                  Số điện thoại
                  <svg *ngIf="sortColumn() !== 'phoneNumber'" class="w-4 h-4 text-gray-300 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                  <svg *ngIf="sortColumn() === 'phoneNumber' && sortDirection() === 'asc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                  <svg *ngIf="sortColumn() === 'phoneNumber' && sortDirection() === 'desc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" (click)="toggleSort('occupation')" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors group select-none">
                <div class="flex items-center gap-1">
                  Nghề nghiệp
                  <svg *ngIf="sortColumn() !== 'occupation'" class="w-4 h-4 text-gray-300 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                  <svg *ngIf="sortColumn() === 'occupation' && sortDirection() === 'asc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                  <svg *ngIf="sortColumn() === 'occupation' && sortDirection() === 'desc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr *ngIf="isLoading()">
              <td colspan="7" class="px-6 py-12 text-center">
                <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-3 text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
              </td>
            </tr>
            <tr *ngIf="!isLoading() && parents().length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                <div class="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p class="font-medium text-gray-600">Không tìm thấy phụ huynh nào.</p>
              </td>
            </tr>
            <tr *ngFor="let p of parents()" class="hover:bg-blue-50/60 transition-all duration-300 group">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-green-100 to-green-200 text-green-700 flex items-center justify-center font-bold text-xs shadow-sm">{{ p.fullName.charAt(0) }}</div>
                {{ p.fullName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{{ p.phoneNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ p.email || '—' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span *ngIf="p.occupation" class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  {{ p.occupation }}
                </span>
                <span *ngIf="!p.occupation">—</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                <span *ngIf="p.relationship" class="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">{{ p.relationship }}</span>
                <span *ngIf="!p.relationship" class="text-gray-400">—</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[150px] truncate" [title]="p.address || ''">
                {{ p.address || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium action-dropdown-container relative">
                <button (click)="toggleDropdown(p.id, $event)" class="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                </button>

                <div *ngIf="activeDropdown() === p.id" class="absolute right-8 top-10 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in-up overflow-hidden">
                  <div class="py-1">
                    <a [routerLink]="['/parents/edit', p.id]" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 flex items-center transition-colors cursor-pointer">
                      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Sửa
                    </a>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button (click)="deleteParent(p.id)" class="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors">
                      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Xóa
                    </button>
                  </div>
                </div>
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

      <style>
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
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

  // Sorting
  sortColumn = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Dropdown
  activeDropdown = signal<number | null>(null);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-dropdown-container')) {
      this.activeDropdown.set(null);
    }
  }

  ngOnInit() {
    this.loadParents();
  }

  onSearchChange() {
    this.currentPage.set(1);
    this.loadParents();
  }

  toggleSort(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.loadParents();
  }

  toggleDropdown(id: number, event: Event) {
    event.stopPropagation();
    if (this.activeDropdown() === id) {
      this.activeDropdown.set(null);
    } else {
      this.activeDropdown.set(id);
    }
  }

  loadParents() {
    this.isLoading.set(true);
    this.parentService.getParents(this.currentPage(), this.pageSize, this.searchTerm, this.sortColumn(), this.sortDirection())
      .subscribe(res => {
        this.parents.set(res.items);
        this.totalCount.set(res.totalCount);
        this.isLoading.set(false);
      });
  }

  deleteParent(id: number) {
    this.activeDropdown.set(null);
    if (confirm('Bạn có chắc chắn muốn xóa phụ huynh này? Học sinh liên kết có thể bị ảnh hưởng.')) {
      this.parentService.deleteParent(id).subscribe(() => {
        this.loadParents();
      });
    }
  }
}

