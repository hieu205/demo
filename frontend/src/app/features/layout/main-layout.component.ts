import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Top Navigation -->
      <header class="bg-blue-600 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex-shrink-0 flex items-center font-bold text-xl gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Student Admin
            </div>
            <div class="flex items-center gap-4">
              <a routerLink="/profile" class="text-sm font-medium hover:text-gray-200 hidden sm:flex items-center gap-2 cursor-pointer transition-colors px-3 py-2 rounded-md hover:bg-blue-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Xin chào, {{ currentUser?.fullName || 'Admin' }}!
              </a>
              <button
                (click)="onLogout()"
                class="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm font-medium transition-colors border border-blue-500">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="flex-1 flex max-w-7xl mx-auto w-full">
        <!-- Sidebar -->
        <aside class="w-64 bg-white shadow-sm border-r border-gray-200 hidden md:block">
          <nav class="mt-5 px-2 space-y-1">
            <!-- Dashboard Menu -->
            <a routerLink="/" routerLinkActive="bg-blue-50 text-blue-700" [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
               </svg>
               Dashboard
            </a>

            <!-- Students Menu -->
            <a routerLink="/students" routerLinkActive="bg-blue-50 text-blue-700"
               class="text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50 mt-1 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
               Học sinh
            </a>

            <!-- Parents Menu -->
            <a routerLink="/parents" routerLinkActive="bg-blue-50 text-blue-700"
               class="text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-50 mt-1 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
               Phụ huynh
            </a>
          </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 p-6">
          <!-- Các trang con (Dashboard, Students...) sẽ hiển thị ở đây -->
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.getCurrentUser();

  onLogout() {
    this.authService.logout();
  }
}
