import { Component, inject, signal, computed, ViewEncapsulation, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TmDataService, Standing } from '../../core/services/tm-data.service';
import { ApiFootballService } from '../../core/services/api-football.service';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .gtabs{display:flex;gap:7px;flex-wrap:wrap;}
    .gtab{font:700 13px/1 var(--ff-mono);letter-spacing:.04em;padding:9px 14px;border-radius:10px;cursor:pointer;
      background:var(--glass);border:1px solid var(--glass-brd);color:var(--txt-2);transition:all .15s;min-width:40px;text-align:center;}
    .gtab:hover{background:rgba(255,255,255,.09);color:var(--txt);}
    .gtab.on{background:linear-gradient(180deg,#26ff9b,#00e879);color:#04130b;border-color:transparent;box-shadow:0 8px 22px -8px rgba(0,255,135,.6);}
    .grid12{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:16px;margin-top:30px;}
    .grid-one{max-width:560px;margin:30px auto 0;}
    .gt-legend{display:flex;gap:18px;flex-wrap:wrap;margin-top:22px;font:600 11px/1 var(--ff-mono);color:var(--mut);letter-spacing:.04em;}
    .gt-legend span{display:flex;align-items:center;gap:7px;}
    .gt-legend i{width:11px;height:11px;border-radius:3px;display:inline-block;}
    .gt{border-radius:18px;padding:18px 18px 8px;display:flex;flex-direction:column;gap:12px;}
    .gt-head{display:flex;align-items:center;justify-content:space-between;}
    .gt-title{font:800 19px/1 var(--ff-sans);letter-spacing:-.01em;}
    .gt-title span{color:var(--green);}
    .gt-lead{font:700 10px/1 var(--ff-mono);letter-spacing:.14em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:6px;}
    .gt table{width:100%;border-collapse:collapse;table-layout:fixed;}
    .gt th{font:700 10px/1 var(--ff-mono);letter-spacing:.08em;color:var(--mut);text-transform:uppercase;text-align:center;padding:8px 4px;border-bottom:1px solid var(--glass-brd);}
    .gt th.tl{text-align:left;padding-left:6px;width:42%;}
    .gt td{font:600 13px/1 var(--ff-sans);color:var(--txt-2);text-align:center;padding:9px 4px;}
    .gt td.tl{text-align:left;}
    .gt th:not(.tl),.gt td:not(.tl){white-space:nowrap;}
    .gt tr{border-bottom:1px solid rgba(255,255,255,.04);}
    .gt .team{display:flex;align-items:center;gap:9px;}
    .gt .team .fl{font-size:19px;width:24px;text-align:center;}
    .gt .team .logo{width:20px;height:20px;object-fit:contain;}
    .gt .team .nm{font:700 13px/1.1 var(--ff-sans);color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .gt .pos{width:20px;height:20px;border-radius:6px;display:grid;place-items:center;font:700 11px/1 var(--ff-mono);background:rgba(255,255,255,.07);color:var(--txt-2);}
    .gt .pts{font:800 14px/1 var(--ff-sans);color:var(--txt);}
    .gt tr.q1 .pos{background:rgba(0,255,135,.18);color:var(--green);}
    .gt tr.q1{background:linear-gradient(90deg,rgba(0,255,135,.07),transparent);}
    .gt tr.q3 .pos{background:rgba(255,215,0,.16);color:var(--gold);}
    .gt tr.q3{background:linear-gradient(90deg,rgba(255,215,0,.05),transparent);}
    @keyframes skel-pulse{0%,100%{opacity:.35}50%{opacity:.72}}
    .skel{background:rgba(255,255,255,.08);border-radius:8px;animation:skel-pulse 1.5s ease-in-out infinite;}
    .skel-title{height:22px;width:55%;margin-bottom:14px;}
    .skel-row{height:38px;margin-bottom:6px;border-radius:6px;}
    .skel-card{padding:18px;gap:0;display:flex;flex-direction:column;min-height:220px;}
  `],
  template: `
    <section class="sec" id="grupos" style="background:linear-gradient(180deg,transparent,rgba(255,255,255,.012),transparent)">
      <div class="sec-head">
        <div class="sh-l">
          <span class="sh-eye">02</span>
          <h2>{{ data.t()['groups_t'] }}</h2>
          <p>{{ data.t()['groups_sub'] }}</p>
        </div>
        <div class="gtabs">
          <div [class]="'gtab' + (sel() === 'all' ? ' on' : '')" (click)="sel.set('all')">{{ data.t()['all'] }}</div>
          @for (letter of letters(); track letter) {
            <div [class]="'gtab' + (sel() === letter ? ' on' : '')" (click)="sel.set(letter)">{{ letter }}</div>
          }
        </div>
      </div>

      <div class="data-notice">
        <span class="dn-dot"></span>
        {{ data.lang() === 'es'
          ? 'Datos de demostración · Los datos reales se habilitarán el 11 de junio de 2026, al inicio del torneo'
          : 'Demo data · Real data will be available on June 11, 2026, when the tournament begins' }}
      </div>

      @if (loading()) {
        <div class="grid12">
          @for (i of skelItems; track $index) {
            <div class="tm-glass gt skel-card">
              <div class="skel skel-title"></div>
              @for (j of [1,2,3,4]; track $index) { <div class="skel skel-row"></div> }
            </div>
          }
        </div>
      } @else if (sel() === 'all') {
        <div class="grid12">
          @for (letter of letters(); track letter) {
            <ng-container *ngTemplateOutlet="groupTable; context: { letter, large: false }"></ng-container>
          }
        </div>
      } @else {
        <div class="grid-one">
          <ng-container *ngTemplateOutlet="groupTable; context: { letter: sel(), large: true }"></ng-container>
        </div>
      }

      <div class="gt-legend">
        <span><i style="background:var(--green)"></i>{{ data.t()['q1'] }}</span>
        <span><i style="background:var(--gold)"></i>{{ data.t()['q3'] }}</span>
      </div>
    </section>

    <ng-template #groupTable let-letter="letter" let-large="large">
      <div class="tm-glass gt">
        <div class="gt-head">
          <div class="gt-title">{{ data.t()['group'] }} <span>{{ letter }}</span></div>
          <div class="gt-lead">★ {{ leaderName(letter) }}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th class="tl">{{ data.t()['th_team'] }}</th>
              <th>{{ data.t()['th_pj'] }}</th>
              <th>{{ data.t()['th_w'] }}</th>
              <th>{{ data.t()['th_d'] }}</th>
              <th>{{ data.t()['th_l'] }}</th>
              @if (large) { <th>{{ data.t()['th_gf'] }}</th><th>{{ data.t()['th_ga'] }}</th> }
              <th>{{ data.t()['th_gd'] }}</th>
              <th>{{ data.t()['th_pts'] }}</th>
            </tr>
          </thead>
          <tbody>
            @for (r of resolveStandings(letter); track r.code; let i = $index) {
              <tr [class]="i < 2 ? 'q1' : i === 2 ? 'q3' : ''">
                <td><span class="pos">{{ i + 1 }}</span></td>
                <td class="tl">
                  <div class="team">
                    @if (r.teamLogo) {
                      <img class="logo" [src]="r.teamLogo" [alt]="r.teamName">
                    } @else {
                      <span class="fl">{{ data.TEAMS[r.code]?.flag ?? '🏴' }}</span>
                    }
                    <span class="nm">{{ data.TEAMS[r.code]?.[data.lang()] ?? r.teamName ?? r.code }}</span>
                  </div>
                </td>
                <td>{{ r.pj }}</td><td>{{ r.w }}</td><td>{{ r.d }}</td><td>{{ r.l }}</td>
                @if (large) { <td>{{ r.gf }}</td><td>{{ r.ga }}</td> }
                <td>{{ r.gd > 0 ? '+' + r.gd : r.gd }}</td>
                <td class="pts">{{ r.pts }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </ng-template>
  `,
})
export class GruposComponent implements OnInit {
  data = inject(TmDataService);
  private api = inject(ApiFootballService);

  sel = signal<string>('all');
  loading = signal(false);
  readonly skelItems = Array.from({ length: 12 });

  private apiGroupsMap = signal<Record<string, Standing[]>>({});

  letters = computed(() => {
    const keys = Object.keys(this.apiGroupsMap());
    return keys.length > 0 ? keys : Object.keys(this.data.GROUPS);
  });

  ngOnInit() {
    this.loading.set(true);
    this.api.getStandings().subscribe(res => {
      this.loading.set(false);
      if (res?.response?.length > 0) {
        this.apiGroupsMap.set(this.mapApiStandings(res));
      }
    });
  }

  resolveStandings(letter: string): Standing[] {
    const api = this.apiGroupsMap();
    return api[letter]?.length ? api[letter] : this.data.standings(letter);
  }

  leaderName(letter: string): string {
    const rows = this.resolveStandings(letter);
    const leader = rows[0];
    if (!leader) return '';
    return this.data.TEAMS[leader.code]?.[this.data.lang()] ?? leader.teamName ?? leader.code;
  }

  private mapApiStandings(res: any): Record<string, Standing[]> {
    const groups: any[][] = res.response[0]?.league?.standings ?? [];
    const result: Record<string, Standing[]> = {};
    for (const group of groups) {
      if (!group?.length) continue;
      const letter = (group[0].group ?? '').replace('Group ', '').trim();
      if (!letter) continue;
      result[letter] = group.map((e: any) => ({
        code: this.findCode(e.team?.name) ?? 'UNKN',
        teamName: e.team?.name,
        teamLogo: e.team?.logo,
        w: e.all?.win ?? 0,
        d: e.all?.draw ?? 0,
        l: e.all?.lose ?? 0,
        gf: e.all?.goals?.for ?? 0,
        ga: e.all?.goals?.against ?? 0,
        pj: e.all?.played ?? 0,
        gd: e.goalsDiff ?? 0,
        pts: e.points ?? 0,
      }));
    }
    return result;
  }

  private findCode(name?: string): string | null {
    if (!name) return null;
    const n = name.toLowerCase();
    return Object.keys(this.data.TEAMS).find(c =>
      this.data.TEAMS[c].en.toLowerCase() === n
    ) ?? null;
  }
}
