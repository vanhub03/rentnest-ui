import { Directive, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  // Điểm ăn tiền ở đây: Tự động bắt tất cả các thẻ có chứa class "reveal", "reveal-left" hoặc "reveal-right"
  selector: '.reveal, .reveal-left, .reveal-right',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    // Sử dụng IntersectionObserver để theo dõi khi nào phần tử xuất hiện trên màn hình
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Nếu phần tử bắt đầu đi vào khung hình (viewport)
          if (entry.isIntersecting) {
            // Thêm class 'active' vào phần tử đó
            this.renderer.addClass(this.el.nativeElement, 'active');

            // (Tùy chọn) Ngừng theo dõi sau khi đã hiện lên để tối ưu hiệu suất
            this.observer.unobserve(this.el.nativeElement);
          }
        });
      },
      {
        threshold: 0.1, // Kích hoạt khi phần tử lộ diện được 10%
      },
    );

    // Bắt đầu theo dõi phần tử này
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    // Dọn dẹp bộ nhớ khi chuyển sang trang khác
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
