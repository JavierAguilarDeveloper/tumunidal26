import {
  Component, inject, computed, signal, ViewEncapsulation,
  OnInit, OnDestroy, DestroyRef,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmDataService } from '../../core/services/tm-data.service';
import { ApiFootballService } from '../../core/services/api-football.service';
import { CountdownComponent } from '../../shared/countdown/countdown.component';

interface HeroView {
  mode: 'live' | 'upcoming' | 'countdown';
  homeName: string; awayName: string;
  homeFlag: string; awayFlag: string;
  homeLogo: string; awayLogo: string;
  hs: number; as: number; min: number;
  venue: string; round: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CountdownComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .hero{position:relative;width:100%;min-height:100vh;overflow:hidden;
      display:flex;flex-direction:column;justify-content:center;align-items:center;padding:140px 24px 80px;}
    .hero::before{content:"";position:absolute;inset:0;z-index:0;
      background:radial-gradient(62% 80% at 14% 50%,rgba(0,168,90,.30),transparent 56%),
        radial-gradient(62% 80% at 86% 50%,rgba(120,32,44,.30),transparent 56%),
        radial-gradient(90% 64% at 50% 122%,rgba(0,212,255,.10),transparent 70%);}
    .hero::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
      background:radial-gradient(78% 66% at 50% 42%,transparent 38%,rgba(0,0,0,.62));}
    .hero-dot{position:absolute;z-index:1;width:4px;height:4px;border-radius:50%;animation:hero-float linear infinite;}
    @keyframes hero-float{from{transform:translateY(0);opacity:0}12%{opacity:.7}88%{opacity:.7}to{transform:translateY(-180px);opacity:0}}
    .hero-in{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:20px;width:100%;max-width:1040px;}
    .hero-top{display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:center;}
    .hero-comp{font:700 12px/1 var(--ff-mono);letter-spacing:.3em;color:var(--txt-2);text-transform:uppercase;white-space:nowrap;}
    .hero-stage{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:clamp(24px,5vw,56px);width:100%;}
    .hero-side{display:flex;flex-direction:column;align-items:center;gap:14px;min-width:0;}
    .hero-disc{width:clamp(92px,11vw,128px);height:clamp(92px,11vw,128px);border-radius:30px;font-size:clamp(62px,8vw,86px);}
    .hero-logo-img{width:clamp(92px,11vw,128px);height:clamp(92px,11vw,128px);border-radius:30px;object-fit:contain;background:rgba(255,255,255,.06);}
    .hero-num{font:800 clamp(96px,15vw,158px)/.76 var(--ff-sans);font-variant-numeric:tabular-nums;letter-spacing:-.06em;text-shadow:0 0 70px rgba(0,255,135,.32);}
    .hero-nm{font:800 clamp(22px,3vw,32px)/1 var(--ff-sans);letter-spacing:-.02em;text-align:center;}
    .hero-mid{display:flex;flex-direction:column;align-items:center;gap:13px;}
    .hero-x{font:700 clamp(18px,2.4vw,28px)/1 var(--ff-mono);color:var(--mut);}
    .hero-min{font:700 14px/1 var(--ff-mono);color:#04130b;letter-spacing:.1em;padding:8px 14px;border-radius:9px;background:var(--green);box-shadow:0 0 26px rgba(0,255,135,.5);}
    .hero-stats{display:flex;gap:13px;margin-top:10px;flex-wrap:wrap;justify-content:center;}
    .hero-stat{border-radius:15px;padding:13px 22px;display:flex;flex-direction:column;gap:5px;align-items:center;min-width:118px;}
    .hero-stat .v{font:800 23px/1 var(--ff-sans);font-variant-numeric:tabular-nums;white-space:nowrap;}
    .hero-stat .l{font:600 10px/1 var(--ff-mono);letter-spacing:.16em;color:var(--mut);text-transform:uppercase;}
    .hero-venue{font:600 13px/1 var(--ff-mono);color:var(--txt-2);letter-spacing:.05em;margin-top:6px;text-align:center;}
    .hero-venue b{color:#fff;}
    .hero-cta{display:flex;gap:13px;margin-top:18px;flex-wrap:wrap;justify-content:center;}
    .hero-scroll{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:2;
      display:flex;flex-direction:column;align-items:center;gap:7px;color:var(--mut);
      font:600 10px/1 var(--ff-mono);letter-spacing:.24em;text-transform:uppercase;animation:hero-bob 2.4s ease-in-out infinite;}
    @keyframes hero-bob{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,7px)}}
    .hero-cdown{display:flex;flex-direction:column;align-items:center;gap:22px;}
    .hero-cdown-trophy{font-size:80px;filter:drop-shadow(0 0 30px rgba(255,215,0,.6));}
    .hero-cdown-lbl{font:600 13px/1 var(--ff-mono);letter-spacing:.16em;text-transform:uppercase;color:var(--txt-2);}
    .hero-cdown .cd-time{font:800 clamp(48px,8vw,80px)/1 var(--ff-mono);color:var(--green);letter-spacing:.06em;font-variant-numeric:tabular-nums;text-shadow:0 0 60px rgba(0,255,135,.4);}
    .hero-cdown-date{font:600 15px/1 var(--ff-mono);color:var(--txt-2);letter-spacing:.04em;}
    @media(max-width:600px){.hero-comp{font-size:10px;letter-spacing:.18em}}
  `],
  template: `
    <section class="hero" id="hero">
      @for (dot of dots; track $index) {
        <span class="hero-dot"
          [style.left]="(6 + $index * 5.8) + '%'"
          [style.top]="(38 + ($index % 6) * 9) + '%'"
          [style.animation-duration]="(7 + ($index % 6)) + 's'"
          [style.animation-delay]="($index * 0.55) + 's'"
          [style.background]="$index % 3 === 0 ? 'rgba(0,255,135,.6)' : 'rgba(255,255,255,.4)'">
        </span>
      }

      <div class="hero-in">
        @if (view().mode === 'countdown') {
          <div class="hero-top">
            <div class="hero-comp">FIFA WORLD CUP 2026 · MÉXICO · CANADÁ · USA</div>
          </div>
          <div class="hero-cdown">
            <div class="hero-cdown-trophy">🏆</div>
            <div class="hero-cdown-lbl">{{ lang() === 'es' ? 'El torneo comienza en' : 'Tournament starts in' }}</div>
            <app-countdown [target]="wc2026Target" />
            <div class="hero-cdown-date">11 Jun 2026 · 13:00 h CDMX</div>
          </div>
        } @else {
          <div class="hero-top">
            @if (view().mode === 'live') {
              <div class="tm-live"><span class="dot"></span>{{ t()['live'] }}</div>
            } @else {
              <div class="tm-next"><span class="dot"></span>{{ t()['upcoming'] }}</div>
            }
            <div class="hero-comp">{{ view().round }}</div>
          </div>
          <div class="hero-stage">
            <div class="hero-side">
              @if (view().homeLogo) {
                <img class="hero-logo-img" [src]="view().homeLogo" [alt]="view().homeName">
              } @else {
                <div class="tm-flag hero-disc">{{ view().homeFlag }}</div>
              }
              <div class="hero-num" style="color:#eafff4">{{ view().hs }}</div>
              <div class="hero-nm">{{ view().homeName }}</div>
            </div>
            <div class="hero-mid">
              <div class="hero-x">VS</div>
              @if (view().mode === 'live') {
                <div class="hero-min">{{ view().min }}'</div>
              }
            </div>
            <div class="hero-side">
              @if (view().awayLogo) {
                <img class="hero-logo-img" [src]="view().awayLogo" [alt]="view().awayName">
              } @else {
                <div class="tm-flag hero-disc">{{ view().awayFlag }}</div>
              }
              <div class="hero-num" style="color:#f2f3fa">{{ view().as }}</div>
              <div class="hero-nm">{{ view().awayName }}</div>
            </div>
          </div>
          <div class="hero-stats">
            <div class="tm-glass hero-stat"><span class="v">58%</span><span class="l">{{ t()['poss'] }}</span></div>
            <div class="tm-glass hero-stat"><span class="v" style="color:var(--green)">5</span><span class="l">{{ t()['shots'] }}</span></div>
            <div class="tm-glass hero-stat"><span class="v" style="color:var(--gold)">⚽ 41'</span><span class="l">{{ lang() === 'es' ? 'Giménez' : 'Giménez' }}</span></div>
            <div class="tm-glass hero-stat"><span class="v">1.8</span><span class="l">xG</span></div>
          </div>
          <div class="hero-venue">
            <b>{{ view().venue }}</b>
            @if (view().venue) { · }
            87.500 {{ t()['attend'] }}
          </div>
          <div class="hero-cta">
            <button class="tm-btn tm-btn-primary">▶ {{ t()['watch'] }}</button>
            <button class="tm-btn tm-btn-ghost">{{ t()['center'] }}</button>
          </div>
        }
      </div>
      <div class="hero-scroll"><span>Scroll</span><span style="font-size:13px">↓</span></div>
    </section>
  `,
})
export class HeroComponent implements OnInit {
  private data = inject(TmDataService);
  private api = inject(ApiFootballService);
  private destroyRef = inject(DestroyRef);

  readonly dots = Array.from({ length: 16 });
  readonly wc2026Target = new Date('2026-06-11T19:00:00Z').getTime();

  t = this.data.t;
  lang = this.data.lang;

  // Raw API fixture — null = use static fallback, 'countdown' = no matches
  private apiFixture = signal<any>(null);

  view = computed<HeroView>(() => {
    const f = this.apiFixture();
    const lang = this.data.lang();

    if (f === 'countdown') {
      return { mode: 'countdown', homeName: '', awayName: '', homeFlag: '', awayFlag: '', homeLogo: '', awayLogo: '', hs: 0, as: 0, min: 0, venue: '', round: '' };
    }

    if (f !== null) {
      return {
        mode: f.fixture?.status?.short === 'FT' ? 'upcoming' : 'live',
        homeName: f.teams?.home?.name ?? '',
        awayName: f.teams?.away?.name ?? '',
        homeFlag: this.findFlag(f.teams?.home?.name),
        awayFlag: this.findFlag(f.teams?.away?.name),
        homeLogo: f.teams?.home?.logo ?? '',
        awayLogo: f.teams?.away?.logo ?? '',
        hs: f.goals?.home ?? 0,
        as: f.goals?.away ?? 0,
        min: f.fixture?.status?.elapsed ?? 0,
        venue: f.fixture?.venue?.name ?? '',
        round: f.league?.round ?? '',
      };
    }

    // Static fallback
    const m = this.data.matches().find(m => m.id === this.data.HERO_ID)!;
    const home = this.data.TEAMS[m.home];
    const away = this.data.TEAMS[m.away];
    return {
      mode: m.status === 'live' ? 'live' : 'upcoming',
      homeName: home[lang], awayName: away[lang],
      homeFlag: home.flag, awayFlag: away.flag,
      homeLogo: '', awayLogo: '',
      hs: m.hs ?? 0, as: m.as ?? 0, min: m.min ?? 0,
      venue: 'Estadio Azteca',
      round: `${this.data.t()['group']} A · ${this.data.t()['matchday']} 2`,
    };
  });

  ngOnInit() {
    interval(300_000).pipe(
      startWith(0),
      switchMap(() => this.api.getLiveFixtures()),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(data => {
      if (data?.response?.length > 0) {
        this.apiFixture.set(data.response[0]);
      } else {
        this.api.getTodayFixtures().subscribe(today => {
          if (today?.response?.length > 0) {
            this.apiFixture.set(today.response[0]);
          } else {
            this.apiFixture.set('countdown');
          }
        });
      }
    });
  }

  private findFlag(apiName: string): string {
    if (!apiName) return '';
    const n = apiName.toLowerCase();
    const code = Object.keys(this.data.TEAMS).find(c =>
      this.data.TEAMS[c].en.toLowerCase() === n
    );
    return code ? this.data.TEAMS[code].flag : '';
  }
}
