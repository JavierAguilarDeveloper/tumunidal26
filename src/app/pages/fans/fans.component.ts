import { Component, inject, signal, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TmDataService } from '../../core/services/tm-data.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { BackdropComponent } from '../../shared/backdrop/backdrop.component';

@Component({
  selector: 'app-fans',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, BackdropComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .fn-root{min-height:100vh;}
    .fn-main{max-width:900px;margin:0 auto;padding:110px 24px 80px;}
    .fn-back{display:inline-flex;align-items:center;gap:8px;font:600 13px/1 var(--ff-mono);color:var(--txt-2);
      text-decoration:none;letter-spacing:.04em;padding:9px 14px;border-radius:10px;border:1px solid var(--glass-brd);
      background:var(--glass);transition:all .15s;margin-bottom:36px;}
    .fn-back:hover{color:var(--txt);background:var(--glass-2);}
    .fn-hero-badge{display:inline-block;font:700 11px/1 var(--ff-mono);letter-spacing:.1em;text-transform:uppercase;
      padding:5px 10px;border-radius:7px;background:rgba(0,255,135,.12);border:1px solid rgba(0,255,135,.25);
      color:var(--green);margin-bottom:12px;}
    .fn-h1{font:800 clamp(28px,4.5vw,44px)/1.1 var(--ff-sans);letter-spacing:-.025em;color:var(--txt);margin:0 0 12px;}
    .fn-sub{font:500 15px/1.6 var(--ff-mono);color:var(--txt-2);margin:0 0 52px;max-width:520px;}
    .fn-sec{margin-bottom:60px;}
    .fn-sh{margin-bottom:20px;}
    .fn-sh-eye{font:700 11px/1 var(--ff-mono);letter-spacing:.22em;color:var(--green);text-transform:uppercase;margin-bottom:8px;}
    .fn-sh-title{font:800 22px/1.1 var(--ff-sans);color:var(--txt);margin:0;}
    .fn-grupos{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;}
    .fn-grupo{padding:22px 20px;border-radius:18px;background:var(--glass);border:1px solid var(--glass-brd);
      backdrop-filter:blur(18px);display:flex;flex-direction:column;gap:12px;transition:transform .2s,background .2s;}
    .fn-grupo:hover{transform:translateY(-2px);background:var(--glass-2);}
    .fn-grupo.inactive{opacity:.4;}
    .fn-grupo-name{font:700 16px/1.2 var(--ff-sans);color:var(--txt);}
    .fn-grupo.inactive .fn-grupo-name{color:var(--mut);}
    .fn-plat{display:inline-flex;align-items:center;gap:7px;padding:5px 10px;border-radius:8px;
      background:rgba(255,255,255,.05);border:1px solid var(--glass-brd);}
    .fn-plat-icon{font-size:14px;}
    .fn-plat-name{font:600 12px/1 var(--ff-mono);color:var(--txt-2);}
    .fn-grupo-members{font:600 12px/1 var(--ff-mono);color:var(--mut);}
    .fn-grupo-members b{color:var(--txt-2);}
    .fn-official{display:inline-flex;align-items:center;gap:5px;font:700 10px/1 var(--ff-mono);
      letter-spacing:.07em;text-transform:uppercase;padding:4px 9px;border-radius:6px;
      background:rgba(0,255,135,.1);border:1px solid rgba(0,255,135,.2);color:var(--green);}
    .fn-board{display:flex;flex-direction:column;gap:10px;}
    .fn-row{display:flex;align-items:center;gap:16px;padding:16px 20px;border-radius:16px;
      background:var(--glass);border:1px solid var(--glass-brd);backdrop-filter:blur(18px);
      transition:transform .15s,background .15s;}
    .fn-row:hover{transform:translateX(4px);background:var(--glass-2);}
    .fn-row.inactive{opacity:.38;}
    .fn-pos{min-width:44px;font:800 20px/1 var(--ff-sans);text-align:center;flex:0 0 auto;}
    .fn-row:not(.inactive).rank-1 .fn-pos{filter:drop-shadow(0 0 8px #ffd700);}
    .fn-row:not(.inactive).rank-2 .fn-pos{filter:drop-shadow(0 0 6px #c0c0c0);}
    .fn-row:not(.inactive).rank-3 .fn-pos{filter:drop-shadow(0 0 6px #cd7f32);}
    .fn-row-info{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0;}
    .fn-row-name{font:700 16px/1.1 var(--ff-sans);color:var(--txt);}
    .fn-row.inactive .fn-row-name{color:var(--mut);}
    .fn-row-city{font:600 11px/1 var(--ff-mono);color:var(--mut);letter-spacing:.05em;}
    .fn-row-motivo{font:500 12px/1.4 var(--ff-mono);color:var(--txt-2);}
    .fn-chip{padding:5px 10px;border-radius:8px;font:700 10px/1 var(--ff-mono);letter-spacing:.07em;
      text-transform:uppercase;white-space:nowrap;flex:0 0 auto;}
    .fn-chip.embajador{background:rgba(0,255,135,.12);border:1px solid rgba(0,255,135,.25);color:var(--green);}
    .fn-chip.vip{background:rgba(255,165,0,.12);border:1px solid rgba(255,165,0,.28);color:#ffa500;}
    .fn-chip.fiel{background:rgba(0,200,100,.1);border:1px solid rgba(0,200,100,.22);color:#00c864;}
    .fn-share-wrap{display:flex;justify-content:center;}
    .fn-share-card{max-width:520px;width:100%;padding:32px 28px;border-radius:20px;text-align:center;
      background:var(--glass);border:1px solid var(--glass-brd);backdrop-filter:blur(20px);}
    .fn-share-emoji{font-size:38px;margin-bottom:14px;}
    .fn-share-txt{font:500 15px/1.7 var(--ff-sans);color:var(--txt-2);margin:0 0 24px;}
    .fn-share-txt b{color:var(--txt);}
    .fn-share-btn{display:inline-flex;align-items:center;gap:10px;padding:13px 24px;border-radius:12px;
      border:none;cursor:pointer;font:700 14px/1 var(--ff-sans);
      background:linear-gradient(135deg,#00ff87,#0bbd66);color:#0a0a0f;
      transition:transform .15s,box-shadow .15s;}
    .fn-share-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,255,135,.4);}
    .fn-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);
      background:#0bbd66;color:#0a0a0f;font:700 13px/1 var(--ff-mono);padding:11px 20px;
      border-radius:10px;letter-spacing:.05em;transition:transform .3s cubic-bezier(.34,1.56,.64,1);
      z-index:200;pointer-events:none;}
    .fn-toast.show{transform:translateX(-50%) translateY(0);}
    @keyframes fi-anim{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    .fi{opacity:0;transform:translateY(18px);}
    .fi.fi-in{animation:fi-anim .5s ease forwards;}
    @media(max-width:640px){.fn-chip{display:none;}.fn-row{flex-wrap:wrap;}}
  `],
  template: `
    <div class="fn-root">
      <app-backdrop />
      <app-navbar />
      <main class="fn-main">
        <a class="fn-back" routerLink="/">← {{ data.lang()==='es' ? 'Volver al inicio' : 'Back to home' }}</a>

        <div class="fn-hero-badge fi">⭐ {{ data.lang()==='es' ? 'Comunidad' : 'Community' }}</div>
        <h1 class="fn-h1 fi">{{ data.lang()==='es' ? 'Mayores Fans de TuMundial26 🏆' : 'TuMundial26 Top Fans 🏆' }}</h1>
        <p class="fn-sub fi">{{ data.lang()==='es'
          ? 'Estas personas hicieron posible que este proyecto llegara a más gente. ¡Gracias por compartir y apoyar!'
          : 'These people helped this project reach more people. Thanks for sharing and supporting!' }}</p>

        <!-- Sección 1: Grupos -->
        <div class="fn-sec">
          <div class="fn-sh fi">
            <div class="fn-sh-eye">01 · {{ data.lang()==='es' ? 'Grupos que nos apoyaron' : 'Groups that supported us' }}</div>
            <h2 class="fn-sh-title">{{ data.lang()==='es' ? 'Grupos Oficiales' : 'Official Groups' }}</h2>
          </div>
          <div class="fn-grupos">
            @for (g of data.FANS_GRUPOS; track g.nombre) {
              <div class="fn-grupo fi" [class.inactive]="!g.activo">
                <div class="fn-grupo-name">{{ g.nombre }}</div>
                <div class="fn-plat">
                  <span class="fn-plat-icon">{{ g.icon }}</span>
                  <span class="fn-plat-name">{{ g.plataforma }}</span>
                </div>
                <div class="fn-grupo-members">
                  {{ data.lang()==='es' ? 'Miembros:' : 'Members:' }}
                  <b>{{ g.activo && g.miembros > 0 ? g.miembros.toLocaleString() : '—' }}</b>
                </div>
                @if (g.activo) {
                  <div class="fn-official">Grupo Oficial TuMundial26 ⭐</div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Sección 2: Hall of Fame -->
        <div class="fn-sec">
          <div class="fn-sh fi">
            <div class="fn-sh-eye">02 · Hall of Fame</div>
            <h2 class="fn-sh-title">Top Fans</h2>
          </div>
          <div class="fn-board">
            @for (f of data.FANS_TOP; track f.pos) {
              <div class="fn-row fi" [class.inactive]="!f.activo" [class]="rowClass(f)">
                <div class="fn-pos">{{ medal(f.pos) }}</div>
                <div class="fn-row-info">
                  <div class="fn-row-name">{{ f.nombre }}</div>
                  <div class="fn-row-city">{{ f.ciudad }}</div>
                  <div class="fn-row-motivo">{{ f.motivo }}</div>
                </div>
                <div class="fn-chip" [class]="f.badgeType">{{ f.badge }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Sección 3: Compartir -->
        <div class="fn-share-wrap fi">
          <div class="fn-share-card">
            <div class="fn-share-emoji">❤️</div>
            <p class="fn-share-txt">
              {{ data.lang()==='es'
                ? 'TuMundial26 es un proyecto independiente hecho con ❤️ para los fans del fútbol. Si compartes el sitio durante el Mundial, podrías aparecer aquí. ¡Gracias por ser parte de esto!'
                : 'TuMundial26 is an independent project made with ❤️ for football fans. If you share the site during the World Cup, you could appear here. Thanks for being part of this!' }}
            </p>
            <button class="fn-share-btn" (click)="share()">
              <span>📤</span>
              {{ data.lang()==='es' ? 'Compartir tumundial26.com' : 'Share tumundial26.com' }}
            </button>
          </div>
        </div>
      </main>
      <app-footer />
    </div>

    <div class="fn-toast" [class.show]="toastVisible()">
      {{ data.lang()==='es' ? '¡Link copiado!' : 'Link copied!' }}
    </div>
  `,
})
export class FansComponent implements OnInit {
  data = inject(TmDataService);
  toastVisible = signal(false);

  medal(pos: number): string {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return `#${pos}`;
  }

  rowClass(f: { pos: number; activo: boolean }): string {
    return `fn-row fi rank-${f.pos}${f.activo ? '' : ' inactive'}`;
  }

  async share(): Promise<void> {
    const shareData = {
      title: 'TuMundial26 - Rastreador del Mundial FIFA 2026',
      text: '¡Sigue el Mundial 2026 en tiempo real! Resultados, grupos, bracket y goleadores.',
      url: 'https://tumundial26.com',
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText('https://tumundial26.com');
        this.toastVisible.set(true);
        setTimeout(() => this.toastVisible.set(false), 3000);
      } catch { /* clipboard not available */ }
    }
  }

  ngOnInit(): void {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('fi-in'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    setTimeout(() => document.querySelectorAll('.fn-main .fi').forEach(el => obs.observe(el)), 80);
  }
}
