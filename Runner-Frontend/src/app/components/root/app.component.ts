import { Component, inject, OnInit } from "@angular/core";
import { RunningService } from "../../services/running.service";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({               
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-medium text-gray-900">RunTracker</h1>
            </div>
            <nav class="flex gap-1">
              <a routerLink="/" routerLinkActive="bg-blue-50 text-blue-600"
                 [routerLinkActiveOptions]="{ exact: true }"
                 class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-gray-600 hover:bg-gray-100">
                Dashboard
              </a>
              <a routerLink="/runs" routerLinkActive="bg-blue-50 text-blue-600"
                 class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-gray-600 hover:bg-gray-100">
                Run Log
              </a>
              <a routerLink="/shoes" routerLinkActive="bg-blue-50 text-blue-600"
                 class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-gray-600 hover:bg-gray-100">
                Shoes
              </a>
              <a routerLink="/stats" routerLinkActive="bg-blue-50 text-blue-600"
                 class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-gray-600 hover:bg-gray-100">
                Stats
              </a>
              @if (auth.isLoggedIn()) {
                <button (click)="auth.logout()"
                  class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  <span class="hidden sm:inline">Logout</span>
                </button>
              }
            </nav>
          </div>
        </div>
      </header>

      <!-- This is where all your pages render -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})

export class AppComponent implements OnInit {
  svc = inject(RunningService);
  auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.checkSession();
  }
}