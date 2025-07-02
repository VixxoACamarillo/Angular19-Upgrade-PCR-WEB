import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private proxyEAPIUrl = environment.proxyEApi;

  constructor(private httpClient: HttpClient) {}

  /**
   * Get Asset By assetId
   * @param {string} assetId
   * @returns {Observable<any>}
   */
  public getAssetByAssetId(assetId: string): Observable<any> {
    return this.httpClient.get(
      `${this.proxyEAPIUrl}/assetService/asset/${assetId}`
    );
  }
}
