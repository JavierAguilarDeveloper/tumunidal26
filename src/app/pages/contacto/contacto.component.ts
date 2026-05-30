import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TmDataService } from '../../core/services/tm-data.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { BackdropComponent } from '../../shared/backdrop/backdrop.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [RouterLink, FormsModule, NavbarComponent, FooterComponent, BackdropComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .ct-root{min-height:100vh;background:var(--tm-bg);}
    .ct-main{max-width:640px;margin:0 auto;padding:110px 24px 80px;}
    .ct-back{display:inline-flex;align-items:center;gap:8px;font:600 13px/1 var(--ff-mono);color:var(--txt-2);
      text-decoration:none;letter-spacing:.04em;padding:9px 14px;border-radius:10px;border:1px solid var(--glass-brd);
      background:var(--glass);transition:all .15s;margin-bottom:36px;}
    .ct-back:hover{color:var(--txt);background:var(--glass-2);}
    .ct-badge{display:inline-block;font:700 11px/1 var(--ff-mono);letter-spacing:.1em;text-transform:uppercase;
      padding:5px 10px;border-radius:7px;background:var(--glass);border:1px solid var(--glass-brd);
      color:var(--txt-2);margin-bottom:6px;}
    .ct-h1{font:800 38px/1.1 var(--ff-sans);letter-spacing:-.02em;color:var(--txt);margin-bottom:8px;}
    .ct-sub{font:500 13px/1.5 var(--ff-mono);color:var(--mut);margin-bottom:40px;letter-spacing:.02em;}
    .ct-info{display:flex;flex-direction:column;gap:14px;margin-bottom:40px;}
    .ct-info-row{display:flex;align-items:flex-start;gap:14px;padding:16px 18px;border-radius:14px;
      background:var(--glass);border:1px solid var(--glass-brd);}
    .ct-info-icon{font-size:20px;flex:0 0 auto;margin-top:2px;}
    .ct-info-body{}
    .ct-info-label{font:700 11px/1 var(--ff-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--mut);margin-bottom:5px;}
    .ct-info-val{font:500 14px/1.4 var(--ff-sans);color:var(--txt-2);}
    .ct-info-val a{color:var(--green);text-decoration:none;}
    .ct-info-val a:hover{text-decoration:underline;}
    .ct-form{display:flex;flex-direction:column;gap:20px;}
    .ct-group{display:flex;flex-direction:column;gap:8px;}
    .ct-label{font:600 12px/1 var(--ff-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--txt-2);}
    .ct-input,.ct-textarea{width:100%;padding:14px 16px;border-radius:12px;border:1px solid var(--glass-brd);
      background:var(--glass);color:var(--txt);font:500 15px/1 var(--ff-sans);
      transition:border-color .15s,background .15s;box-sizing:border-box;outline:none;}
    .ct-input:focus,.ct-textarea:focus{border-color:var(--green);background:rgba(0,255,135,.04);}
    .ct-input::placeholder,.ct-textarea::placeholder{color:var(--mut);}
    .ct-textarea{min-height:140px;resize:vertical;line-height:1.6;}
    .ct-btn{padding:14px 28px;border-radius:12px;border:none;cursor:pointer;font:700 14px/1 var(--ff-sans);
      background:linear-gradient(135deg,#26ff9b,#00d46e);color:#04130b;
      transition:opacity .15s,transform .1s;letter-spacing:.02em;align-self:flex-start;}
    .ct-btn:hover{opacity:.88;transform:translateY(-1px);}
    .ct-btn:active{transform:translateY(0);}
    .ct-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
    .ct-success{padding:28px 24px;border-radius:16px;border:1px solid rgba(0,255,135,.3);
      background:rgba(0,255,135,.06);text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center;}
    .ct-success-icon{font-size:40px;}
    .ct-success-title{font:800 20px/1 var(--ff-sans);color:var(--txt);}
    .ct-success-sub{font:500 14px/1.5 var(--ff-sans);color:var(--txt-2);}
    .ct-divider{border:none;border-top:1px solid var(--glass-brd);margin:36px 0;}
    .ct-h2{font:700 18px/1.2 var(--ff-sans);color:var(--txt);margin-bottom:14px;}
    .ct-p{font:400 15px/1.8 var(--ff-sans);color:var(--txt-2);}
  `],
  template: `
    <div class="ct-root">
      <app-backdrop />
      <app-navbar />
      <main class="ct-main">
        <a class="ct-back" routerLink="/">← {{ data.lang() === 'es' ? 'Volver al inicio' : 'Back to home' }}</a>

        <div class="ct-badge">{{ data.lang() === 'es' ? 'Contacto' : 'Contact' }}</div>
        <h1 class="ct-h1">{{ data.lang() === 'es' ? 'Contacto' : 'Get in touch' }}</h1>
        <p class="ct-sub">{{ data.lang() === 'es'
          ? 'TuMundial26 es un proyecto independiente creado por aficionados al fútbol y la tecnología.'
          : 'TuMundial26 is an independent project created by football and technology enthusiasts.' }}</p>

        <div class="ct-info">
          <div class="ct-info-row">
            <span class="ct-info-icon">✉️</span>
            <div class="ct-info-body">
              <div class="ct-info-label">Email</div>
              <div class="ct-info-val">
                <a href="mailto:javieraguilardev@icloud.com">javieraguilardev&#64;icloud.com</a>
              </div>
            </div>
          </div>
          <div class="ct-info-row">
            <span class="ct-info-icon">🌐</span>
            <div class="ct-info-body">
              <div class="ct-info-label">{{ data.lang() === 'es' ? 'Sitio web' : 'Website' }}</div>
              <div class="ct-info-val">tumundial26.com</div>
            </div>
          </div>
          <div class="ct-info-row">
            <span class="ct-info-icon">⚽</span>
            <div class="ct-info-body">
              <div class="ct-info-label">{{ data.lang() === 'es' ? 'Sobre el proyecto' : 'About the project' }}</div>
              <div class="ct-info-val">{{ data.lang() === 'es'
                ? 'Rastreador independiente del Mundial FIFA 2026. No afiliado a FIFA ni a ninguna federación.'
                : 'Independent FIFA World Cup 2026 tracker. Not affiliated with FIFA or any federation.' }}</div>
            </div>
          </div>
        </div>

        <hr class="ct-divider">

        @if (!sent()) {
          <h2 class="ct-h2">{{ data.lang() === 'es' ? 'Envíanos un mensaje' : 'Send us a message' }}</h2>
          <form class="ct-form" (ngSubmit)="onSubmit()">
            <div class="ct-group">
              <label class="ct-label" for="ct-nombre">{{ data.lang() === 'es' ? 'Nombre' : 'Name' }}</label>
              <input id="ct-nombre" class="ct-input" type="text" name="nombre"
                [(ngModel)]="form.nombre"
                [placeholder]="data.lang() === 'es' ? 'Tu nombre' : 'Your name'"
                required>
            </div>
            <div class="ct-group">
              <label class="ct-label" for="ct-email">Email</label>
              <input id="ct-email" class="ct-input" type="email" name="email"
                [(ngModel)]="form.email"
                [placeholder]="data.lang() === 'es' ? 'tu@email.com' : 'you@email.com'"
                required>
            </div>
            <div class="ct-group">
              <label class="ct-label" for="ct-msg">{{ data.lang() === 'es' ? 'Mensaje' : 'Message' }}</label>
              <textarea id="ct-msg" class="ct-textarea" name="mensaje"
                [(ngModel)]="form.mensaje"
                [placeholder]="data.lang() === 'es' ? '¿En qué podemos ayudarte?' : 'How can we help you?'"
                required></textarea>
            </div>
            <button class="ct-btn" type="submit"
              [disabled]="!form.nombre || !form.email || !form.mensaje">
              {{ data.lang() === 'es' ? 'Enviar mensaje' : 'Send message' }}
            </button>
          </form>
        } @else {
          <div class="ct-success">
            <span class="ct-success-icon">✅</span>
            <div class="ct-success-title">{{ data.lang() === 'es' ? '¡Gracias por tu mensaje!' : 'Thanks for your message!' }}</div>
            <div class="ct-success-sub">{{ data.lang() === 'es'
              ? 'Hemos recibido tu mensaje. Te responderemos en los próximos días.'
              : 'We received your message. We\'ll get back to you in the next few days.' }}</div>
          </div>
        }
      </main>
      <app-footer />
    </div>
  `,
})
export class ContactoComponent {
  data = inject(TmDataService);

  sent = signal(false);
  form = { nombre: '', email: '', mensaje: '' };

  onSubmit() {
    if (this.form.nombre && this.form.email && this.form.mensaje) {
      this.sent.set(true);
    }
  }
}
