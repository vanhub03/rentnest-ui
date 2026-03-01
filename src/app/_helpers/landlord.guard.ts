import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';

export const landlordGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  // 1. Kiểm tra xem đã đăng nhập chưa
  if (!storageService.isLoggedIn()) {
    // Chưa đăng nhập thì đá về trang Login, kèm theo URL họ đang muốn vào để lát đăng nhập xong chuyển lại
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // 2. Lấy thông tin user hiện tại
  const user = storageService.getUser();

  // 3. Kiểm tra xem trong mảng quyền (roles) có quyền ROLE_LANDLORD không
  if (user.roles && user.roles.includes('LANDLORD')) {
    return true; // Cho phép đi tiếp vào trang Landlord
  }

  // 4. Nếu đã đăng nhập nhưng KHÔNG CÓ quyền Landlord (VD: là Khách thuê)
  // Đá về trang chủ hoặc trang báo lỗi 403
  alert('Bạn không có quyền truy cập vào khu vực của Chủ nhà!');
  router.navigate(['/']);
  return false;
};
