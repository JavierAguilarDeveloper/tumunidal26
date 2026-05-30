import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TmDataService } from '../../core/services/tm-data.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { BackdropComponent } from '../../shared/backdrop/backdrop.component';

interface Stadium {
  name: string;
  city_es: string;
  city_en: string;
  country_es: string;
  country_en: string;
  flag: string;
  capacity: string;
}

@Component({
  selector: 'app-acerca',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, BackdropComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .ac-root{min-height:100vh;background:var(--tm-bg);}
    .ac-main{max-width:800px;margin:0 auto;padding:110px 24px 80px;}
    .ac-back{display:inline-flex;align-items:center;gap:8px;font:600 13px/1 var(--ff-mono);color:var(--txt-2);
      text-decoration:none;letter-spacing:.04em;padding:9px 14px;border-radius:10px;border:1px solid var(--glass-brd);
      background:var(--glass);transition:all .15s;margin-bottom:36px;}
    .ac-back:hover{color:var(--txt);background:var(--glass-2);}
    .ac-badge{display:inline-block;font:700 11px/1 var(--ff-mono);letter-spacing:.1em;text-transform:uppercase;
      padding:5px 10px;border-radius:7px;background:var(--glass);border:1px solid var(--glass-brd);
      color:var(--txt-2);margin-bottom:6px;}
    .ac-h1{font:800 38px/1.1 var(--ff-sans);letter-spacing:-.02em;color:var(--txt);margin-bottom:8px;}
    .ac-meta{font:500 13px/1 var(--ff-mono);color:var(--mut);margin-bottom:40px;letter-spacing:.03em;}
    .ac-h2{font:700 22px/1.2 var(--ff-sans);color:var(--txt);margin:44px 0 16px;display:flex;align-items:center;gap:12px;}
    .ac-h2 span{font-size:24px;}
    .ac-p{font:400 16px/1.8 var(--ff-sans);color:var(--txt-2);margin-bottom:16px;}
    .ac-p b{color:var(--txt);}
    .ac-features{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin:20px 0;}
    .ac-feat{padding:18px 16px;border-radius:14px;display:flex;flex-direction:column;gap:8px;}
    .ac-feat-icon{font-size:22px;}
    .ac-feat-title{font:700 14px/1 var(--ff-sans);color:var(--txt);}
    .ac-feat-desc{font:500 12px/1.5 var(--ff-mono);color:var(--mut);}
    .ac-tech{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0;}
    .ac-tech-chip{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;
      background:var(--glass);border:1px solid var(--glass-brd);}
    .ac-tech-chip .icon{font-size:18px;}
    .ac-tech-chip .label{font:600 13px/1 var(--ff-sans);color:var(--txt-2);}
    .ac-stadiums{width:100%;border-collapse:collapse;margin:20px 0;border-radius:14px;overflow:hidden;}
    .ac-stadiums thead tr{background:rgba(255,255,255,.05);}
    .ac-stadiums th{font:700 11px/1 var(--ff-mono);letter-spacing:.08em;color:var(--mut);text-transform:uppercase;
      padding:12px 14px;text-align:left;border-bottom:1px solid var(--glass-brd);}
    .ac-stadiums td{font:500 14px/1 var(--ff-sans);color:var(--txt-2);padding:11px 14px;
      border-bottom:1px solid rgba(255,255,255,.04);}
    .ac-stadiums td.name{color:var(--txt);font-weight:600;}
    .ac-stadiums td.flag{font-size:18px;width:36px;}
    .ac-stadiums tbody tr:hover{background:rgba(255,255,255,.02);}
    .ac-wc-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:20px 0;}
    .ac-wc-card{padding:20px 18px;border-radius:16px;border-left:3px solid;}
    .ac-wc-card.g{border-color:var(--green);}
    .ac-wc-card.gold{border-color:var(--gold);}
    .ac-wc-card.red{border-color:var(--red);}
    .ac-wc-num{font:800 36px/1 var(--ff-sans);margin-bottom:6px;}
    .ac-wc-card.g .ac-wc-num{color:var(--green);}
    .ac-wc-card.gold .ac-wc-num{color:var(--gold);}
    .ac-wc-card.red .ac-wc-num{color:var(--red);}
    .ac-wc-lbl{font:600 12px/1.4 var(--ff-mono);color:var(--mut);letter-spacing:.05em;}
    .ac-divider{border:none;border-top:1px solid var(--glass-brd);margin:40px 0;}
  `],
  template: `
    <div class="ac-root">
      <app-backdrop />
      <app-navbar />
      <main class="ac-main">
        <a class="ac-back" routerLink="/">← {{ data.lang() === 'es' ? 'Volver al inicio' : 'Back to home' }}</a>

        <div class="ac-badge">{{ data.lang() === 'es' ? 'Acerca de' : 'About' }}</div>
        <h1 class="ac-h1">TuMundial26</h1>
        <p class="ac-meta">{{ data.lang() === 'es' ? 'Rastreador independiente del Mundial FIFA 2026' : 'Independent FIFA World Cup 2026 Tracker' }}</p>

        @if (data.lang() === 'es') {

          <h2 class="ac-h2"><span>⚽</span> ¿Qué es TuMundial26?</h2>
          <p class="ac-p"><b>TuMundial26</b> es un rastreador independiente del <b>FIFA World Cup 2026</b>,
          construido por un equipo de aficionados al fútbol y al desarrollo web. Nuestro objetivo es ofrecer
          una experiencia limpia, rápida y sin ruido para seguir el torneo más grande en la historia del
          fútbol mundial.</p>
          <p class="ac-p">El sitio está diseñado como una <b>aplicación de página única</b> optimizada para
          cualquier dispositivo, con datos en tiempo real cuando el torneo esté activo y datos estadísticos
          actualizados durante toda la competencia.</p>

          <h2 class="ac-h2"><span>📊</span> ¿Qué información ofrece?</h2>
          <div class="ac-features">
            <div class="tm-glass ac-feat">
              <span class="ac-feat-icon">🔴</span>
              <div class="ac-feat-title">Scores en vivo</div>
              <div class="ac-feat-desc">Resultados al minuto de todos los partidos en curso</div>
            </div>
            <div class="tm-glass ac-feat">
              <span class="ac-feat-icon">📋</span>
              <div class="ac-feat-title">Grupos</div>
              <div class="ac-feat-desc">Tabla de posiciones de los 12 grupos con estadísticas</div>
            </div>
            <div class="tm-glass ac-feat">
              <span class="ac-feat-icon">🏆</span>
              <div class="ac-feat-title">Bracket</div>
              <div class="ac-feat-desc">Cuadro eliminatorio desde 32avos hasta la final</div>
            </div>
            <div class="tm-glass ac-feat">
              <span class="ac-feat-icon">👟</span>
              <div class="ac-feat-title">Goleadores</div>
              <div class="ac-feat-desc">Tabla de máximos anotadores actualizada</div>
            </div>
          </div>

          <h2 class="ac-h2"><span>⚙️</span> Tecnología</h2>
          <p class="ac-p">TuMundial26 está construido con tecnologías modernas de desarrollo web:</p>
          <div class="ac-tech">
            <div class="ac-tech-chip"><span class="icon">🅰️</span><span class="label">Angular 21</span></div>
            <div class="ac-tech-chip"><span class="icon">☁️</span><span class="label">Cloudflare Pages</span></div>
            <div class="ac-tech-chip"><span class="icon">⚡</span><span class="label">TypeScript</span></div>
            <div class="ac-tech-chip"><span class="icon">🎨</span><span class="label">CSS personalizado</span></div>
            <div class="ac-tech-chip"><span class="icon">📡</span><span class="label">API-Football</span></div>
          </div>
          <p class="ac-p">La aplicación utiliza <b>Angular Signals</b> para el manejo reactivo del estado,
          carga perezosa (lazy loading) de módulos, y un sistema de caché en navegador para minimizar
          las llamadas a la API y ofrecer una experiencia fluida.</p>

          <h2 class="ac-h2"><span>📡</span> Fuentes de datos</h2>
          <p class="ac-p">Los datos deportivos son provistos por:</p>
          <ul style="padding-left:20px;margin-bottom:16px;">
            <li class="ac-p" style="margin-bottom:6px;"><b>API-Football</b> (api-sports.io) — estadísticas en vivo,
            posiciones, goleadores, alineaciones y eventos de partido.</li>
            <li class="ac-p" style="margin-bottom:6px;"><b>openfootball</b> — base de datos abierta con información
            estructurada sobre competiciones, equipos y jugadores de fútbol.</li>
          </ul>
          <p class="ac-p">TuMundial26 es un proyecto <b>independiente y no oficial</b>. No tiene afiliación
          con FIFA, ni con las federaciones nacionales de fútbol participantes.</p>

        } @else {

          <h2 class="ac-h2"><span>⚽</span> What is TuMundial26?</h2>
          <p class="ac-p"><b>TuMundial26</b> is an independent tracker for the <b>FIFA World Cup 2026</b>,
          built by a team of football enthusiasts and web developers. Our goal is to provide a clean, fast,
          and clutter-free experience for following the biggest tournament in football history.</p>
          <p class="ac-p">The site is designed as a <b>single-page application</b> optimized for any device,
          with real-time data when the tournament is active and updated statistics throughout the competition.</p>

          <h2 class="ac-h2"><span>📊</span> What information does it offer?</h2>
          <div class="ac-features">
            <div class="tm-glass ac-feat">
              <span class="ac-feat-icon">🔴</span>
              <div class="ac-feat-title">Live Scores</div>
              <div class="ac-feat-desc">Minute-by-minute results for all ongoing matches</div>
            </div>
            <div class="tm-glass ac-feat">
              <span class="ac-feat-icon">📋</span>
              <div class="ac-feat-title">Groups</div>
              <div class="ac-feat-desc">Standings table for all 12 groups with statistics</div>
            </div>
            <div class="tm-glass ac-feat">
              <span class="ac-feat-icon">🏆</span>
              <div class="ac-feat-title">Bracket</div>
              <div class="ac-feat-desc">Knockout bracket from Round of 32 to the Final</div>
            </div>
            <div class="tm-glass ac-feat">
              <span class="ac-feat-icon">👟</span>
              <div class="ac-feat-title">Top Scorers</div>
              <div class="ac-feat-desc">Updated Golden Boot standings</div>
            </div>
          </div>

          <h2 class="ac-h2"><span>⚙️</span> Technology</h2>
          <p class="ac-p">TuMundial26 is built with modern web development technologies:</p>
          <div class="ac-tech">
            <div class="ac-tech-chip"><span class="icon">🅰️</span><span class="label">Angular 21</span></div>
            <div class="ac-tech-chip"><span class="icon">☁️</span><span class="label">Cloudflare Pages</span></div>
            <div class="ac-tech-chip"><span class="icon">⚡</span><span class="label">TypeScript</span></div>
            <div class="ac-tech-chip"><span class="icon">🎨</span><span class="label">Custom CSS</span></div>
            <div class="ac-tech-chip"><span class="icon">📡</span><span class="label">API-Football</span></div>
          </div>
          <p class="ac-p">The application uses <b>Angular Signals</b> for reactive state management,
          lazy loading of modules, and a browser cache system to minimize API calls and offer
          a smooth experience.</p>

          <h2 class="ac-h2"><span>📡</span> Data Sources</h2>
          <p class="ac-p">Sports data is provided by:</p>
          <ul style="padding-left:20px;margin-bottom:16px;">
            <li class="ac-p" style="margin-bottom:6px;"><b>API-Football</b> (api-sports.io) — live statistics,
            standings, top scorers, lineups, and match events.</li>
            <li class="ac-p" style="margin-bottom:6px;"><b>openfootball</b> — open database with structured
            information about competitions, teams, and players.</li>
          </ul>
          <p class="ac-p">TuMundial26 is an <b>independent and unofficial</b> project. It has no affiliation
          with FIFA or any participating national football federation.</p>
        }

        <hr class="ac-divider">

        <!-- El Mundial 2026 - bilingual -->
        <div class="ac-badge">FIFA World Cup 2026</div>
        <h2 class="ac-h2"><span>🌎</span> {{ data.lang() === 'es' ? 'El Mundial 2026' : 'The 2026 World Cup' }}</h2>

        <div class="ac-wc-cards">
          <div class="tm-glass ac-wc-card g">
            <div class="ac-wc-num">48</div>
            <div class="ac-wc-lbl">{{ data.lang() === 'es' ? 'Selecciones participantes' : 'Participating nations' }}</div>
          </div>
          <div class="tm-glass ac-wc-card gold">
            <div class="ac-wc-num">104</div>
            <div class="ac-wc-lbl">{{ data.lang() === 'es' ? 'Partidos totales' : 'Total matches' }}</div>
          </div>
          <div class="tm-glass ac-wc-card red">
            <div class="ac-wc-num">16</div>
            <div class="ac-wc-lbl">{{ data.lang() === 'es' ? 'Estadios en 3 países' : 'Stadiums in 3 countries' }}</div>
          </div>
        </div>

        @if (data.lang() === 'es') {
          <p class="ac-p">El <b>FIFA World Cup 2026</b> representa un hito sin precedentes en la historia
          del fútbol. Por primera vez, el torneo se disputa con <b>48 selecciones nacionales</b>, ampliando
          la participación de cada confederación y dando oportunidad a naciones que nunca han disputado
          un Mundial.</p>
          <p class="ac-p">La <b>fase de grupos</b> consta de 12 grupos de 4 equipos. Los dos primeros de
          cada grupo avanzan directamente a la ronda de 32, junto con los 8 mejores terceros clasificados.
          La <b>fase eliminatoria</b> comienza con el inédito Round of 32, seguido por octavos, cuartos,
          semifinales y la gran final.</p>
          <p class="ac-p">El <b>partido inaugural</b> se disputará el <b>11 de junio de 2026</b> en el
          <b>Estadio Azteca</b> de Ciudad de México, entre la selección anfitriona de <b>México</b> y
          <b>Sudáfrica</b>. La <b>final</b> está programada para el <b>19 de julio de 2026</b> en el
          <b>MetLife Stadium</b> en las afueras de Nueva York.</p>
        } @else {
          <p class="ac-p">The <b>FIFA World Cup 2026</b> represents an unprecedented milestone in football
          history. For the first time, the tournament features <b>48 national teams</b>, expanding
          participation across every confederation and giving nations that have never played in a World Cup
          their chance to shine.</p>
          <p class="ac-p">The <b>group stage</b> consists of 12 groups of 4 teams. The top two from each
          group advance directly to the Round of 32, along with the 8 best third-placed teams. The
          <b>knockout stage</b> begins with the unprecedented Round of 32, followed by the Round of 16,
          quarterfinals, semifinals, and the grand final.</p>
          <p class="ac-p">The <b>opening match</b> will take place on <b>June 11, 2026</b> at the
          <b>Estadio Azteca</b> in Mexico City, between host nation <b>Mexico</b> and
          <b>South Africa</b>. The <b>final</b> is scheduled for <b>July 19, 2026</b> at
          <b>MetLife Stadium</b> outside New York.</p>
        }

        <hr class="ac-divider">

        <h2 class="ac-h2"><span>🏟️</span> {{ data.lang() === 'es' ? 'Los 16 Estadios' : 'The 16 Stadiums' }}</h2>
        <p class="ac-p">{{ data.lang() === 'es'
          ? 'El torneo se disputará en 16 estadios repartidos entre los tres países anfitriones:'
          : 'The tournament will be played across 16 stadiums spread across the three host nations:' }}</p>

        <table class="ac-stadiums">
          <thead>
            <tr>
              <th></th>
              <th>{{ data.lang() === 'es' ? 'Estadio' : 'Stadium' }}</th>
              <th>{{ data.lang() === 'es' ? 'Ciudad' : 'City' }}</th>
              <th>{{ data.lang() === 'es' ? 'País' : 'Country' }}</th>
              <th>{{ data.lang() === 'es' ? 'Cap.' : 'Cap.' }}</th>
            </tr>
          </thead>
          <tbody>
            @for (s of stadiums; track s.name; let i = $index) {
              <tr>
                <td class="flag">{{ s.flag }}</td>
                <td class="name">{{ s.name }}</td>
                <td>{{ data.lang() === 'es' ? s.city_es : s.city_en }}</td>
                <td>{{ data.lang() === 'es' ? s.country_es : s.country_en }}</td>
                <td>{{ s.capacity }}</td>
              </tr>
            }
          </tbody>
        </table>
      </main>
      <app-footer />
    </div>
  `,
})
export class AcercaComponent {
  data = inject(TmDataService);

  readonly stadiums: Stadium[] = [
    { name: 'Estadio Azteca',         city_es: 'Ciudad de México', city_en: 'Mexico City',      country_es: 'México',         country_en: 'Mexico',  flag: '🇲🇽', capacity: '87,523' },
    { name: 'Estadio Akron',          city_es: 'Guadalajara',      city_en: 'Guadalajara',       country_es: 'México',         country_en: 'Mexico',  flag: '🇲🇽', capacity: '49,850' },
    { name: 'Estadio BBVA',           city_es: 'Monterrey',        city_en: 'Monterrey',         country_es: 'México',         country_en: 'Mexico',  flag: '🇲🇽', capacity: '51,348' },
    { name: 'MetLife Stadium',        city_es: 'Nueva York/NJ',    city_en: 'New York/New Jersey',country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '82,500' },
    { name: 'AT&T Stadium',           city_es: 'Dallas',           city_en: 'Dallas',            country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '80,000' },
    { name: 'SoFi Stadium',           city_es: 'Los Ángeles',      city_en: 'Los Angeles',       country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '70,240' },
    { name: 'Levi\'s Stadium',        city_es: 'San Francisco',    city_en: 'San Francisco Bay', country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '68,500' },
    { name: 'Hard Rock Stadium',      city_es: 'Miami',            city_en: 'Miami',             country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '65,326' },
    { name: 'Arrowhead Stadium',      city_es: 'Kansas City',      city_en: 'Kansas City',       country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '76,416' },
    { name: 'Lincoln Financial Field',city_es: 'Filadelfia',       city_en: 'Philadelphia',      country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '69,796' },
    { name: 'Lumen Field',            city_es: 'Seattle',          city_en: 'Seattle',           country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '68,740' },
    { name: 'Gillette Stadium',       city_es: 'Boston',           city_en: 'Boston',            country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '65,878' },
    { name: 'Allegiant Stadium',      city_es: 'Las Vegas',        city_en: 'Las Vegas',         country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '65,000' },
    { name: 'Mercedes-Benz Stadium',  city_es: 'Atlanta',          city_en: 'Atlanta',           country_es: 'EUA',            country_en: 'USA',     flag: '🇺🇸', capacity: '71,000' },
    { name: 'BC Place',               city_es: 'Vancouver',        city_en: 'Vancouver',         country_es: 'Canadá',         country_en: 'Canada',  flag: '🇨🇦', capacity: '54,500' },
    { name: 'BMO Field',              city_es: 'Toronto',          city_en: 'Toronto',           country_es: 'Canadá',         country_en: 'Canada',  flag: '🇨🇦', capacity: '45,736' },
  ];
}
