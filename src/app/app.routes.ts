import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LandlordLayoutComponent } from './layouts/landlord-layout/landlord-layout.component';
import { LandlordRoomsComponent } from './landlord/rooms/rooms.component';
import { landlordGuard } from './_helpers/landlord.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      //tam thoi
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
  {
    path: 'landlord',
    component: LandlordLayoutComponent, // Sử dụng Landlord Layout
    canActivate: [landlordGuard],
    children: [
      { path: 'rooms', component: LandlordRoomsComponent },
      // Sau này tạo thêm trang Hợp đồng, Hóa đơn thì bỏ vào đây...

      { path: '', redirectTo: 'rooms', pathMatch: 'full' },
    ],
  },
];
