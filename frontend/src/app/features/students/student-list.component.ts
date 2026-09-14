import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../core/services/student.service';
import { Student } from '../../core/models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Header & Search -->
      <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Danh sách Học sinh</h2>
          <p class="text-sm text-gray-500 mt-1">Quản lý thông tin học sinh toàn trường</p>
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
              placeholder="Tìm theo tên, mã...">
          </div>

          <button
            routerLink="/students/new"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center transition-all shadow-sm hover:shadow-md">
            <svg class="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm học sinh
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-gray-50 to-white">
            <tr>
              <!-- Sortable Headers -->
              <th scope="col" (click)="toggleSort('studentCode')" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors group select-none">
                <div class="flex items-center gap-1">
                  Mã HS
                  <svg *ngIf="sortColumn() !== 'studentCode'" class="w-4 h-4 text-gray-300 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                  <svg *ngIf="sortColumn() === 'studentCode' && sortDirection() === 'asc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                  <svg *ngIf="sortColumn() === 'studentCode' && sortDirection() === 'desc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </th>
              <th scope="col" (click)="toggleSort('fullName')" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors group select-none">
                <div class="flex items-center gap-1">
                  Họ và Tên
                  <svg *ngIf="sortColumn() !== 'fullName'" class="w-4 h-4 text-gray-300 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                  <svg *ngIf="sortColumn() === 'fullName' && sortDirection() === 'asc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                  <svg *ngIf="sortColumn() === 'fullName' && sortDirection() === 'desc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </th>
              <th scope="col" (click)="toggleSort('className')" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors group select-none">
                <div class="flex items-center gap-1">
                  Lớp
                  <svg *ngIf="sortColumn() !== 'className'" class="w-4 h-4 text-gray-300 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                  <svg *ngIf="sortColumn() === 'className' && sortDirection() === 'asc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                  <svg *ngIf="sortColumn() === 'className' && sortDirection() === 'desc'" class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày sinh</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Giới tính</th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr *ngIf="isLoading()">
              <td colspan="6" class="px-6 py-12 text-center">
                <svg class="animate-spin h-8 w-8 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-3 text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
              </td>
            </tr>
            <tr *ngIf="!isLoading() && students().length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <div class="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p class="font-medium text-gray-600">Không tìm thấy học sinh nào.</p>
              </td>
            </tr>
            <tr *ngFor="let student of students()" class="hover:bg-blue-50/60 transition-all duration-300 group">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{{ student.studentCode }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shadow-sm">{{ student.fullName.charAt(0) }}</div>
                {{ student.fullName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {{ student.className }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{{ student.dateOfBirth | date:'dd/MM/yyyy' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <span [ngClass]="student.gender === 'Male' ? 'text-indigo-600 bg-indigo-50' : 'text-pink-600 bg-pink-50'" class="px-2.5 py-1 rounded-md text-xs font-semibold">
                  {{ student.gender === 'Male' ? 'Nam' : 'Nữ' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium action-dropdown-container relative">
                <button (click)="toggleDropdown(student.id, $event)" class="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                </button>

                <div *ngIf="activeDropdown() === student.id" class="absolute right-8 top-10 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in-up overflow-hidden">
                  <div class="py-1">
                    <a [routerLink]="['/students/detail', student.id]" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center transition-colors cursor-pointer">
                      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Chi tiết
                    </a>
                    <a [routerLink]="['/students/edit', student.id]" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 flex items-center transition-colors cursor-pointer">
                      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Sửa
                    </a>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button (click)="deleteStudent(student.id)" class="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors">
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

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-600">
              Hiển thị <span class="font-medium">{{ students().length }}</span> trên tổng số <span class="font-medium">{{ totalCount() }}</span> học sinh
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                [disabled]="currentPage() === 1"
                (click)="changePage(currentPage() - 1)"
                class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Trước
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                {{ currentPage() }}
              </button>
              <button
                [disabled]="students().length < pageSize"
                (click)="changePage(currentPage() + 1)"
                class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Sau
              </button>
            </nav>
          </div>
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
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);

  students = signal<Student[]>([]);
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
    this.loadStudents();
  }

  onSearchChange() {
    this.currentPage.set(1);
    this.loadStudents();
  }

  toggleSort(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.loadStudents();
  }

  toggleDropdown(id: number, event: Event) {
    event.stopPropagation();
    if (this.activeDropdown() === id) {
      this.activeDropdown.set(null);
    } else {
      this.activeDropdown.set(id);
    }
  }

  loadStudents() {
    this.isLoading.set(true);
    this.studentService.getStudents(this.currentPage(), this.pageSize, this.searchTerm, this.sortColumn(), this.sortDirection())
      .subscribe(res => {
        this.students.set(res.items);
        this.totalCount.set(res.totalCount);
        this.isLoading.set(false);
      });
  }

  changePage(page: number) {
    if (page >= 1) {
      this.currentPage.set(page);
      this.loadStudents();
    }
  }

  deleteStudent(id: number) {
    this.activeDropdown.set(null);
    if (confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      this.studentService.deleteStudent(id).subscribe(() => {
        this.loadStudents();
      });
    }
  }
}

