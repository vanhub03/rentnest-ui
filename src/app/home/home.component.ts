import { Component, OnInit } from '@angular/core';
import { RoomService } from '../_services/room.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomCardComponent } from '../components/ui/room-card/room-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink, RoomCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  latestRooms: any[] = [];
  searchForm: any = {
    district: '',
    price: '',
  };
  constructor(
    private roomService: RoomService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.fetchLatestRoom();
  }

  fetchLatestRoom(): void {
    this.roomService.getLatestRooms().subscribe({
      next: (data) => {
        this.latestRooms = data;
      },
      error: (err) => console.error(err),
    });
  }

  onSearch(): void {
    this.router.navigate(['/rooms'], { queryParams: this.searchForm });
  }
}
