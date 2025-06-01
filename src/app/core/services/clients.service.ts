import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieStorageService } from 'src/app/services/cookie-storage.service';
import { environment } from 'src/environments/environment';
import { finalize, Observable } from 'rxjs';
import { FiltersModel } from '../models/filter.model';
import {
  ClientModel,
  ClientModelSearch,
  SingleCLient,
} from '../models/client.model';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(
    private http: HttpClient,
    private cookiesStorageService: CookieStorageService,
    private _loader: LoaderService
  ) {}

  getAllUsers(
    pageSize: string,
    page: string,
    filters?: FiltersModel
  ): Observable<ClientModelSearch> {
    this._loader.show();
    const url = `${environment.URL_BASE}${environment.host.users.methods.getUsers}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.cookiesStorageService.getJWT()}`,
    });

    let params = new HttpParams()
      .set('pagination[page]', page)
      .set('pagination[pageSize]', pageSize);

    if (filters?.trainer) {
      params = params.set('filters[trainer][$eq]', filters.trainer);
    }

    if (filters?.fortNight) {
      const { from, to } = this.getFortNightRange(
        filters.fortNight as '1' | '2'
      );
      params = params
        .set('filters[endDate][$gte]', from)
        .set('filters[endDate][$lte]', to);
    }

    if (filters?.state) {
      params = params.set('filters[status][$eq]', filters.state);
    }

    if (typeof filters?.discount === 'boolean') {
      params = params.set('filters[discount][$eq]', filters.discount);
    }

    return this.http
      .get<ClientModelSearch>(url, { params, headers })
      .pipe(finalize(() => this._loader.hide()));
  }

  private getFortNightRange(fortNight: '1' | '2'): {
    from: string;
    to: string;
  } {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const midMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    const endMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

    if (fortNight === '1') {
      return {
        from: nextMonth.toISOString(),
        to: midMonth.toISOString(),
      };
    } else {
      return {
        from: midMonth.toISOString(),
        to: endMonth.toISOString(),
      };
    }
  }
}
