import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TmDataService } from '../../core/services/tm-data.service';

@Component({
  selector: 'app-fans-preview',
  standalone: true,
  imports: [RouterLink],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .fnp-board{display:flex;flex-direction:column;gap:10px;}
    .fnp-row{display:flex;align-items:center;gap:16px;padding:15px 20px;border-radius:16px;
      background:var(--glass);border:1px solid var(--glass-brd);backdrop-filter:blur(18px);
      transition:transform .15s,background .15s;}
    .fnp-row:hover{transform:translateX(4px);background:var(--glass-2);}
    .fnp-row.inactive{opacity:.38;}
    .fnp-pos{min-width:40px;font:800 20px/1 var(--ff-sans);text-align:center;flex:0 0 auto;}
    .fnp-row:not(.inactive).rank-1 .fnp-pos{filter:drop-shadow(0 0 8px #ffd700);}
    .fnp-row:not(.inactive).rank-2 .fnp-pos{filter:drop-shadow(0 0 6px #c0c0c0);}
    .fnp-row:not(.inactive).rank-3 .fnp-pos{filter:drop-shadow(0 0 6px #cd7f32);}
    .fnp-info{flex:1;display:flex;flex-direction:column;gap:3px;min-width:0;}
    .fnp-name{font:700 15px/1.1 var(--ff-sans);color:var(--txt);}
    .fnp-row.inactive .fnp-name{color:var(--mut);}
    .fnp-motivo{font:500 11px/1.4 var(--ff-mono);color:var(--txt-2);}
    .fnp-chip{padding:4px 9px;border-radius:7px;font:700 10px/1 var(--ff-mono);letter-spacing:.07em;
      text-transform:uppercase;white-space:nowrap;flex:0 0 auto;}
    .fnp-chip.embajador{background:rgba(0,255,135,.12);border:1px solid rgba(0,255,135,.25);color:var(--green);}
    .fnp-chip.vip{background:rgba(255,165,0,.12);border:1px solid rgba(255,165,0,.28);color:#ffa500;}
    .fnp-chip.fiel{background:rgba(0,200,100,.1);border:1px solid rgba(0,200,100,.22);color:#00c864;}
    .fnp-ver{display:inline-flex;align-items:center;gap:6px;font:600 13px/1 var(--ff-mono);
      color:var(--green);text-decoration:none;letter-spacing:.03em;margin-top:6px;
      padding:9px 14px;border-radius:10px;border:1px solid rgba(0,255,135,.2);
      background:rgba(0,255,135,.06);transition:all .15s;}
    .fnp-ver:hover{background:rgba(0,255,135,.12);border-color:rgba(0,255,135,.35);}
    @media(max-width:640px){.fnp-chip{display:none;}}
  `],
  template: `
    <section class="sec" id="fans">
      <div class="sec-head">
        <div class="sh-l">
          <span class="sh-eye">06</span>
          <h2>{{ data.lang()==='es' ? 'Mayores Fans' : 'Top Fans' }}</h2>
          <p>{{ data.lang()==='es' ? 'Los que más han apoyado este proyecto' : 'Those who supported this project the most' }}</p>
        </div>
        <a class="fnp-ver" routerLink="/fans">
          {{ data.lang()==='es' ? 'Ver todos los fans' : 'See all fans' }} →
        </a>
      </div>

      <div class="fnp-board">
        @for (f of top3; track f.pos) {
          <div class="fnp-row" [class.inactive]="!f.activo" [class]="rowClass(f)">
            <div class="fnp-pos">{{ medal(f.pos) }}</div>
            <div class="fnp-info">
              <div class="fnp-name">{{ f.nombre }}</div>
              <div class="fnp-motivo">{{ f.motivo }}</div>
            </div>
            <div class="fnp-chip" [class]="f.badgeType">{{ f.badge }}</div>
          </div>
        }
      </div>
    </section>
  `,
})
export class FansPreviewComponent implements OnInit {
  data = inject(TmDataService);
  top3 = this.data.FANS_TOP.slice(0, 3);

  medal(pos: number): string {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return `#${pos}`;
  }

  rowClass(f: { pos: number; activo: boolean }): string {
    return `fnp-row rank-${f.pos}${f.activo ? '' : ' inactive'}`;
  }

  ngOnInit(): void {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.fnp-row').forEach((row, i) => {
            (row as HTMLElement).style.transitionDelay = `${i * 60}ms`;
            row.classList.add('fi-in');
          });
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
    setTimeout(() => {
      const el = document.getElementById('fans');
      if (el) obs.observe(el);
    }, 100);
  }
}
