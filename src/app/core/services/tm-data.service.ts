import { Injectable, signal, computed } from '@angular/core';

export interface Team { flag: string; es: string; en: string; color: string; }
export interface Match {
  id: string; grp: string; home: string; away: string;
  status: 'live' | 'ft' | 'upcoming'; hs?: number; as?: number; min?: number; inMin?: number; kickoff?: number;
}
export interface Scorer { code: string; name: string; goals: number; sub: string; }
export interface Standing { code: string; w: number; d: number; l: number; gf: number; ga: number; pj: number; gd: number; pts: number; teamName?: string; teamLogo?: string; }

@Injectable({ providedIn: 'root' })
export class TmDataService {
  readonly TEAMS: Record<string, Team> = {
    MEX:{flag:'🇲🇽',es:'México',en:'Mexico',color:'#00a85a'},
    GER:{flag:'🇩🇪',es:'Alemania',en:'Germany',color:'#e8b800'},
    CRO:{flag:'🇭🇷',es:'Croacia',en:'Croatia',color:'#e8443a'},
    KOR:{flag:'🇰🇷',es:'Corea del Sur',en:'South Korea',color:'#3f7fd6'},
    CAN:{flag:'🇨🇦',es:'Canadá',en:'Canada',color:'#e84855'},
    BEL:{flag:'🇧🇪',es:'Bélgica',en:'Belgium',color:'#e8b800'},
    MAR:{flag:'🇲🇦',es:'Marruecos',en:'Morocco',color:'#e8443a'},
    JPN:{flag:'🇯🇵',es:'Japón',en:'Japan',color:'#3f7fd6'},
    ARG:{flag:'🇦🇷',es:'Argentina',en:'Argentina',color:'#5aa9e8'},
    POL:{flag:'🇵🇱',es:'Polonia',en:'Poland',color:'#e8556f'},
    NGA:{flag:'🇳🇬',es:'Nigeria',en:'Nigeria',color:'#00a85a'},
    KSA:{flag:'🇸🇦',es:'Arabia Saudita',en:'Saudi Arabia',color:'#1f9d57'},
    USA:{flag:'🇺🇸',es:'Estados Unidos',en:'United States',color:'#5a78e8'},
    NED:{flag:'🇳🇱',es:'Países Bajos',en:'Netherlands',color:'#ff8c3f'},
    ECU:{flag:'🇪🇨',es:'Ecuador',en:'Ecuador',color:'#e8c33f'},
    QAT:{flag:'🇶🇦',es:'Catar',en:'Qatar',color:'#a8466b'},
    ESP:{flag:'🇪🇸',es:'España',en:'Spain',color:'#e8443a'},
    URU:{flag:'🇺🇾',es:'Uruguay',en:'Uruguay',color:'#5ab8e8'},
    GHA:{flag:'🇬🇭',es:'Ghana',en:'Ghana',color:'#e8556f'},
    IRN:{flag:'🇮🇷',es:'Irán',en:'Iran',color:'#2faa57'},
    FRA:{flag:'🇫🇷',es:'Francia',en:'France',color:'#5a78e8'},
    DEN:{flag:'🇩🇰',es:'Dinamarca',en:'Denmark',color:'#e8443a'},
    SEN:{flag:'🇸🇳',es:'Senegal',en:'Senegal',color:'#2faa57'},
    AUS:{flag:'🇦🇺',es:'Australia',en:'Australia',color:'#e8b800'},
    BRA:{flag:'🇧🇷',es:'Brasil',en:'Brazil',color:'#e8c33f'},
    SUI:{flag:'🇨🇭',es:'Suiza',en:'Switzerland',color:'#e8443a'},
    CMR:{flag:'🇨🇲',es:'Camerún',en:'Cameroon',color:'#1f9d57'},
    CRC:{flag:'🇨🇷',es:'Costa Rica',en:'Costa Rica',color:'#5a78e8'},
    POR:{flag:'🇵🇹',es:'Portugal',en:'Portugal',color:'#2faa57'},
    SRB:{flag:'🇷🇸',es:'Serbia',en:'Serbia',color:'#e8556f'},
    CIV:{flag:'🇨🇮',es:'Costa de Marfil',en:'Ivory Coast',color:'#ff8c3f'},
    PAN:{flag:'🇵🇦',es:'Panamá',en:'Panama',color:'#e84855'},
    ENG:{flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',es:'Inglaterra',en:'England',color:'#5a78e8'},
    COL:{flag:'🇨🇴',es:'Colombia',en:'Colombia',color:'#e8c33f'},
    EGY:{flag:'🇪🇬',es:'Egipto',en:'Egypt',color:'#e8443a'},
    NZL:{flag:'🇳🇿',es:'Nueva Zelanda',en:'New Zealand',color:'#5a78e8'},
    ITA:{flag:'🇮🇹',es:'Italia',en:'Italy',color:'#3f9d6e'},
    SWE:{flag:'🇸🇪',es:'Suecia',en:'Sweden',color:'#5aa9e8'},
    TUN:{flag:'🇹🇳',es:'Túnez',en:'Tunisia',color:'#e8443a'},
    JOR:{flag:'🇯🇴',es:'Jordania',en:'Jordan',color:'#2faa57'},
    NOR:{flag:'🇳🇴',es:'Noruega',en:'Norway',color:'#5a78e8'},
    AUT:{flag:'🇦🇹',es:'Austria',en:'Austria',color:'#e8443a'},
    MLI:{flag:'🇲🇱',es:'Malí',en:'Mali',color:'#1f9d57'},
    UZB:{flag:'🇺🇿',es:'Uzbekistán',en:'Uzbekistan',color:'#2faa57'},
    TUR:{flag:'🇹🇷',es:'Turquía',en:'Turkey',color:'#e8443a'},
    ALG:{flag:'🇩🇿',es:'Argelia',en:'Algeria',color:'#1f9d57'},
    PAR:{flag:'🇵🇾',es:'Paraguay',en:'Paraguay',color:'#e8556f'},
    CPV:{flag:'🇨🇻',es:'Cabo Verde',en:'Cape Verde',color:'#5a78e8'},
  };

  readonly GROUPS: Record<string, [string, number, number, number, number, number][]> = {
    A:[['MEX',1,1,0,3,1],['GER',1,0,1,4,3],['CRO',1,0,1,2,2],['KOR',0,1,1,1,4]],
    B:[['BEL',2,0,0,5,1],['JPN',1,0,1,3,2],['CAN',1,0,1,2,2],['MAR',0,0,2,1,6]],
    C:[['ARG',2,0,0,6,1],['POL',1,0,1,3,3],['NGA',0,1,1,2,3],['KSA',0,1,1,1,5]],
    D:[['NED',2,0,0,4,0],['USA',1,1,0,3,1],['ECU',0,1,1,1,3],['QAT',0,0,2,0,4]],
    E:[['ESP',1,1,0,4,2],['URU',1,1,0,3,1],['GHA',0,1,1,2,4],['IRN',0,1,1,1,3]],
    F:[['FRA',2,0,0,5,1],['SEN',1,0,1,3,2],['DEN',1,0,1,2,3],['AUS',0,0,2,1,5]],
    G:[['BRA',2,0,0,6,1],['SUI',1,0,1,2,2],['CMR',0,1,1,2,4],['CRC',0,1,1,1,4]],
    H:[['POR',2,0,0,4,0],['SRB',1,0,1,3,2],['CIV',1,0,1,2,3],['PAN',0,0,2,1,5]],
    I:[['ENG',1,1,0,3,1],['COL',1,1,0,3,2],['EGY',1,0,1,2,2],['NZL',0,0,2,0,3]],
    J:[['ITA',2,0,0,4,1],['SWE',1,0,1,3,2],['TUN',0,1,1,1,2],['JOR',0,1,1,1,4]],
    K:[['NOR',2,0,0,5,1],['AUT',1,0,1,3,3],['MLI',1,0,1,2,2],['UZB',0,0,2,1,5]],
    L:[['TUR',1,1,0,3,1],['ALG',1,1,0,2,1],['PAR',1,0,1,2,2],['CPV',0,0,2,1,4]],
  };

  readonly SCORERS: Scorer[] = [
    {code:'FRA',name:'K. Mbappé',goals:5,sub:'3 PJ · 1 AST'},
    {code:'ARG',name:'L. Messi',goals:4,sub:'3 PJ · 2 AST'},
    {code:'ENG',name:'H. Kane',goals:4,sub:'3 PJ · 0 AST'},
    {code:'BRA',name:'Vinícius Jr.',goals:3,sub:'3 PJ · 2 AST'},
    {code:'MEX',name:'S. Giménez',goals:3,sub:'3 PJ · 1 AST'},
    {code:'GER',name:'J. Musiala',goals:3,sub:'3 PJ · 1 AST'},
    {code:'NOR',name:'E. Haaland',goals:3,sub:'2 PJ · 0 AST'},
    {code:'POR',name:'C. Ronaldo',goals:2,sub:'3 PJ · 1 AST'},
    {code:'NED',name:'C. Gakpo',goals:2,sub:'2 PJ · 2 AST'},
    {code:'URU',name:'D. Núñez',goals:2,sub:'3 PJ · 0 AST'},
  ];

  readonly R32: [[string, number], [string, number]][] = [
    [['A',1],['C',2]], [['B',1],['E',3]], [['C',1],['F',2]], [['D',1],['B',3]],
    [['E',1],['A',2]], [['F',1],['D',2]], [['G',1],['A',3]], [['H',1],['J',2]],
    [['I',1],['K',2]], [['J',1],['H',3]], [['K',1],['I',2]], [['L',1],['I',3]],
    [['B',2],['E',2]], [['G',2],['C',3]], [['H',2],['F',3]], [['L',2],['L',3]],
  ];

  readonly I18N: Record<string, Record<string, string>> = {
    es: {
      nav_matches:'Partidos', nav_groups:'Grupos', nav_bracket:'Bracket', nav_scorers:'Goleadores',
      live:'En vivo', upcoming:'Próximo', ft:'Final', today:'Hoy', today_sub:'Partidos de hoy · 11 jun – 19 jul',
      groups_t:'Grupos', groups_sub:'Fase de grupos · 12 grupos · 48 selecciones',
      scorers_t:'Goleadores', scorers_sub:'Tabla de máximos anotadores',
      bracket_t:'Eliminatorias', bracket_sub:'De 32avos a la Final · proyección en vivo',
      watch:'Ver en vivo', center:'Centro de partido',
      poss:'Posesión', shots:'Tiros', attend:'asistentes',
      group:'Grupo', matchday:'Jornada',
      th_team:'Equipo', th_pj:'PJ', th_w:'G', th_d:'E', th_l:'P', th_gf:'GF', th_ga:'GC', th_gd:'DG', th_pts:'Pts',
      r32:'32avos', r16:'Octavos', qf:'Cuartos', sf:'Semis', final:'Final', champ:'Campeón',
      tbd:'Por definir', all:'Todos',
      foot_tag:'Rastreador del Mundial FIFA 2026', foot_data:'Datos:',
      kicksin:'Comienza en', rank:'Pos', player:'Jugador', goals:'Goles',
      q1:'Clasifica (1° y 2°)', q3:'Mejor 3° en disputa',
      inplay:'en juego', fulltime:'Finalizado',
    },
    en: {
      nav_matches:'Matches', nav_groups:'Groups', nav_bracket:'Bracket', nav_scorers:'Scorers',
      live:'Live', upcoming:'Upcoming', ft:'Full time', today:'Today', today_sub:"Today's matches · Jun 11 – Jul 19",
      groups_t:'Groups', groups_sub:'Group stage · 12 groups · 48 nations',
      scorers_t:'Top Scorers', scorers_sub:'Golden Boot standings',
      bracket_t:'Bracket', bracket_sub:'Round of 32 to the Final · live projection',
      watch:'Watch live', center:'Match center',
      poss:'Possession', shots:'Shots', attend:'attendance',
      group:'Group', matchday:'Matchday',
      th_team:'Team', th_pj:'MP', th_w:'W', th_d:'D', th_l:'L', th_gf:'GF', th_ga:'GA', th_gd:'GD', th_pts:'Pts',
      r32:'Round of 32', r16:'Round of 16', qf:'Quarters', sf:'Semis', final:'Final', champ:'Champion',
      tbd:'TBD', all:'All',
      foot_tag:'FIFA World Cup 2026 Tracker', foot_data:'Data:',
      kicksin:'Kicks off in', rank:'Rank', player:'Player', goals:'Goals',
      q1:'Qualify (1st & 2nd)', q3:'Best 3rd contention',
      inplay:'in play', fulltime:'Full time',
    },
  };

  lang = signal<'es'|'en'>((localStorage.getItem('tm-lang') as 'es'|'en') || 'es');
  t = computed(() => this.I18N[this.lang()]);

  matches = signal<Match[]>([
    {id:'m1',grp:'A',home:'MEX',away:'GER',status:'live',hs:1,as:0,min:67},
    {id:'m2',grp:'E',home:'ESP',away:'URU',status:'live',hs:2,as:2,min:78},
    {id:'m3',grp:'I',home:'ENG',away:'COL',status:'live',hs:1,as:1,min:54},
    {id:'m4',grp:'G',home:'BRA',away:'CMR',status:'ft',hs:3,as:0},
    {id:'m5',grp:'C',home:'ARG',away:'POL',status:'upcoming',inMin:96,kickoff:Date.now()+96*60000},
    {id:'m6',grp:'F',home:'FRA',away:'SEN',status:'upcoming',inMin:181,kickoff:Date.now()+181*60000},
    {id:'m7',grp:'D',home:'USA',away:'NED',status:'upcoming',inMin:262,kickoff:Date.now()+262*60000},
    {id:'m8',grp:'B',home:'CAN',away:'JPN',status:'ft',hs:1,as:2},
  ]);

  readonly HERO_ID = 'm1';

  setLang(l: 'es'|'en') {
    this.lang.set(l);
    localStorage.setItem('tm-lang', l);
  }

  standings(letter: string): Standing[] {
    return (this.GROUPS[letter] || []).map(([code, w, d, l, gf, ga]) => ({
      code, w, d, l, gf, ga, pj: w + d + l, gd: gf - ga, pts: w * 3 + d,
    })).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  }

  slot(letter: string, pos: number) {
    const s = this.standings(letter);
    const code = s[pos - 1]?.code ?? null;
    return { label: pos + letter, code, pos, letter };
  }
}
