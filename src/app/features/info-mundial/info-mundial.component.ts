import { Component, inject, ViewEncapsulation } from '@angular/core';
import { TmDataService } from '../../core/services/tm-data.service';

@Component({
  selector: 'app-info-mundial',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .im-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin:32px 0;}
    .im-card{padding:28px 24px;border-radius:20px;display:flex;flex-direction:column;gap:12px;text-align:center;}
    .im-card-icon{font-size:40px;line-height:1;}
    .im-card-num{font:800 48px/1 var(--ff-sans);letter-spacing:-.03em;color:var(--green);font-variant-numeric:tabular-nums;}
    .im-card-lbl{font:700 13px/1.3 var(--ff-mono);color:var(--txt-2);letter-spacing:.06em;text-transform:uppercase;}
    .im-card-desc{font:500 13px/1.5 var(--ff-sans);color:var(--mut);}
    .im-body{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;align-items:start;}
    .im-text p{font:500 16px/1.8 var(--ff-sans);color:var(--txt-2);margin-bottom:18px;}
    .im-text p:last-child{margin-bottom:0;}
    .im-highlight{padding:20px 24px;border-radius:16px;border-left:3px solid var(--green);}
    .im-highlight b{color:var(--green);}
    .im-opening{display:flex;flex-direction:column;gap:20px;}
    .im-match{padding:22px 20px;border-radius:18px;display:flex;flex-direction:column;gap:10px;}
    .im-match-badge{font:700 10px/1 var(--ff-mono);letter-spacing:.16em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:8px;}
    .im-match-badge::before{content:"";display:block;width:8px;height:8px;border-radius:50%;background:var(--gold);}
    .im-match-teams{font:800 20px/1.2 var(--ff-sans);color:var(--txt);}
    .im-match-detail{font:500 13px/1 var(--ff-mono);color:var(--mut);}
    .im-facts{display:flex;flex-direction:column;gap:10px;margin-top:6px;}
    .im-fact{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border-radius:12px;background:var(--glass);}
    .im-fact-icon{font-size:18px;flex:0 0 auto;margin-top:1px;}
    .im-fact-text{font:500 13px/1.5 var(--ff-sans);color:var(--txt-2);}
    .im-fact-text b{color:var(--txt);}
    @media(max-width:860px){.im-body{grid-template-columns:1fr;gap:24px;}}
    @media(max-width:500px){.im-cards{grid-template-columns:1fr;}}
  `],
  template: `
    <section class="sec" id="info-mundial"
      style="background:linear-gradient(180deg,transparent,rgba(0,255,135,.03),transparent)">
      <div class="sec-head">
        <div class="sh-l">
          <span class="sh-eye">05</span>
          <h2>{{ data.lang() === 'es' ? 'El Mundial más grande de la historia' : 'The Greatest World Cup in History' }}</h2>
          <p>{{ data.lang() === 'es'
            ? 'Primera edición con 48 selecciones · 3 países anfitriones · 104 partidos'
            : 'First edition with 48 teams · 3 host countries · 104 matches' }}</p>
        </div>
      </div>

      <div class="im-cards">
        <div class="tm-glass im-card">
          <div class="im-card-icon">🌍</div>
          <div class="im-card-num">48</div>
          <div class="im-card-lbl">{{ data.lang() === 'es' ? 'Selecciones' : 'Nations' }}</div>
          <div class="im-card-desc">{{ data.lang() === 'es'
            ? 'La primera edición con 48 equipos de todo el mundo'
            : 'First ever edition with 48 teams worldwide' }}</div>
        </div>
        <div class="tm-glass im-card">
          <div class="im-card-icon">⚽</div>
          <div class="im-card-num">104</div>
          <div class="im-card-lbl">{{ data.lang() === 'es' ? 'Partidos' : 'Matches' }}</div>
          <div class="im-card-desc">{{ data.lang() === 'es'
            ? '39 días de fútbol ininterrumpido en 3 países'
            : '39 days of non-stop football across 3 nations' }}</div>
        </div>
        <div class="tm-glass im-card">
          <div class="im-card-icon">🏟️</div>
          <div class="im-card-num">16</div>
          <div class="im-card-lbl">{{ data.lang() === 'es' ? 'Estadios' : 'Stadiums' }}</div>
          <div class="im-card-desc">{{ data.lang() === 'es'
            ? 'En México, Estados Unidos y Canadá'
            : 'Across Mexico, United States, and Canada' }}</div>
        </div>
      </div>

      <div class="im-body">
        <div class="im-text">
          @if (data.lang() === 'es') {
            <p>El <b style="color:var(--txt)">FIFA World Cup 2026</b> es el torneo más ambicioso en la historia del fútbol mundial.
            Por primera vez, la competencia se expande a <b style="color:var(--txt)">48 selecciones nacionales</b>, reuniendo a las mejores
            naciones de los seis continentes en una celebración sin precedentes del deporte más popular del planeta.</p>
            <p>Con <b style="color:var(--txt)">104 partidos</b> disputados a lo largo de 39 días, el torneo recorre 16 estadios
            en tres países anfitriones: <b style="color:var(--txt)">México</b>, sede del primer partido inaugural;
            <b style="color:var(--txt)">Estados Unidos</b>, con 11 sedes incluyendo el MetLife Stadium para la final;
            y <b style="color:var(--txt)">Canadá</b>, que debuta como país organizador de un Mundial masculino.</p>
            <div class="tm-glass im-highlight">
              <b>Fase de grupos reformada:</b> 12 grupos de 4 equipos cada uno.
              Los dos primeros de cada grupo y los 8 mejores terceros avanzan a la ronda de 32.
              Un formato diseñado para garantizar que más selecciones experimenten el sueño mundialista.
            </div>
          } @else {
            <p>The <b style="color:var(--txt)">FIFA World Cup 2026</b> is the most ambitious tournament in football history.
            For the first time, the competition expands to <b style="color:var(--txt)">48 national teams</b>, bringing together
            the best nations from all six continents in an unprecedented celebration of the world's most popular sport.</p>
            <p>With <b style="color:var(--txt)">104 matches</b> played over 39 days, the tournament spans 16 stadiums
            across three host countries: <b style="color:var(--txt)">Mexico</b>, home of the opening match;
            <b style="color:var(--txt)">United States</b>, with 11 venues including MetLife Stadium for the final;
            and <b style="color:var(--txt)">Canada</b>, making its debut as a men's World Cup host nation.</p>
            <div class="tm-glass im-highlight">
              <b>Redesigned group stage:</b> 12 groups of 4 teams each.
              The top two from each group and the 8 best third-place teams advance to the round of 32.
              A format designed to give more nations the World Cup dream experience.
            </div>
          }
        </div>

        <div class="im-opening">
          <div class="tm-glass im-match">
            <div class="im-match-badge">{{ data.lang() === 'es' ? 'Partido Inaugural' : 'Opening Match' }}</div>
            <div class="im-match-teams">🇲🇽 México vs Sudáfrica 🇿🇦</div>
            <div class="im-match-detail">11 Jun 2026 · 13:00 CDMX · Estadio Azteca</div>
          </div>
          <div class="im-facts">
            <div class="im-fact">
              <span class="im-fact-icon">🏆</span>
              <div class="im-fact-text">
                <b>{{ data.lang() === 'es' ? 'Final' : 'Final' }}:</b>
                {{ data.lang() === 'es' ? '19 julio 2026 · MetLife Stadium, Nueva York/Nueva Jersey' : 'July 19, 2026 · MetLife Stadium, New York/New Jersey' }}
              </div>
            </div>
            <div class="im-fact">
              <span class="im-fact-icon">📍</span>
              <div class="im-fact-text">
                <b>{{ data.lang() === 'es' ? 'Países sede' : 'Host countries' }}:</b>
                {{ data.lang() === 'es' ? 'México (3 estadios) · EUA (11 estadios) · Canadá (2 estadios)' : 'Mexico (3 venues) · USA (11 venues) · Canada (2 venues)' }}
              </div>
            </div>
            <div class="im-fact">
              <span class="im-fact-icon">⚽</span>
              <div class="im-fact-text">
                <b>{{ data.lang() === 'es' ? 'Balón oficial' : 'Official ball' }}:</b>
                Adidas FUSSBALLLIEBE 2026
              </div>
            </div>
            <div class="im-fact">
              <span class="im-fact-icon">📺</span>
              <div class="im-fact-text">
                <b>{{ data.lang() === 'es' ? 'Audiencia esperada' : 'Expected audience' }}:</b>
                {{ data.lang() === 'es' ? 'Más de 5 mil millones de espectadores' : 'Over 5 billion viewers worldwide' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class InfoMundialComponent {
  data = inject(TmDataService);
}
