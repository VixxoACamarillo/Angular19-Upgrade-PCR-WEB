import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SavePcrData } from '../models/pcr-data.model';

@Injectable({
  providedIn: 'root'
})
export class PcrService {
  private proxyEApiUrl = environment.proxyEApi;

  constructor(private httpClient: HttpClient) {}

  public getAllCategories(
    customerNumber: string,
    lineOfService: string
  ): Observable<any> {
    return this.httpClient.get(
      `${this.proxyEApiUrl}/pcr/categories?customerNumber=${customerNumber}&lineOfService=${lineOfService}`
    );
  }

  public getPcrForCategory(
    customerNumber: string,
    lineOfService: string,
    category: string
  ): Observable<any> {
    return this.httpClient.get(
      `${this.proxyEApiUrl}/pcr/pcr?customerNumber=${customerNumber}&lineOfService=${lineOfService}&category=${category}`
    );
  }

  public postPcr(serviceRequestNumber: string, pcr: any): Observable<any> {
    return this.httpClient.post(
      `${this.proxyEApiUrl}/pcr/answer/${serviceRequestNumber}`,
      pcr
    );
  }

  public postPcr2(data: SavePcrData): Observable<any> {
    return this.httpClient.post(`${this.proxyEApiUrl}/pcr/pcrData`, data);
  }
}
