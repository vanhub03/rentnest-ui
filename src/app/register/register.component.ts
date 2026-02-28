import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Thêm RouterLink để HTML hiểu thẻ a
import { AuthService } from '../_services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Nhớ có RouterLink ở đây
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'], // Nhớ nhúng CSS gốc của em vào file SCSS này nhé
})
export class RegisterComponent {
  // Khai báo sẵn các trường dữ liệu để hứng từ giao diện
  form: any = {
    username: '',
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '', // Thêm trường này để so sánh
    role: 'TENANT', // Mặc định chọn người tìm phòng
    agreeTerms: false, // Biến cờ đánh dấu đã check điều khoản chưa
  };

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  // Thay thế cho đoạn script JS cũ của em
  setRole(selectedRole: string): void {
    this.form.role = selectedRole;
  }

  onSubmit(): void {
    // 1. Kiểm tra xác nhận mật khẩu
    if (this.form.password !== this.form.confirmPassword) {
      this.toastr.error('Mật khẩu xác nhận không khớp!', 'Lỗi');
      return;
    }

    // 2. Kiểm tra ô Checkbox điều khoản (Nếu HTML required chưa kịp chặn)
    if (!this.form.agreeTerms) {
      this.toastr.warning('Vui lòng đồng ý với các điều khoản của RentNest', 'Chưa hoàn tất');
      return;
    }

    // 3. Chuẩn bị cục dữ liệu gửi lên (Loại bỏ confirmPassword và agreeTerms vì Backend không cần)
    const { confirmPassword, agreeTerms, ...dataToBackend } = this.form;

    // 4. Gửi lên Backend
    this.authService.register(dataToBackend).subscribe({
      next: () => {
        this.toastr.success('Bạn đã đăng ký tài khoản thành công!', 'Tuyệt vời');
        this.router.navigate(['/login']); // Tự động lái xe sang trang Đăng nhập
      },
      error: (err) => {
        // Lấy Message từ JSON Backend trả về, như hôm trước thầy trò mình đã cấu hình
        let errorMsg =
          err.error?.message ||
          (typeof err.error === 'string' ? err.error : 'Hệ thống đang bận, vui lòng thử lại.');
        this.toastr.error(errorMsg, 'Đăng ký thất bại');
      },
    });
  }
}
