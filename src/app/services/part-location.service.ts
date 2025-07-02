import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartLocationService {
  private proxyEApiUrl = environment.proxyEApi;

  constructor(private httpClient: HttpClient) {}

  public getLocation(partIds: number[]): Observable<any> {
    if (!partIds || partIds.length === 0) {
      return of([]);
    }

    const partIdParams = this.setPartIdParams(partIds);
    return this.httpClient.get(
      `${this.proxyEApiUrl}/pcr/partLocationPath?${partIdParams}`
    );
  }

  private setPartIdParams(partIds: number[]): string {
    return partIds
      .map((partId) => 'partIds=' + partId.toString())
      .join('&');
  }
}
