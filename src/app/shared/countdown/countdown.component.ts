import { Component, Input, OnInit, OnDestroy, signal, computed, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-countdown',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<span class="cd-time">{{ display() }}</span>`,
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() target = 0;
  private ms = signal(0);
  private interval?: ReturnType<typeof setInterval>;

  display = computed(() => {
    const s = Math.max(0, Math.floor(this.ms() / 1000));
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  });

  ngOnInit() {
    this.ms.set(this.target - Date.now());
    this.interval = setInterval(() => this.ms.set(this.target - Date.now()), 1000);
  }

  ngOnDestroy() { clearInterval(this.interval); }
}
