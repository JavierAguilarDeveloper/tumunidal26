import { Component, inject, signal, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TmDataService } from '../../core/services/tm-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .nv{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;
      padding:16px 28px;transition:background .3s,border-color .3s,padding .3s;border-bottom:1px solid transparent;}
    .nv-on{background:rgba(10,10,18,.62);backdrop-filter:blur(20px) saturate(150%);-webkit-backdrop-filter:blur(20px) saturate(150%);
      border-bottom-color:var(--glass-brd);padding:12px 28px;}
    .nv-logo{display:flex;align-items:center;gap:11px;cursor:pointer;}
    .nv-mark{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;font-size:16px;
      background:linear-gradient(145deg,#26ff9b,#00b86a);box-shadow:0 4px 14px -3px rgba(0,255,135,.6);}
    .nv-name{font:800 18px/1 var(--ff-sans);letter-spacing:-.02em;color:var(--txt);}
    .nv-name b{color:var(--green);}
    .nv-links{display:flex;gap:4px;}
    .nv-links a{font:600 14px/1 var(--ff-sans);color:var(--txt-2);padding:9px 14px;border-radius:9px;cursor:pointer;transition:all .15s;}
    .nv-links a:hover{color:var(--txt);background:rgba(255,255,255,.06);}
    .nv-right{display:flex;align-items:center;gap:14px;}
    .nv-lang{display:flex;background:var(--glass);border:1px solid var(--glass-brd);border-radius:999px;padding:3px;backdrop-filter:blur(12px);}
    .nv-lang button{font:700 12px/1 var(--ff-mono);letter-spacing:.05em;padding:7px 13px;border:none;border-radius:999px;cursor:pointer;
      background:transparent;color:var(--mut);transition:all .15s;}
    .nv-lang button.on{background:#fff;color:#0a0a0f;}
    @media(max-width:760px){.nv-links{display:none;}.nv{padding:14px 18px;}}
  `],
  template: `
    <nav [class]="'nv' + (scrolled() ? ' nv-on' : '')">
      <div class="nv-logo" (click)="scrollTop()">
        <span class="nv-mark">⚽</span>
        <span class="nv-name">TuMundial<b>26</b></span>
      </div>
      <div class="nv-links">
        @for (link of links; track link[0]) {
          <a (click)="go(link)">{{ data.t()[link[1]] }}</a>
        }
      </div>
      <div class="nv-right">
        <div class="nv-lang">
          <button [class.on]="data.lang() === 'es'" (click)="data.setLang('es')">ES</button>
          <button [class.on]="data.lang() === 'en'" (click)="data.setLang('en')">EN</button>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  data = inject(TmDataService);
  private router = inject(Router);
  scrolled = signal(false);
  links: [string, string, string?][] = [
    ['partidos', 'nav_matches'],
    ['grupos', 'nav_groups'],
    ['bracket', 'nav_bracket'],
    ['goleadores', 'nav_scorers'],
    ['fans', 'nav_fans', '/fans'],
  ];

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 30); }

  go(link: [string, string, string?]) {
    const [id, , route] = link;
    if (this.router.url === '/') {
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 74, behavior: 'smooth' });
      } else if (route) {
        this.router.navigate([route]);
      }
    } else if (route) {
      this.router.navigate([route]);
    } else {
      this.router.navigate(['/'], { fragment: id });
    }
  }

  scrollTop() {
    if (this.router.url === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']);
    }
  }
}
