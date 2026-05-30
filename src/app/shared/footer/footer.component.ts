import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TmDataService } from '../../core/services/tm-data.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .ft{border-top:1px solid var(--glass-brd);margin-top:40px;padding:50px 28px 60px;}
    .ft-in{max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:28px;}
    .ft-top{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap;}
    .ft-l{display:flex;flex-direction:column;gap:10px;}
    .ft-logo{display:flex;align-items:center;gap:10px;}
    .ft-logo .m{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;font-size:14px;background:linear-gradient(145deg,#26ff9b,#00b86a);}
    .ft-logo b{font:800 16px/1 var(--ff-sans);color:var(--txt);}
    .ft-logo b span{color:var(--green);}
    .ft-tag{font:500 13px/1.4 var(--ff-mono);color:var(--mut);letter-spacing:.02em;}
    .ft-nav{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:4px;}
    .ft-nav a{font:600 13px/1 var(--ff-mono);color:var(--txt-2);text-decoration:none;padding:6px 10px;border-radius:8px;
      border:1px solid var(--glass-brd);background:var(--glass);transition:all .15s;letter-spacing:.03em;}
    .ft-nav a:hover{color:var(--txt);background:var(--glass-2);border-color:var(--glass-brd-2);}
    .ft-data{font:500 12px/1.7 var(--ff-mono);color:var(--mut);text-align:right;}
    .ft-data b{color:var(--txt-2);font-weight:600;}
    .ft-bottom{border-top:1px solid rgba(255,255,255,.05);padding-top:22px;
      display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
    .ft-copy{font:500 12px/1 var(--ff-mono);color:var(--mut);letter-spacing:.02em;}
    @media(max-width:640px){.ft-top{flex-direction:column;}.ft-data{text-align:left;}}
  `],
  template: `
    <footer class="ft">
      <div class="ft-in">
        <div class="ft-top">
          <div class="ft-l">
            <div class="ft-logo"><span class="m">⚽</span><b>TuMundial<span>26</span></b></div>
            <div class="ft-tag">tumundial26.com — {{ data.t()['foot_tag'] }}</div>
            <nav class="ft-nav">
              <a routerLink="/privacidad">{{ data.lang() === 'es' ? 'Privacidad' : 'Privacy' }}</a>
              <a routerLink="/acerca">{{ data.lang() === 'es' ? 'Acerca de' : 'About' }}</a>
              <a routerLink="/contacto">{{ data.lang() === 'es' ? 'Contacto' : 'Contact' }}</a>
            </nav>
          </div>
          <div class="ft-data">
            {{ data.t()['foot_data'] }} <b>API-Football</b> · <b>openfootball</b>
          </div>
        </div>
        <div class="ft-bottom">
          <div class="ft-copy">© 2026 TuMundial26 · {{ data.t()['foot_tag'] }}</div>
          <div class="ft-copy">{{ data.lang() === 'es' ? 'Rastreador independiente · No afiliado a FIFA' : 'Independent tracker · Not affiliated with FIFA' }}</div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  data = inject(TmDataService);
}
