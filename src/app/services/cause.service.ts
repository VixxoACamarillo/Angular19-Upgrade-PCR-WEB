import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CauseService {
  private proxyEAPIUrl = environment.proxyEApi;

  constructor(private httpClient: HttpClient) {}

  /**
   * Get Cause By partId
   * @param {number} partId
   * @returns {Observable<any>}
   */
  public getCauseByPartId(partId: number): Observable<any> {
    return this.httpClient.get(
      `${this.proxyEAPIUrl}/pcr/partActionCause?partId=${partId}`
    );
  }
}
