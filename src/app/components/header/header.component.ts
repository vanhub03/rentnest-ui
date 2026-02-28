import { StorageService } from './../../_services/storage.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isMenuOpen = false;
  username = '';
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.username = user.username;
    }
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        this.storageService.clean();
        window.location.href = '/login';
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
