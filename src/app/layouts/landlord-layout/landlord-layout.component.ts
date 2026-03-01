import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { StorageService } from '../../_services/storage.service';

@Component({
  selector: 'app-landlord-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './landlord-layout.component.html',
})
export class LandlordLayoutComponent {
  isSidebarOpen = false;
  username = 'Chủ nhà';

  constructor(
    private storageService: StorageService,
    private router: Router,
  ) {
    if (this.storageService.isLoggedIn()) {
      this.username = this.storageService.getUser().username;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.storageService.clean();
    this.router.navigate(['/login']);
  }
}
