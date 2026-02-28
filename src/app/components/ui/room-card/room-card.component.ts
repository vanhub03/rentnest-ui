import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Nhớ import RouterLink để bấm vào tiêu đề chuyển trang

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss'],
})
export class RoomCardComponent {
  // @Input() giúp component này nhận một cục object tên là 'room' từ bên ngoài truyền vào
  @Input() room: any;
}
