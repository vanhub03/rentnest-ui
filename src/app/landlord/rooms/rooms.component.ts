import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { RoomService } from '../../_services/room.service';

@Component({
  selector: 'app-landlord-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class LandlordRoomsComponent implements OnInit {
  rooms: any[] = [];

  // Các biến phục vụ Phân trang
  totalElements = 0;
  totalPages = 0;

  // Object chứa dữ liệu Bộ lọc
  filter = {
    keyword: '',
    status: '',
    hostelId: '',
    page: 0,
    size: 10,
  };

  // Các biến phục vụ Modal Thêm/Sửa phòng
  isModalOpen = false;
  newRoom: any = {
    hostelId: '',
    roomName: '',
    roomType: 'STUDIO',
    price: null,
    area: null,
    description: '',
  };

  constructor() {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    // ------------------------------------------------------------------
    // MOCK DATA (Dữ liệu giả để test UI - Thay bằng API thật sau)
    // ------------------------------------------------------------------
    this.rooms = [
      {
        id: 1,
        hostelName: 'Cơ sở Xuân Thủy',
        roomName: 'P.101',
        roomType: 'Studio',
        price: 4500000,
        area: 30,
        status: 'RENTED',
      },
      {
        id: 2,
        hostelName: 'Cơ sở Xuân Thủy',
        roomName: 'P.102',
        roomType: 'Studio Có Ban Công',
        price: 5000000,
        area: 35,
        status: 'AVAILABLE',
      },
      {
        id: 3,
        hostelName: 'Cơ sở Cầu Giấy',
        roomName: 'Phòng 201',
        roomType: 'Căn Hộ 1PN',
        price: 6500000,
        area: 45,
        status: 'SOON_AVAILABLE',
      },
      {
        id: 4,
        hostelName: 'Cơ sở Đống Đa',
        roomName: 'P.301',
        roomType: 'Phòng Trọ',
        price: 2500000,
        area: 15,
        status: 'MAINTENANCE',
      },
    ];
    this.totalElements = 4;
    this.totalPages = 1;
  }

  onFilterChange() {
    this.filter.page = 0;
    this.loadRooms();
  }

  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.filter.page = newPage;
      this.loadRooms();
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.newRoom = {
      hostelId: '',
      roomName: '',
      roomType: 'STUDIO',
      price: null,
      area: null,
      description: '',
    };
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmitRoom() {
    console.log('Dữ liệu gửi lên Backend:', this.newRoom);

    // Thêm tạm vào giao diện
    this.rooms.unshift({
      id: Date.now(),
      hostelName: this.newRoom.hostelId === '1' ? 'Cơ sở Xuân Thủy' : 'Cơ sở mới',
      roomName: this.newRoom.roomName,
      roomType: this.newRoom.roomType,
      price: this.newRoom.price,
      area: this.newRoom.area,
      status: 'AVAILABLE',
    });

    this.closeModal();
  }
}
