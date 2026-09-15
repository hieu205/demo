import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentService } from '../../core/services/parent.service';

@Component({
  selector: 'app-parent-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl mx-auto">
      <div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">
          {{ isEditMode() ? 'Cập nhật Phụ huynh' : 'Thêm mới Phụ huynh' }}
        </h2>
        <button (click)="goBack()" class="text-gray-500 hover:text-gray-700">
          Trở lại
        </button>
      </div>

      <div class="p-6">
        <form [formGroup]="parentForm" (ngSubmit)="onSubmit()">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Họ Tên -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Họ và Tên <span class="text-red-500">*</span></label>
              <input type="text" formControlName="fullName"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                [ngClass]="{'border-red-500': submitted() && f['fullName'].errors}">
              <p *ngIf="submitted() && f['fullName'].errors?.['required']" class="text-red-500 text-xs mt-1">Họ tên là bắt buộc</p>
            </div>

            <!-- SĐT -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại <span class="text-red-500">*</span></label>
              <input type="text" formControlName="phoneNumber"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                [ngClass]="{'border-red-500': submitted() && f['phoneNumber'].errors}">
              <p *ngIf="submitted() && f['phoneNumber'].errors?.['required']" class="text-red-500 text-xs mt-1">Số điện thoại là bắt buộc</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" formControlName="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>

            <!-- Nghề nghiệp -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nghề nghiệp</label>
              <input type="text" formControlName="occupation"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>

            <!-- Vai trò / Quan hệ -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Vai trò / Quan hệ</label>
              <select formControlName="relationship"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="">Chọn mối quan hệ...</option>
                <option value="Bố">Bố</option>
                <option value="Mẹ">Mẹ</option>
                <option value="Ông">Ông</option>
                <option value="Bà">Bà</option>
                <option value="Người giám hộ">Người giám hộ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <!-- Địa chỉ -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
              <textarea formControlName="address" rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <button type="button" (click)="goBack()"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              Hủy
            </button>
            <button type="submit" [disabled]="isLoading()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center">
              <svg *ngIf="isLoading()" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isEditMode() ? 'Cập nhật' : 'Lưu lại' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ParentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private parentService = inject(ParentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  isEditMode = signal(false);
  isLoading = signal(false);
  submitted = signal(false);
  currentId: number | null = null;

  parentForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    email: [''],
    occupation: [''],
    address: [''],
    relationship: ['']
  });

  get f() { return this.parentForm.controls; }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode.set(true);
        this.currentId = +id;
        this.loadParent(this.currentId);
      }
    });
  }

  loadParent(id: number) {
    this.isLoading.set(true);
    this.parentService.getParentById(id).subscribe({
      next: (parent) => {
        this.parentForm.patchValue(parent);
        this.isLoading.set(false);
      },
      error: () => {
        alert('Không tìm thấy phụ huynh');
        this.goBack();
      }
    });
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.parentForm.invalid) return;

    this.isLoading.set(true);
    const data = this.parentForm.value;

    if (this.isEditMode() && this.currentId) {
      this.parentService.updateParent(this.currentId, data).subscribe({
        next: () => this.router.navigate(['/parents']),
        error: (err) => { this.isLoading.set(false); alert(err.message || 'Lỗi cập nhật'); }
      });
    } else {
      this.parentService.createParent(data).subscribe({
        next: () => this.router.navigate(['/parents']),
        error: (err) => { this.isLoading.set(false); alert(err.message || 'Lỗi thêm mới'); }
      });
    }
  }

  goBack() {
    this.location.back();
  }
}

