import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { PartsSearchModel } from '../models/parts-search.model';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  private proxyEAPIUrl = environment.proxyEApi;

  constructor(private httpClient: HttpClient) {}

  /**
   * Get the List of current Parts by the url param
   * @param {any} params
   * @returns {Observable<any>}
   */
  public getPartsByParam(params: PartsSearchModel): Observable<any> {
    let httpParams = new HttpParams();

    for (let key of Object.keys(params)) {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value);
      }
    }

    return this.httpClient.get(
      `${this.proxyEAPIUrl}/parts?${httpParams.toString()}`
    );
  }
}
