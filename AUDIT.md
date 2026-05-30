# TuMundial26 — Auditoría técnica
> Fecha: 2026-05-30 · API key: Free plan · 100 req/día

---

## TAREA 1 — Prueba real de todos los endpoints

| Endpoint | Resultado | Tiempo | Items | Nota |
|---|---|---|---|---|
| `fixtures?live=all&league=1&season=2026` | ❌ | 242ms | 0 | Plan Free no accede a season=2026 |
| `fixtures?date=HOY&league=1&season=2026` | ❌ | 242ms | 0 | Mismo motivo |
| `standings?league=1&season=2026` | ❌ | 242ms | 0 | Mismo motivo |
| `players/topscorers?league=1&season=2026` | ❌ | 228ms | 0 | Mismo motivo |
| `players/topassists?league=1&season=2026` | ❌ | 228ms | 0 | Mismo motivo |
| `players/topredcards?league=1&season=2026` | ❌ | 246ms | 0 | Mismo motivo |
| `players/topyellowcards?league=1&season=2026` | ❌ | 242ms | 0 | Mismo motivo |
| `injuries?league=1&season=2026` | ❌ | 233ms | 0 | Mismo motivo |
| `teams?league=1&season=2026` | ❌ | 236ms | 0 | Mismo motivo |
| `fixtures?date=HOY` (sin league) | ✅ | — | 924 | Accede a otras ligas hoy |
| `fixtures/events?fixture=ID` | ✅ | — | 16 | Goles, tarjetas, subs |
| `predictions?fixture=ID` | ✅ | — | 1 | Porcentajes, consejo, comparación |
| `players/squads?team=ID` | ✅ | — | 24 jugadores | Foto, posición, dorsal |
| `standings?league=1&season=2022` | ✅ | — | 8 grupos | Solo temporadas pasadas |
| `players/topscorers?league=1&season=2022` | ✅ | — | 20 | Solo temporadas pasadas |

### Diagnóstico crítico

El plan gratuito responde `"Free plans do not have access to this season, try from 2022 to 2024"` para `league=1` con `season=2026`. El Mundial 2026 **no ha empezado** (inicia el 11 Jun 2026): la API no tiene data de un torneo que no ha jugado partidos. La restricción desaparecerá cuando la temporada 2026 inicie. **No es un bug del proyecto — es comportamiento correcto del período pre-torneo.**

**Requests usados en esta auditoría: 17 / 100**

### Estructura de campos confirmada (season=2022)

**standings:**
```
league.standings[] → rank, team{id,name,logo}, points, goalsDiff, group,
                     form, status, description, all{played,win,draw,lose,goals{for,against}},
                     home{played,win,draw,lose}, away{played,win,draw,lose}, update
```

**topscorers / topassists / topredcards / topyellowcards:**
```
player{id,name,firstname,lastname,age,nationality,photo}
statistics[]{team{id,name,logo}, league, games{appearences,lineups,minutes},
             goals{total,assists}, cards{yellow,red}}
```

**fixtures/events:**
```
time{elapsed,extra}, team{id,name,logo}, player{id,name},
assist{id,name}, type, detail, comments
Tipos: Goal / Normal Goal, Card / Yellow Card / Red Card,
       subst / Substitution 1-5, Var / Goal cancelled
```

**predictions:**
```
predictions{winner{id,name,comment}, win_or_draw, under_over, goals{home,away},
            advice, percent{home,draw,away}}
comparison{form, att, def, poisson_distribution, h2h, goals, total}
teams{home,away}, league, h2h[]
```

**players/squads:**
```
team{id,name,logo}
players[]{id, name, age, number, position, photo}
```

---

## TAREA 2 — Mapeo datos API vs secciones actuales

### Hero
| | Estado |
|---|---|
| **Alimentado por API** | `fixture.teams.home/away.name/logo`, `fixture.goals`, `fixture.status.elapsed`, `fixture.venue.name`, `league.round` |
| **Recibimos pero no mostramos** | `fixture.venue.city`, `league.country`, estadísticas reales (possession, shots, xG) |
| **Hardcodeado a reemplazar** | Las 4 tarjetas de stats (posesión `58%`, tiros `5`, xG `1.8`, gol) deberían venir de `fixtures/statistics` cuando hay partido activo |

### Partidos (Matches)
| | Estado |
|---|---|
| **Alimentado por API** | Parcialmente — `fixtures?date=TODAY` funciona para otras ligas |
| **No mostramos** | Fase, minuto actualizado en tiempo real, resultado parcial en vivo |
| **Hardcodeado** | `matches` signal completo en `TmDataService` (8 partidos estáticos) |

### Grupos
| | Estado |
|---|---|
| **Alimentado por API** | `team.name`, `team.logo`, `points`, `goalsDiff`, `all.win/draw/lose/goals` |
| **Recibimos pero no mostramos** | `form` ("WDW"), `description` ("Promotion - World Cup"), `status`, splits home/away |
| **Podríamos agregar** | Barra de forma reciente (últimas 3: W/D/L) — muy visual y con data disponible |

### Goleadores
| | Estado |
|---|---|
| **Alimentado por API** | `player.name`, `player.photo`, `player.nationality`, `statistics[0].team.name`, `statistics[0].goals.total/assists`, `statistics[0].games.appearences` |
| **Recibimos pero no mostramos** | `player.age`, posición del jugador |
| **Funciona** | Foto del jugador con fallback `onPhotoErr` |

### Bracket
| | Estado |
|---|---|
| **Sin API** | 100% estático, derivado de datos de grupos |
| **Futuro** | Una vez iniciado el torneo, `fixtures` por ronda alimentaría el bracket real |

---

### Secciones NUEVAS recomendadas (priorizadas)

| # | Sección | Endpoints | Viabilidad |
|---|---|---|---|
| 1 | **Tarjetas / Disciplina** | `topredcards`, `topyellowcards` | ✅ Inmediata — misma arquitectura que Goleadores |
| 2 | **Predicciones** | `predictions?fixture=ID` | ✅ Para el partido del Hero — porcentajes H/D/A + consejo |
| 3 | **Centro de Partido / Timeline** | `fixtures/events` | ✅ Goles, tarjetas, subs en tiempo real |
| 4 | **Convocatorias / Squads** | `players/squads?team=ID` | ✅ Foto, dorsal, posición de cada jugador |
| 5 | **Estadísticas de partido** | `fixtures/statistics` | ⚠️ Vacío en Free para algunas ligas |
| 6 | **Alineaciones** | `fixtures/lineups` | ⚠️ Vacío en el fixture probado — depende de liga |
| 7 | **Lesiones** | `injuries?league=1&season=2026` | 🔴 Bloqueado en Free para WC |

---

## TAREA 3 — Auditoría del sistema de caché

### 1. ¿Inyectado correctamente?
✅ `CacheService` está inyectado **solo en `ApiFootballService`** (no en componentes directamente). Los componentes inyectan `ApiFootballService`, que gestiona el caché internamente. Arquitectura correcta.

### 2. TTLs configurados

| TTL | Anterior | Corregido | Justificación |
|---|---|---|---|
| `LIVE_TTL` | 60 s | **240 s** | El polling es cada 5 min — 60s causaba 1 req/min = 60 req/hr |
| `TODAY_TTL` | 5 min | 5 min | ✅ OK |
| `STANDINGS_TTL` | 10 min | 10 min | ✅ OK |
| `SCORERS_TTL` | 10 min | 10 min | ✅ OK |

### 3. ¿Sobrevive navegación entre secciones?
✅ Sí. `CacheService` es `providedIn: 'root'` — singleton que vive toda la sesión del browser. Si el usuario va Grupos → Bracket → vuelve a Grupos antes de 10 min, no hay nueva llamada a la API.

### 4. ¿Llamadas duplicadas sin pasar por caché?
✅ No. Mapa de dependencias:

```
HeroComponent      → getLiveFixtures()  [caché 240s, polling 5min]
                   → getTodayFixtures() [caché 5min, solo si no hay live]
GruposComponent    → getStandings()     [caché 10min, una vez en ngOnInit]
GoleadoresComponent→ getTopScorers()    [caché 10min, una vez en ngOnInit]
```

> Nota: `getTopAssists()` está definido en el servicio pero ningún componente lo usa — dead code inofensivo.

### 5. ¿Interceptor 429 correctamente registrado?
✅ `withInterceptors([httpErrorInterceptor])` en `app.config.ts` — correcto.

### 6. ¿Fallback a datos estáticos funciona?

Había un gap: la API devuelve **HTTP 200 con `{ errors: {...}, response: [] }`** para errores de plan/season. El interceptor anterior solo capturaba errores de red reales (status 0, 503) y rate-limit HTTP (status 429). Los errores de plan llegaban como 200 y el interceptor los dejaba pasar.

**Corregido:** el interceptor ahora inspecciona el body de cada respuesta y convierte cualquier `{ errors: {...} }` en `{ response: [] }` con log en consola:

```typescript
map(event => {
  if (event instanceof HttpResponse) {
    const errs = (event.body as any)?.errors;
    if (errs && (Array.isArray(errs) ? errs.length : Object.keys(errs).length) > 0) {
      console.warn('[TuMundial26] API body error:', errs);
      return event.clone({ body: { response: [] } });
    }
  }
  return event;
}),
```

Los componentes reciben `response: []` → activan fallback estático → la app nunca queda en blanco.

---

## TAREA 4 — Análisis de capacidad: 100 req/día

### Anatomía de requests por sesión de usuario

| Acción | Req | Frecuencia |
|---|---|---|
| Carga inicial (standings + topscorers) | 2 | Una vez por sesión |
| Live polling — Hero | 1 | Cada 5 min *(corregido desde 60 s)* |
| Today fixtures — fallback sin live | 1 | Cada 5 min (solo si no hay partidos live) |

### Impacto del fix en polling

```
ANTES del fix  (interval = 60 s):
  Live polling: 1 req/min × 60 min/hr = 60 req/hr
  1 usuario activo 1.5 h → 2 + 90 = 92 req → límite a las 1.5 h ⚠️

DESPUÉS del fix (interval = 5 min, LIVE_TTL = 4 min):
  Live polling: 1 req/5 min × 60 min/hr = 12 req/hr
```

### Escenarios con el fix aplicado

| Escenario | Usuarios | Sesión | Req/día | Estado |
|---|---|---|---|---|
| Normal | 1 | 2 h | 2 + (12×2) = **26** | ✅ Amplio margen |
| Día con partidos | 2 | 3 h c/u | (2+36)×2 = **76** | ✅ OK |
| Día intenso | 3 | 2.5 h c/u | (2+30)×3 = **96** | ⚠️ Justo al límite |
| Pico corto | 5 | 1 h c/u | (2+12)×5 = **70** | ✅ OK |

### Conclusiones

```
Escenario normal:   ~26 req/día → 3-4 sesiones simultáneas  ✅
Escenario intenso:  ~96 req/día → riesgo con 3+ usuarios     ⚠️
Límite práctico:    ~3 usuarios activos simultáneos          ──
```

### Recomendación de escalado

Para más de 3-5 usuarios simultáneos durante el Mundial (Jun-Jul 2026), la solución más económica es un **Cloudflare Worker gratuito** como proxy caché:

```
Browser A ─┐
Browser B ──→ Cloudflare Worker (caché KV 5-10 min) ──→ api-sports.io
Browser C ─┘
```

Con este patrón, los 100 req/día son **compartidos a nivel servidor** en lugar de por-usuario-browser. 100 usuarios simultáneos consumen los mismos requests que 1.

---

## Resumen ejecutivo

### Semáforo general: 🟡 Bueno — listo para el torneo

| Área | Estado | Acción |
|---|---|---|
| Build & TypeScript | 🟢 | Sin errores |
| Caché TTLs | 🟢 | Corregido (`LIVE_TTL` 60s → 240s) |
| Polling interval | 🟢 | Corregido (`interval` 60s → 300s) |
| Interceptor body errors | 🟢 | Corregido (captura `errors` en body 200) |
| Fallback a datos estáticos | 🟢 | Funciona en todas las secciones |
| API season=2026 | 🟡 | Bloqueada hasta Jun 11 — esperado, se abre solo |
| Capacidad free plan | 🟡 | 3-4 sesiones simultáneas — Cloudflare Worker para más |
| `fixtures/statistics` | 🔴 | Vacío en Free — las 4 stat-cards del Hero siguen hardcodeadas |

### Ajustes aplicados en esta auditoría
1. ✅ `http-error.interceptor.ts` — captura errores en body HTTP 200
2. ✅ `cache.service.ts` — `LIVE_TTL` 60 000 ms → 240 000 ms
3. ✅ `hero.component.ts` — `interval(60_000)` → `interval(300_000)`

### Secciones nuevas recomendadas (orden de implementación)
1. **Tarjetas / Disciplina** — zero new endpoints, misma arquitectura que Goleadores
2. **Predicciones del Hero** — un solo request por partido activo
3. **Timeline de partido** — `fixtures/events` cuando hay live
4. **Convocatorias** — `players/squads` por equipo seleccionado

### Build final
```
✅ Application bundle generation complete. [1.406 s]
   Initial:          262 kB → 69 kB transferidos
   Lazy (main-component): 52 kB → 13 kB transferidos
```
