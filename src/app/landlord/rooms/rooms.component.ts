import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../_services/room.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-landlord-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class LandlordRoomsComponent implements OnInit {
  private readonly maxImagesPerUpload = 5;

  rooms: any[] = [];
  totalElements = 0;
  totalPages = 0;

  filter = {
    keyword: '',
    status: '',
    hostelId: '',
    page: 0,
    size: 10,
  };

  // --- TRẠNG THÁI MODAL ---
  isRoomModalOpen = false;
  isHostelModalOpen = false;

  // --- MODEL DỮ LIỆU ---
  newHostel: any = {
    name: '',
    cityCode: '',
    districtCode: '',
    wardCode: '',
    addressDetail: '',
    description: '',
  };

  newRoom: any = {
    hostelId: '',
    roomName: '',
    basePrice: null,
    area: null,
    floor: null,
    bathCount: null,
    bedType: 'Không có giường',
    status: 'AVAILABLE',
  };

  constructor(
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadRooms();
    this.loadProvinces();
  }
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  isDistrictLoading = false;
  isWardLoading = false;
  loadProvinces() {
    this.http.get('https://provinces.open-api.vn/api/p/').subscribe((res: any) => {
      this.provinces = res;
    });
  }
  // Khi người dùng chọn Tỉnh/TP
  onProvinceChange() {
    // Reset lại Quận và Phường
    this.newHostel.districtCode = '';
    this.newHostel.wardCode = '';
    this.districts = [];
    this.wards = [];
    this.isDistrictLoading = false;
    this.isWardLoading = false;

    if (this.newHostel.cityCode) {
      // Lưu lại cái "Tên" Tỉnh (Để gửi xuống BE)
      const selectedProv = this.provinces.find((p) => p.code == this.newHostel.cityCode);
      if (selectedProv) this.newHostel.city = selectedProv.name;

      // Gọi API lấy Quận/Huyện theo Mã Tỉnh
      this.isDistrictLoading = true;
      this.http
        .get(`https://provinces.open-api.vn/api/p/${this.newHostel.cityCode}?depth=2`)
        .subscribe(
          (res: any) => {
            this.districts = res.districts;
            this.isDistrictLoading = false;
            this.cdr.detectChanges();
          },
          () => {
            this.isDistrictLoading = false;
            this.cdr.detectChanges();
          },
        );
    }
  }

  // Khi người dùng chọn Quận/Huyện
  onDistrictChange() {
    // Reset lại Phường
    this.newHostel.wardCode = '';
    this.wards = [];
    this.isWardLoading = false;

    if (this.newHostel.districtCode) {
      // Lưu lại cái "Tên" Quận
      const selectedDist = this.districts.find((d) => d.code == this.newHostel.districtCode);
      if (selectedDist) this.newHostel.district = selectedDist.name;

      // Gọi API lấy Phường/Xã theo Mã Quận
      this.isWardLoading = true;
      this.http
        .get(`https://provinces.open-api.vn/api/d/${this.newHostel.districtCode}?depth=2`)
        .subscribe(
          (res: any) => {
            this.wards = res.wards;
            this.isWardLoading = false;
            this.cdr.detectChanges();
          },
          () => {
            this.isWardLoading = false;
            this.cdr.detectChanges();
          },
        );
    }
  }

  // Khi người dùng chọn Phường/Xã
  onWardChange() {
    if (this.newHostel.wardCode) {
      // Lưu lại cái "Tên" Phường
      const selectedWard = this.wards.find((w) => w.code == this.newHostel.wardCode);
      if (selectedWard) this.newHostel.ward = selectedWard.name;
    }
  }
  loadRooms() {
    let queryParams: any = {
      page: this.filter.page,
      size: this.filter.size,
    };

    if (this.filter.keyword) queryParams.keyword = this.filter.keyword;
    if (this.filter.status) queryParams.status = this.filter.status;
    if (this.filter.hostelId) queryParams.hostelId = this.filter.hostelId;

    this.roomService.getLandlordRooms(queryParams).subscribe({
      next: (res: any) => {
        this.rooms = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách phòng:', err);
      },
    });
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

  // --- ĐIỀU KHIỂN MODAL TÒA NHÀ ---
  openHostelModal() {
    this.isHostelModalOpen = true;
    this.newHostel = {
      name: '',
      cityCode: '',
      districtCode: '',
      wardCode: '',
      addressDetail: '',
      description: '',
    };
  }
  // --- ĐIỀU KHIỂN MODAL PHÒNG ---
  openRoomModal() {
    this.isRoomModalOpen = true;
    this.newRoom = {
      hostelId: '',
      roomName: '',
      basePrice: null,
      area: null,
      floor: null,
      bathCount: null,
      bedType: 'Không có giường',
      status: 'AVAILABLE',
    };
  }

  onHostelOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeHostelModal();
    }
  }

  onRoomOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeRoomModal();
    }
  }

  closeRoomModal() {
    this.isRoomModalOpen = false;
    this.roomSelectedFiles = [];
    this.roomImagePreviews = [];
  }

  onSubmitRoom() {
    console.log('Dữ liệu tạo Phòng mới gửi lên BE:', this.newRoom);
    // TODO: Gọi API tạo Phòng ở đây
    this.closeRoomModal();
  }

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  roomSelectedFiles: File[] = [];
  roomImagePreviews: string[] = [];

  private appendFiles(files: File[], targetFiles: File[], targetPreviews: string[]): void {
    const availableSlots = this.maxImagesPerUpload - targetFiles.length;

    if (availableSlots <= 0) {
      alert(`Chỉ được tải tối đa ${this.maxImagesPerUpload} ảnh.`);
      return;
    }

    const acceptedFiles = files.slice(0, availableSlots);

    if (acceptedFiles.length < files.length) {
      alert(`Chỉ được tải tối đa ${this.maxImagesPerUpload} ảnh.`);
    }

    for (const file of acceptedFiles) {
      targetFiles.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          targetPreviews.push(reader.result);
          this.cdr.detectChanges();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    const availableSlots = this.maxImagesPerUpload - this.selectedFiles.length;

    if (availableSlots <= 0) {
      alert(`Chỉ được tải tối đa ${this.maxImagesPerUpload} ảnh.`);
      input.value = '';
      return;
    }

    if (files.length) {
      const acceptedFiles = files.slice(0, availableSlots);

      if (acceptedFiles.length < files.length) {
        alert(`Chỉ được tải tối đa ${this.maxImagesPerUpload} ảnh.`);
      }

      for (const file of acceptedFiles) {
        this.selectedFiles.push(file);

        // Đọc file để hiển thị preview
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            this.imagePreviews.push(reader.result);
            this.cdr.detectChanges();
          }
        };
        reader.readAsDataURL(file);
      }
    }

    input.value = '';
  }
  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  onRoomFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (files.length) {
      this.appendFiles(files, this.roomSelectedFiles, this.roomImagePreviews);
    }

    input.value = '';
  }

  removeRoomImage(index: number) {
    this.roomSelectedFiles.splice(index, 1);
    this.roomImagePreviews.splice(index, 1);
  }

  closeHostelModal() {
    this.isHostelModalOpen = false;
    this.selectedFiles = [];
    this.imagePreviews = [];
  }
  // @ViewChild('hostelFileInput') hostelFileInput!: ElementRef<HTMLInputElement>;
  // @ViewChild('roomFileInput') roomFileInput!: ElementRef<HTMLInputElement>;

  // openHostelFileInput(event: Event): void {
  //   // 1. Cực kỳ quan trọng: Chặn đứng sự kiện, không cho Modal/Form bên ngoài biết em vừa click!
  //   event.stopPropagation();
  //   event.preventDefault();

  //   // 2. Kích hoạt nút bấm an toàn
  //   this.hostelFileInput.nativeElement.click();
  // }

  // openRoomFileInput(event: Event): void {
  //   event.stopPropagation();
  //   event.preventDefault();
  //   this.roomFileInput.nativeElement.click();
  // }
  onSubmitHostel() {
    if (this.selectedFiles.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ảnh cho tòa nhà!');
      return;
    }

    // 1. Gói dữ liệu vào FormData
    const formData = new FormData();
    // Đưa cục newHostel thành chuỗi JSON và gắn vào key 'hostel' (Khớp với @RequestParam("hostel"))
    formData.append('hostel', JSON.stringify(this.newHostel));

    // Đưa danh sách file ảnh vào key 'images' (Khớp với @RequestPart("images"))
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('images', this.selectedFiles[i]);
    }

    // 2. Gọi API
    this.roomService.createHostel(formData).subscribe({
      next: (res) => {
        this.toastr.success('Thêm Tòa nhà thành công!');
        this.closeHostelModal();
        // Cập nhật lại danh sách nếu cần...
      },
      error: (err) => {
        console.error('Lỗi:', err);
        this.toastr.error('Có lỗi xảy ra khi thêm Tòa nhà.');
      },
    });
  }
}
