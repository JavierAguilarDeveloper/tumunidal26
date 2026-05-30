import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TmDataService } from '../../core/services/tm-data.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { BackdropComponent } from '../../shared/backdrop/backdrop.component';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, BackdropComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .pg-root{min-height:100vh;background:var(--tm-bg);}
    .pg-main{max-width:800px;margin:0 auto;padding:110px 24px 80px;}
    .pg-back{display:inline-flex;align-items:center;gap:8px;font:600 13px/1 var(--ff-mono);color:var(--txt-2);
      text-decoration:none;letter-spacing:.04em;padding:9px 14px;border-radius:10px;border:1px solid var(--glass-brd);
      background:var(--glass);transition:all .15s;margin-bottom:36px;}
    .pg-back:hover{color:var(--txt);background:var(--glass-2);}
    .pg-h1{font:800 38px/1.1 var(--ff-sans);letter-spacing:-.02em;color:var(--txt);margin-bottom:8px;}
    .pg-meta{font:500 13px/1 var(--ff-mono);color:var(--mut);margin-bottom:40px;letter-spacing:.03em;}
    .pg-h2{font:700 20px/1.2 var(--ff-sans);color:var(--txt);margin:36px 0 14px;}
    .pg-p{font:400 16px/1.8 var(--ff-sans);color:var(--txt-2);margin-bottom:16px;}
    .pg-p b{color:var(--txt);}
    .pg-p a{color:var(--green);text-decoration:none;}
    .pg-p a:hover{text-decoration:underline;}
    .pg-ul{padding-left:20px;margin-bottom:16px;}
    .pg-ul li{font:400 16px/1.9 var(--ff-sans);color:var(--txt-2);}
    .pg-ul li b{color:var(--txt);}
    .pg-divider{border:none;border-top:1px solid var(--glass-brd);margin:40px 0;}
    .pg-badge{display:inline-block;font:700 11px/1 var(--ff-mono);letter-spacing:.1em;text-transform:uppercase;
      padding:5px 10px;border-radius:7px;background:var(--glass);border:1px solid var(--glass-brd);
      color:var(--txt-2);margin-bottom:6px;}
  `],
  template: `
    <div class="pg-root">
      <app-backdrop />
      <app-navbar />
      <main class="pg-main">
        <a class="pg-back" routerLink="/">← {{ data.lang() === 'es' ? 'Volver al inicio' : 'Back to home' }}</a>

        @if (data.lang() === 'es') {
          <div class="pg-badge">Política de Privacidad</div>
          <h1 class="pg-h1">Política de Privacidad</h1>
          <p class="pg-meta">Última actualización: 30 de mayo de 2026 · tumundial26.com</p>

          <p class="pg-p">En <b>TuMundial26</b> (en adelante, "el Sitio", accesible en <b>tumundial26.com</b>),
          respetamos y protegemos la privacidad de nuestros visitantes. Esta política describe qué información
          recopilamos, cómo la utilizamos y qué opciones tienes al respecto.</p>

          <h2 class="pg-h2">1. Información que recopilamos</h2>
          <p class="pg-p">TuMundial26 es un sitio de consulta deportiva. <b>No recopilamos información personal
          identificable</b> directamente, como nombres, direcciones de correo electrónico o números de teléfono,
          a través de la navegación ordinaria del sitio.</p>
          <p class="pg-p">Sin embargo, como ocurre con la mayoría de los sitios web, ciertos datos pueden
          recopilarse automáticamente:</p>
          <ul class="pg-ul">
            <li><b>Datos de uso:</b> tipo de navegador, páginas visitadas, tiempo de visita, dirección IP anonimizada.</li>
            <li><b>Cookies técnicas:</b> pequeños archivos de texto almacenados en tu dispositivo para garantizar
            el correcto funcionamiento del sitio (por ejemplo, tu preferencia de idioma ES/EN).</li>
            <li><b>Cookies publicitarias:</b> utilizadas por Google AdSense para mostrar anuncios relevantes
            (ver sección 3).</li>
          </ul>

          <h2 class="pg-h2">2. Cookies</h2>
          <p class="pg-p">Utilizamos cookies propias y de terceros. Las cookies propias incluyen:</p>
          <ul class="pg-ul">
            <li><b>tm-lang:</b> almacena tu preferencia de idioma (español o inglés). Expira al cerrar el navegador.</li>
          </ul>
          <p class="pg-p">Las cookies de terceros son gestionadas por servicios externos que operan en el sitio.
          No controlamos estas cookies. Puedes desactivarlas desde la configuración de tu navegador.</p>

          <h2 class="pg-h2">3. Google AdSense</h2>
          <p class="pg-p">TuMundial26 utiliza <b>Google AdSense</b>, un servicio de publicidad de Google LLC,
          para mostrar anuncios. Google AdSense puede utilizar cookies para personalizar los anuncios según
          tus intereses y tus visitas anteriores a este y otros sitios web.</p>
          <p class="pg-p">Google puede utilizar la tecnología DoubleClick para servir anuncios a los usuarios
          y puede utilizar cookies para recopilar información sobre tus visitas a este y otros sitios. Esta
          información puede usarse para medir el rendimiento de los anuncios y personalizar el contenido publicitario.</p>
          <p class="pg-p">Puedes desactivar el uso de la cookie de DoubleClick de Google visitando
          <b>Google Ads Settings</b> (google.com/settings/ads). Consulta la
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">política de privacidad
          de Google</a> para más información.</p>

          <h2 class="pg-h2">4. Datos de terceros (API-Football y openfootball)</h2>
          <p class="pg-p">Los datos deportivos mostrados en TuMundial26 provienen de servicios de terceros:</p>
          <ul class="pg-ul">
            <li><b>API-Football</b> (api-sports.io): proveedor de estadísticas, resultados y standings del
            fútbol mundial. Sus datos se consumen a través de su API pública y están sujetos a sus propios
            términos de servicio.</li>
            <li><b>openfootball:</b> base de datos abierta con información estructurada sobre competiciones
            y equipos de fútbol.</li>
          </ul>
          <p class="pg-p">TuMundial26 no almacena estos datos de forma permanente en ningún servidor propio.
          Los datos se obtienen en tiempo real o en caché temporal del navegador del usuario.</p>

          <h2 class="pg-h2">5. Cómo usamos la información</h2>
          <p class="pg-p">La información recopilada se usa exclusivamente para:</p>
          <ul class="pg-ul">
            <li>Garantizar el correcto funcionamiento técnico del sitio.</li>
            <li>Recordar preferencias del usuario (idioma).</li>
            <li>Mostrar publicidad relevante a través de Google AdSense.</li>
            <li>Analizar el tráfico de forma anónima para mejorar la experiencia.</li>
          </ul>
          <p class="pg-p"><b>No vendemos, alquilamos ni compartimos información personal</b> con terceros
          con fines comerciales propios.</p>

          <h2 class="pg-h2">6. Tus derechos</h2>
          <p class="pg-p">Dependiendo de tu ubicación, puedes tener los siguientes derechos:</p>
          <ul class="pg-ul">
            <li>Acceder a los datos que tenemos sobre ti.</li>
            <li>Solicitar la corrección o eliminación de tus datos.</li>
            <li>Oponerte al tratamiento de tus datos con fines publicitarios.</li>
            <li>Desactivar las cookies desde la configuración de tu navegador.</li>
          </ul>

          <h2 class="pg-h2">7. Cambios a esta política</h2>
          <p class="pg-p">Podemos actualizar esta política de privacidad periódicamente. La fecha de la última
          actualización se indica al inicio de este documento. El uso continuado del sitio después de cualquier
          cambio constituye tu aceptación de la nueva política.</p>

          <h2 class="pg-h2">8. Contacto</h2>
          <p class="pg-p">Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:
          <a href="mailto:javieraguilardev@icloud.com">javieraguilardev&#64;icloud.com</a></p>

        } @else {

          <div class="pg-badge">Privacy Policy</div>
          <h1 class="pg-h1">Privacy Policy</h1>
          <p class="pg-meta">Last updated: May 30, 2026 · tumundial26.com</p>

          <p class="pg-p">At <b>TuMundial26</b> (hereinafter "the Site", accessible at <b>tumundial26.com</b>),
          we respect and protect the privacy of our visitors. This policy describes what information we collect,
          how we use it, and what choices you have.</p>

          <h2 class="pg-h2">1. Information We Collect</h2>
          <p class="pg-p">TuMundial26 is a sports information website. <b>We do not directly collect personally
          identifiable information</b> such as names, email addresses, or phone numbers through ordinary
          site browsing.</p>
          <p class="pg-p">However, as with most websites, certain data may be collected automatically:</p>
          <ul class="pg-ul">
            <li><b>Usage data:</b> browser type, pages visited, visit duration, anonymized IP address.</li>
            <li><b>Technical cookies:</b> small text files stored on your device to ensure the site functions
            correctly (e.g., your ES/EN language preference).</li>
            <li><b>Advertising cookies:</b> used by Google AdSense to display relevant ads (see Section 3).</li>
          </ul>

          <h2 class="pg-h2">2. Cookies</h2>
          <p class="pg-p">We use first-party and third-party cookies. First-party cookies include:</p>
          <ul class="pg-ul">
            <li><b>tm-lang:</b> stores your language preference (Spanish or English). Expires when you close the browser.</li>
          </ul>
          <p class="pg-p">Third-party cookies are managed by external services operating on the site.
          We do not control these cookies. You may disable them through your browser settings.</p>

          <h2 class="pg-h2">3. Google AdSense</h2>
          <p class="pg-p">TuMundial26 uses <b>Google AdSense</b>, an advertising service by Google LLC,
          to display ads. Google AdSense may use cookies to personalize ads based on your interests
          and your past visits to this and other websites.</p>
          <p class="pg-p">Google may use DoubleClick technology to serve ads and may use cookies to collect
          information about your visits to this and other sites. This information may be used to measure
          ad performance and personalize advertising content.</p>
          <p class="pg-p">You may opt out of Google's DoubleClick cookie by visiting
          <b>Google Ads Settings</b> (google.com/settings/ads). See
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google's privacy
          policy</a> for more information.</p>

          <h2 class="pg-h2">4. Third-Party Data (API-Football and openfootball)</h2>
          <p class="pg-p">Sports data displayed on TuMundial26 comes from third-party services:</p>
          <ul class="pg-ul">
            <li><b>API-Football</b> (api-sports.io): provider of football statistics, results, and standings
            consumed through their public API and subject to their own terms of service.</li>
            <li><b>openfootball:</b> open database with structured information about football competitions
            and teams.</li>
          </ul>
          <p class="pg-p">TuMundial26 does not permanently store this data on any own server.
          Data is obtained in real-time or in the user's browser temporary cache.</p>

          <h2 class="pg-h2">5. How We Use Information</h2>
          <p class="pg-p">Collected information is used exclusively to:</p>
          <ul class="pg-ul">
            <li>Ensure the technical functioning of the site.</li>
            <li>Remember user preferences (language).</li>
            <li>Display relevant advertising through Google AdSense.</li>
            <li>Analyze traffic anonymously to improve the experience.</li>
          </ul>
          <p class="pg-p"><b>We do not sell, rent, or share personal information</b> with third parties
          for our own commercial purposes.</p>

          <h2 class="pg-h2">6. Your Rights</h2>
          <p class="pg-p">Depending on your location, you may have the following rights:</p>
          <ul class="pg-ul">
            <li>Access the data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Object to processing of your data for advertising purposes.</li>
            <li>Disable cookies through your browser settings.</li>
          </ul>

          <h2 class="pg-h2">7. Changes to This Policy</h2>
          <p class="pg-p">We may update this privacy policy periodically. The last update date is shown
          at the top of this document. Continued use of the site after any changes constitutes your
          acceptance of the new policy.</p>

          <h2 class="pg-h2">8. Contact</h2>
          <p class="pg-p">If you have questions about this privacy policy, you may contact us at:
          <a href="mailto:javieraguilardev@icloud.com">javieraguilardev&#64;icloud.com</a></p>
        }
      </main>
      <app-footer />
    </div>
  `,
})
export class PrivacidadComponent {
  data = inject(TmDataService);
}
