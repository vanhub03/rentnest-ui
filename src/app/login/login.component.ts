import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Nhớ có RouterLink
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // Em nhớ copy CSS của trang login vào file SCSS này nhé
})
export class LoginComponent {
  form: any = {
    username: '',
    password: '',
    rememberMe: false,
  };

  // Biến cờ để kiểm soát việc ẩn/hiện mật khẩu
  showPassword = false;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  // Hàm chuyển đổi trạng thái ẩn/hiện mật khẩu (Thay cho JS thuần)
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // 1. Validate sơ bộ (Nếu HTML chưa chặn)
    if (!this.form.username || !this.form.password) {
      this.toastr.warning('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!', 'Lỗi');
      return;
    }

    // 2. Gọi API Đăng nhập
    this.authService.login(this.form.username, this.form.password).subscribe({
      next: (data: any) => {
        // Cất Token và User Info vào két sắt (sessionStorage)
        this.storageService.saveToken(data.token);
        this.storageService.saveUser(data);

        this.toastr.success(`Xin chào ${data.username}`, 'Đăng nhập thành công!');

        // 3. Chuyển hướng dựa trên Role (Mô phỏng như ý định trong JS cũ của em)
        if (data.roles && data.roles.includes('ADMIN')) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/home']); // Về trang chủ
        }
      },
      error: (err) => {
        let errorMsg = err.error?.message || 'Tài khoản hoặc mật khẩu không chính xác!';
        this.toastr.error(errorMsg, 'Đăng nhập thất bại');
      },
    });
  }
}
