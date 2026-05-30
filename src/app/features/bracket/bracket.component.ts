import {
  Component, inject, ViewEncapsulation, ElementRef, ViewChild,
  signal, AfterViewInit, OnDestroy, NgZone,
} from '@angular/core';
import { TmDataService } from '../../core/services/tm-data.service';

@Component({
  selector: 'app-bracket',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .bk-scroll{overflow-x:auto;overflow-y:hidden;padding:8px 0 22px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent;}
    .bk-scroll::-webkit-scrollbar{height:8px;}
    .bk-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:99px;}
    .bk-inner{position:relative;display:flex;gap:32px;width:max-content;padding:32px 4px 24px;}
    .bk-svg{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:visible;}
    .bk-col{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:space-around;min-width:194px;}
    .bk-col-head{font:700 11px/1 var(--ff-mono);letter-spacing:.18em;text-transform:uppercase;color:var(--mut);text-align:center;margin-bottom:10px;}
    .bk-matches{display:flex;flex-direction:column;justify-content:space-around;flex:1;}
    .bk-match-wrap{display:flex;align-items:center;}
    .bk-match{background:var(--glass);border:1px solid var(--glass-brd);border-radius:12px;overflow:hidden;backdrop-filter:blur(16px);box-shadow:inset 0 1px 0 rgba(255,255,255,.07);width:100%;}
    .bk-match.tbd{border-style:dashed;border-color:rgba(255,255,255,.12);background:rgba(255,255,255,.018);}
    .bk-slot{display:flex;align-items:center;gap:9px;padding:9px 11px;}
    .bk-slot+.bk-slot{border-top:1px solid var(--glass-brd);}
    .bk-fl{font-size:18px;line-height:1;width:22px;text-align:center;}
    .bk-nm{flex:1;font:700 13px/1.1 var(--ff-sans);color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .bk-pos{font:700 9px/1 var(--ff-mono);letter-spacing:.08em;color:var(--mut);padding:3px 5px;border-radius:5px;background:rgba(255,255,255,.07);white-space:nowrap;}
    .bk-slot.ghost .bk-nm{color:var(--mut);font-weight:600;}
    .bk-slot.ghost .bk-fl{color:rgba(255,255,255,.18);}
    .bk-champ{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:200px;}
    .bk-trophy{display:flex;flex-direction:column;align-items:center;gap:14px;padding:26px 22px;border-radius:18px;
      background:radial-gradient(120% 120% at 50% 0%,rgba(255,215,0,.14),rgba(255,255,255,.03));
      border:1px solid rgba(255,215,0,.32);box-shadow:0 0 50px -16px rgba(255,215,0,.5),inset 0 1px 0 rgba(255,255,255,.12);}
    .bk-trophy .ic{font-size:52px;filter:drop-shadow(0 0 18px rgba(255,215,0,.6));}
    .bk-trophy .lbl{font:700 10px/1 var(--ff-mono);letter-spacing:.22em;text-transform:uppercase;color:var(--gold);}
    .bk-trophy .nm{font:800 17px/1 var(--ff-sans);color:var(--txt);}
    .bk-hint{font:600 11px/1 var(--ff-mono);color:var(--mut);letter-spacing:.04em;margin-top:14px;}
  `],
  template: `
    <section class="sec" id="bracket">
      <div class="sec-head">
        <div class="sh-l">
          <span class="sh-eye">04</span>
          <h2>{{ data.t()['bracket_t'] }}</h2>
          <p>{{ data.t()['bracket_sub'] }}</p>
        </div>
      </div>
      <div class="data-notice">
        <span class="dn-dot"></span>
        {{ data.lang() === 'es'
          ? 'Datos de demostración · Los datos reales se habilitarán el 11 de junio de 2026, al inicio del torneo'
          : 'Demo data · Real data will be available on June 11, 2026, when the tournament begins' }}
      </div>
      <div class="bk-scroll">
        <div class="bk-inner" #inner>
          <svg class="bk-svg" [attr.width]="dims().w || 1" [attr.height]="dims().h || 1"
            [attr.viewBox]="'0 0 ' + (dims().w || 1) + ' ' + (dims().h || 1)"
            fill="none" preserveAspectRatio="none">
            @for (d of svgPaths(); track $index) {
              <path [attr.d]="d" stroke="rgba(255,255,255,.18)" stroke-width="1.5"/>
            }
          </svg>

          @for (round of rounds; track round.key; let ri = $index) {
            <div class="bk-col">
              <div class="bk-col-head">{{ data.t()[round.key] }}</div>
              <div class="bk-matches">
                @for (mt of round.matches; track $index; let mi = $index) {
                  <div class="bk-match-wrap">
                    <div [class]="'bk-match' + (ri > 0 ? ' tbd' : '')" [attr.data-ri]="ri" [attr.data-mi]="mi">
                      @for (slot of mt; track $index) {
                        @if (slot && slot.code) {
                          <div class="bk-slot">
                            <span class="bk-fl">{{ data.TEAMS[slot.code].flag }}</span>
                            <span class="bk-nm">{{ data.TEAMS[slot.code][data.lang()] }}</span>
                            <span class="bk-pos">{{ slot.label }}</span>
                          </div>
                        } @else {
                          <div class="bk-slot ghost">
                            <span class="bk-fl">▢</span>
                            <span class="bk-nm">{{ data.t()['tbd'] }}</span>
                            @if (slot?.label) { <span class="bk-pos">{{ slot!.label }}</span> }
                          </div>
                        }
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <div class="bk-champ">
            <div class="bk-trophy" #trophy>
              <span class="ic">🏆</span>
              <span class="lbl">{{ data.t()['champ'] }}</span>
              <span class="nm">{{ data.t()['tbd'] }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bk-hint">← {{ data.lang() === 'es'
        ? 'Desliza para ver todo el cuadro · equipos provisionales según posición de grupo'
        : 'Scroll to see the full bracket · provisional teams by current group position' }}</div>
    </section>
  `,
})
export class BracketComponent implements AfterViewInit, OnDestroy {
  data = inject(TmDataService);
  private zone = inject(NgZone);

  @ViewChild('inner') innerRef!: ElementRef<HTMLElement>;
  @ViewChild('trophy') trophyRef!: ElementRef<HTMLElement>;

  svgPaths = signal<string[]>([]);
  dims = signal({ w: 0, h: 0 });

  private ro?: ResizeObserver;

  rounds = [
    { key: 'r32',   matches: this.data.R32.map(pair => pair.map(([l, p]) => this.data.slot(l as string, p as number))) },
    { key: 'r16',   matches: Array.from({ length: 8 },  () => [null, null]) },
    { key: 'qf',    matches: Array.from({ length: 4 },  () => [null, null]) },
    { key: 'sf',    matches: Array.from({ length: 2 },  () => [null, null]) },
    { key: 'final', matches: [[null, null]] },
  ];

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.ro = new ResizeObserver(() => this.zone.run(() => this.compute()));
      this.ro.observe(this.innerRef.nativeElement);
      setTimeout(() => this.compute(), 100);
    });
  }

  ngOnDestroy() { this.ro?.disconnect(); }

  private compute() {
    const inner = this.innerRef?.nativeElement;
    if (!inner) return;

    const ir = inner.getBoundingClientRect();
    const center = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { l: r.left - ir.left, r: r.right - ir.left, m: r.top - ir.top + r.height / 2 };
    };

    const cols = Array.from(inner.querySelectorAll('.bk-col'));
    const roundCards: Element[][] = cols.map(col =>
      Array.from(col.querySelectorAll('[data-ri]'))
    );

    const segs: string[] = [];
    for (let ri = 0; ri < roundCards.length - 1; ri++) {
      const cur = roundCards[ri];
      const nxt = roundCards[ri + 1];
      cur.forEach((el, i) => {
        const j = Math.floor(i / 2);
        if (!nxt[j]) return;
        const a = center(el);
        const b = center(nxt[j]);
        const midx = (a.r + b.l) / 2;
        segs.push(`M ${a.r} ${a.m} H ${midx} V ${b.m} H ${b.l}`);
      });
    }

    const trophy = this.trophyRef?.nativeElement;
    const lastCards = roundCards[roundCards.length - 1];
    if (lastCards?.[0] && trophy) {
      const a = center(lastCards[0]);
      const b = center(trophy);
      const midx = (a.r + b.l) / 2;
      segs.push(`M ${a.r} ${a.m} H ${midx} V ${b.m} H ${b.l}`);
    }

    this.svgPaths.set(segs);
    this.dims.set({ w: inner.scrollWidth, h: inner.offsetHeight });
  }
}
