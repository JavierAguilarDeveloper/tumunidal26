import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-backdrop',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .tm-bg{position:fixed;inset:0;z-index:-1;background:#0a0a0f;overflow:hidden;}
    .tm-bg::before{content:"";position:absolute;inset:-25%;
      background:radial-gradient(38% 44% at 18% 16%,rgba(28,32,86,.55),transparent 60%),
        radial-gradient(40% 46% at 84% 80%,rgba(46,22,74,.5),transparent 62%),
        radial-gradient(30% 36% at 70% 12%,rgba(0,72,60,.34),transparent 60%);
      animation:tm-bg-drift 26s ease-in-out infinite alternate;filter:blur(8px);}
    @keyframes tm-bg-drift{
      0%{transform:translate(0,0) scale(1);}
      50%{transform:translate(-3%,2%) scale(1.06);}
      100%{transform:translate(3%,-2%) scale(1.04);}
    }
    .tm-bg::after{content:"";position:absolute;inset:0;
      background-image:radial-gradient(rgba(255,255,255,.5) .5px,transparent .5px);
      background-size:38px 38px;opacity:.025;}
  `],
  template: `<div class="tm-bg" aria-hidden="true"></div>`,
})
export class BackdropComponent {}
