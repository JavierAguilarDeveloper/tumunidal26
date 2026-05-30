import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

const empty = () => of(new HttpResponse({ body: { response: [] }, status: 200 }));

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        const body = event.body as any;
        const errs = body?.errors;
        if (errs && (Array.isArray(errs) ? errs.length : Object.keys(errs).length) > 0) {
          console.warn('[TuMundial26] API body error:', errs);
          return event.clone({ body: { response: [] } });
        }
      }
      return event;
    }),
    catchError(err => {
      if (err.status === 429) {
        console.warn('[TuMundial26] API rate limit reached, using static data');
        return empty();
      }
      if (err.status === 0 || err.status === 503) {
        console.warn('[TuMundial26] API unavailable, using static data');
        return empty();
      }
      throw err;
    })
  );
