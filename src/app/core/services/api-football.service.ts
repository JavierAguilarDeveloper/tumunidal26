import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class ApiFootballService {
  private http = inject(HttpClient);
  private cache = inject(CacheService);

  private headers: HttpHeaders = environment.apiFootballKey
    ? new HttpHeaders({ 'x-apisports-key': environment.apiFootballKey })
    : new HttpHeaders();

  private get<T>(path: string, params: Record<string, string> = {}): Observable<T> {
    return this.http.get<T>(`${environment.apiBaseUrl}/${path}`, {
      headers: this.headers,
      params,
    });
  }

  getLiveFixtures(): Observable<any> {
    const cached = this.cache.get('live', CacheService.LIVE_TTL);
    if (cached) return of(cached as any);
    return this.get<any>('fixtures', {
      live: 'all',
      league: String(environment.leagueId),
      season: String(environment.season),
    }).pipe(tap(d => this.cache.set('live', d)));
  }

  getTodayFixtures(): Observable<any> {
    const today = new Date().toISOString().split('T')[0];
    const key = `today-${today}`;
    const cached = this.cache.get(key, CacheService.TODAY_TTL);
    if (cached) return of(cached as any);
    return this.get<any>('fixtures', {
      date: today,
      league: String(environment.leagueId),
      season: String(environment.season),
    }).pipe(tap(d => this.cache.set(key, d)));
  }

  getStandings(): Observable<any> {
    const cached = this.cache.get('standings', CacheService.STANDINGS_TTL);
    if (cached) return of(cached as any);
    return this.get<any>('standings', {
      league: String(environment.leagueId),
      season: String(environment.season),
    }).pipe(tap(d => this.cache.set('standings', d)));
  }

  getTopScorers(): Observable<any> {
    const cached = this.cache.get('topscorers', CacheService.SCORERS_TTL);
    if (cached) return of(cached as any);
    return this.get<any>('players/topscorers', {
      league: String(environment.leagueId),
      season: String(environment.season),
    }).pipe(tap(d => this.cache.set('topscorers', d)));
  }

  getTopAssists(): Observable<any> {
    const cached = this.cache.get('topassists', CacheService.SCORERS_TTL);
    if (cached) return of(cached as any);
    return this.get<any>('players/topassists', {
      league: String(environment.leagueId),
      season: String(environment.season),
    }).pipe(tap(d => this.cache.set('topassists', d)));
  }

  getFixtureStats(fixtureId: number): Observable<any> {
    return this.get<any>('fixtures/statistics', { fixture: String(fixtureId) });
  }
}
