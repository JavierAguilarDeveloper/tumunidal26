import { Component, inject, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { TmDataService, Match } from '../../core/services/tm-data.service';
import { CountdownComponent } from '../../shared/countdown/countdown.component';

@Component({
  selector: 'app-partidos',
  standalone: true,
  imports: [CountdownComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .hoy-rail{display:flex;gap:16px;overflow-x:auto;padding:6px 2px 18px;scroll-snap-type:x mandatory;scrollbar-width:none;}
    .hoy-rail::-webkit-scrollbar{display:none;}
    .hoy-arrows{display:flex;gap:8px;}
    .hoy-arr{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;cursor:pointer;
      background:var(--glass);border:1px solid var(--glass-brd);color:var(--txt);font-size:16px;transition:background .15s;}
    .hoy-arr:hover{background:rgba(255,255,255,.1);}
    .mc{position:relative;flex:0 0 286px;border-radius:18px;padding:18px;display:flex;flex-direction:column;gap:14px;scroll-snap-align:start;}
    .mc-live{border-color:rgba(0,255,135,.4) !important;box-shadow:0 0 0 1px rgba(0,255,135,.25),0 0 34px -8px rgba(0,255,135,.45),inset 0 1px 0 rgba(255,255,255,.1);}
    .mc-head{display:flex;align-items:center;justify-content:space-between;}
    .mc-grp{font:700 11px/1 var(--ff-mono);letter-spacing:.16em;color:var(--mut);text-transform:uppercase;}
    .mc-ft-badge{font:700 11px/1 var(--ff-mono);letter-spacing:.14em;color:var(--txt-2);text-transform:uppercase;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid var(--glass-brd);}
    .mc-body{display:flex;flex-direction:column;gap:11px;}
    .mc-row{display:flex;align-items:center;gap:12px;transition:opacity .4s;}
    .mc-flag{font-size:26px;line-height:1;width:30px;text-align:center;}
    .mc-name{flex:1;font:700 16px/1.1 var(--ff-sans);color:var(--txt);}
    .mc-score{font:800 24px/1 var(--ff-sans);font-variant-numeric:tabular-nums;color:var(--txt);min-width:22px;text-align:right;}
    .mc-foot{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--glass-brd);padding-top:12px;}
    .mc-min{font:700 12px/1 var(--ff-mono);color:var(--green);letter-spacing:.06em;}
    .mc-cd{display:flex;flex-direction:column;gap:3px;align-items:center;flex:1;}
    .cd-lbl{font:600 9px/1 var(--ff-mono);letter-spacing:.2em;color:var(--mut);text-transform:uppercase;}
    .cd-time{font:700 20px/1 var(--ff-mono);color:var(--txt);font-variant-numeric:tabular-nums;letter-spacing:.04em;}
  `],
  template: `
    <section class="sec" id="partidos">
      <div class="sec-head">
        <div class="sh-l">
          <span class="sh-eye">01</span>
          <h2>{{ data.t()['today'] }}</h2>
          <p>{{ data.t()['today_sub'] }}</p>
        </div>
        <div class="hoy-arrows">
          <div class="hoy-arr" (click)="scroll(-1)">←</div>
          <div class="hoy-arr" (click)="scroll(1)">→</div>
        </div>
      </div>
      <div class="hoy-rail" #rail>
        @for (m of data.matches(); track m.id) {
          <div [class]="'tm-glass mc' + (m.status === 'live' ? ' mc-live' : '')">
            <div class="mc-head">
              <span class="mc-grp">{{ data.t()['group'] }} {{ m.grp }}</span>
              @if (m.status === 'live') {
                <div class="tm-live"><span class="dot"></span>{{ data.t()['live'] }}</div>
              } @else if (m.status === 'upcoming') {
                <div class="tm-next"><span class="dot"></span>{{ data.t()['upcoming'] }}</div>
              } @else {
                <div class="mc-ft-badge">{{ data.t()['ft'] }}</div>
              }
            </div>
            <div class="mc-body">
              <div class="mc-row" [style.opacity]="rowOpacity(m, 'home')">
                <span class="mc-flag">{{ data.TEAMS[m.home].flag }}</span>
                <span class="mc-name">{{ data.TEAMS[m.home][data.lang()] }}</span>
                @if (m.status !== 'upcoming') { <span class="mc-score">{{ m.hs }}</span> }
              </div>
              <div class="mc-row" [style.opacity]="rowOpacity(m, 'away')">
                <span class="mc-flag">{{ data.TEAMS[m.away].flag }}</span>
                <span class="mc-name">{{ data.TEAMS[m.away][data.lang()] }}</span>
                @if (m.status !== 'upcoming') { <span class="mc-score">{{ m.as }}</span> }
              </div>
            </div>
            <div class="mc-foot">
              @if (m.status === 'live') {
                <span class="mc-min">▸ {{ m.min }}' {{ data.t()['inplay'] }}</span>
                <span class="mc-grp" style="color:var(--mut)">Azteca</span>
              } @else if (m.status === 'ft') {
                <span class="mc-grp">{{ data.t()['fulltime'] }}</span>
                <span class="mc-grp" style="color:var(--mut)">Azteca</span>
              } @else {
                <div class="mc-cd">
                  <span class="cd-lbl">{{ data.t()['kicksin'] }}</span>
                  <app-countdown [target]="m.kickoff ?? 0" />
                </div>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class PartidosComponent {
  data = inject(TmDataService);
  @ViewChild('rail') railRef!: ElementRef<HTMLDivElement>;

  scroll(dir: number) {
    this.railRef?.nativeElement.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }

  rowOpacity(m: Match, side: 'home' | 'away'): number {
    if (m.status === 'upcoming' || m.hs === m.as) return 1;
    const win = side === 'home' ? (m.hs ?? 0) > (m.as ?? 0) : (m.as ?? 0) > (m.hs ?? 0);
    return win ? 1 : 0.62;
  }
}
