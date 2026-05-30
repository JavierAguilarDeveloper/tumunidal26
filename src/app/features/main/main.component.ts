import { Component, inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TmDataService } from '../../core/services/tm-data.service';
import { BackdropComponent } from '../../shared/backdrop/backdrop.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeroComponent } from '../hero/hero.component';
import { PartidosComponent } from '../partidos/partidos.component';
import { GruposComponent } from '../grupos/grupos.component';
import { GoleadoresComponent } from '../goleadores/goleadores.component';
import { InfoMundialComponent } from '../info-mundial/info-mundial.component';
import { BracketComponent } from '../bracket/bracket.component';

@Component({
  selector: 'app-main',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    BackdropComponent, NavbarComponent, FooterComponent,
    HeroComponent, PartidosComponent, GruposComponent,
    GoleadoresComponent, InfoMundialComponent, BracketComponent,
  ],
  template: `
    <app-backdrop />
    <app-navbar />
    <main style="min-height:100vh">
      <app-hero />
      <app-partidos />
      <app-grupos />
      <app-goleadores />
      <app-info-mundial />
      <app-bracket />
    </main>
    <app-footer />
  `,
})
export class MainComponent implements OnInit, OnDestroy {
  private data = inject(TmDataService);
  private interval?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.interval = setInterval(() => {
      this.data.matches.update(prev => prev.map(m => {
        if (m.status !== 'live') return m;
        const min = Math.min(95, (m.min ?? 0) + 1);
        let hs = m.hs ?? 0, as_ = m.as ?? 0;
        if (Math.random() < 0.04) { if (Math.random() < 0.5) hs++; else as_++; }
        return { ...m, min, hs, as: as_ };
      }));
    }, 5000);
  }

  ngOnDestroy() { clearInterval(this.interval); }
}
