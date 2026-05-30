import { Component, inject, signal, computed, ViewEncapsulation, OnInit } from '@angular/core';
import { TmDataService } from '../../core/services/tm-data.service';
import { ApiFootballService } from '../../core/services/api-football.service';

interface ScorerView {
  name: string;
  flag: string;
  photo: string;
  teamName: string;
  sub: string;
  goals: number;
}

@Component({
  selector: 'app-goleadores',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .sc-list{display:flex;flex-direction:column;gap:10px;}
    .sc-row{display:flex;align-items:center;gap:18px;padding:15px 20px;border-radius:15px;
      background:var(--glass);border:1px solid var(--glass-brd);backdrop-filter:blur(18px);transition:transform .15s,background .15s;}
    .sc-row:hover{transform:translateX(4px);background:rgba(255,255,255,.07);}
    .sc-rank{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;flex:0 0 auto;
      font:800 16px/1 var(--ff-sans);background:rgba(255,255,255,.06);color:var(--txt-2);}
    .sc-row.top .sc-rank{color:#0a0a0f;}
    .sc-photo{width:40px;height:40px;border-radius:50%;object-fit:cover;flex:0 0 auto;border:1px solid var(--glass-brd);}
    .sc-fl{font-size:28px;line-height:1;width:36px;text-align:center;flex:0 0 auto;}
    .sc-flag-img{width:28px;height:20px;object-fit:cover;border-radius:3px;flex:0 0 auto;}
    .sc-id{flex:1;display:flex;flex-direction:column;gap:3px;min-width:0;}
    .sc-nm{font:800 18px/1.1 var(--ff-sans);color:var(--txt);}
    .sc-sub{font:600 11px/1 var(--ff-mono);color:var(--mut);letter-spacing:.06em;}
    .sc-bar{flex:0 0 130px;height:7px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden;}
    .sc-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#00ff87,#0bbd66);}
    .sc-goals{flex:0 0 auto;display:flex;align-items:center;gap:9px;}
    .sc-goals .g{font:800 26px/1 var(--ff-sans);color:var(--txt);font-variant-numeric:tabular-nums;}
    .sc-goals .ball{font-size:18px;}
    .sc-skel{height:74px;border-radius:15px;}
    @keyframes skel-pulse{0%,100%{opacity:.35}50%{opacity:.72}}
    .skel{background:rgba(255,255,255,.08);border-radius:8px;animation:skel-pulse 1.5s ease-in-out infinite;}
    @media(max-width:640px){.sc-bar,.sc-sub{display:none;}}
  `],
  template: `
    <section class="sec" id="goleadores">
      <div class="sec-head">
        <div class="sh-l">
          <span class="sh-eye">03</span>
          <h2>{{ data.t()['scorers_t'] }}</h2>
          <p>{{ data.t()['scorers_sub'] }}</p>
        </div>
      </div>

      <div class="data-notice">
        <span class="dn-dot"></span>
        {{ data.lang() === 'es'
          ? 'Datos de demostración · Los datos reales se habilitarán el 11 de junio de 2026, al inicio del torneo'
          : 'Demo data · Real data will be available on June 11, 2026, when the tournament begins' }}
      </div>

      @if (loading()) {
        <div class="sc-list">
          @for (i of skelItems; track $index) {
            <div class="skel sc-skel"></div>
          }
        </div>
      } @else {
        <div class="sc-list">
          @for (p of scorers(); track p.name; let i = $index) {
            <div [class]="'sc-row' + (i < 3 ? ' top' : '')"
              [style.border-color]="topBorder(i)">
              <span class="sc-rank" [style.background]="i < 3 ? medals[i] : null">{{ i + 1 }}</span>

              @if (p.photo) {
                <img class="sc-photo" [src]="p.photo" [alt]="p.name" (error)="onPhotoErr($event)">
              }

              <span class="sc-fl">{{ p.flag }}</span>

              <div class="sc-id">
                <span class="sc-nm">{{ p.name }}</span>
                <span class="sc-sub">{{ p.teamName }} · {{ p.sub }}</span>
              </div>
              <div class="sc-bar"><i [style.width]="(p.goals / scorers()[0].goals * 100) + '%'"></i></div>
              <div class="sc-goals">
                <span class="g" [style.color]="i < 3 ? medals[i] : null">{{ p.goals }}</span>
                <span class="ball">⚽</span>
              </div>
            </div>
          }
        </div>
      }
    </section>
  `,
})
export class GoleadoresComponent implements OnInit {
  data = inject(TmDataService);
  private api = inject(ApiFootballService);

  loading = signal(false);
  readonly medals = ['var(--gold)', 'var(--silver)', 'var(--bronze)'];
  readonly skelItems = Array.from({ length: 10 });

  private apiScorers = signal<ScorerView[]>([]);

  scorers = computed<ScorerView[]>(() => {
    const api = this.apiScorers();
    if (api.length > 0) return api;
    return this.data.SCORERS.map(p => ({
      name: p.name,
      flag: this.data.TEAMS[p.code]?.flag ?? '',
      photo: '',
      teamName: this.data.TEAMS[p.code]?.[this.data.lang()] ?? p.code,
      sub: p.sub,
      goals: p.goals,
    }));
  });

  ngOnInit() {
    this.loading.set(true);
    this.api.getTopScorers().subscribe(res => {
      this.loading.set(false);
      if (res?.response?.length > 0) {
        this.apiScorers.set(this.mapApiScorers(res.response));
      }
    });
  }

  topBorder(i: number): string | null {
    if (i === 0) return 'rgba(255,215,0,.3)';
    if (i === 1) return 'rgba(201,210,224,.3)';
    if (i === 2) return 'rgba(214,138,78,.3)';
    return null;
  }

  onPhotoErr(e: Event) {
    (e.target as HTMLImageElement).style.display = 'none';
  }

  private mapApiScorers(response: any[]): ScorerView[] {
    return response.slice(0, 10).map(item => {
      const player = item.player ?? {};
      const stats = item.statistics?.[0] ?? {};
      const teamName = stats.team?.name ?? '';
      const code = this.findCode(teamName) ?? this.findCodeByNationality(player.nationality);
      return {
        name: player.name ?? '',
        flag: code ? (this.data.TEAMS[code]?.flag ?? '🏴') : '🏴',
        photo: player.photo ?? '',
        teamName: code ? (this.data.TEAMS[code]?.[this.data.lang()] ?? teamName) : teamName,
        sub: `${stats.games?.appearences ?? 0} PJ · ${stats.goals?.assists ?? 0} AST`,
        goals: stats.goals?.total ?? 0,
      };
    });
  }

  private findCode(name?: string): string | null {
    if (!name) return null;
    const n = name.toLowerCase();
    return Object.keys(this.data.TEAMS).find(c =>
      this.data.TEAMS[c].en.toLowerCase() === n
    ) ?? null;
  }

  private findCodeByNationality(nationality?: string): string | null {
    if (!nationality) return null;
    const n = nationality.toLowerCase();
    return Object.keys(this.data.TEAMS).find(c =>
      this.data.TEAMS[c].en.toLowerCase() === n
    ) ?? null;
  }
}
