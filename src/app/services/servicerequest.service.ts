import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicerequestService {
  private proxyEApiUrl = environment.proxyEApi;

  constructor(private httpClient: HttpClient) {}

  public getServiceRequest(serviceRequestNumber: string): Observable<any> {
    return this.httpClient.get(
      `${this.proxyEApiUrl}/serviceRequest/${serviceRequestNumber}`
    );
  }

  public addAttachment(
    serviceRequestNumber: string,
    key: string,
    subType: string
  ): Observable<any> {
    return this.httpClient.post(
      `${this.proxyEApiUrl}/serviceRequest/${serviceRequestNumber}/attachment`,
      {
        key,
        subType
      }
    );
  }

  public addNote(
    serviceRequestNumber: string,
    note: string,
    type: string
  ): Observable<any> {
    return this.httpClient.post(
      `${this.proxyEApiUrl}/serviceRequestService/serviceRequest/${serviceRequestNumber}/note`,
      {
        content: note,
        noteType: type,
        serviceRequestNumber: serviceRequestNumber,
        actionRequired: false
      }
    );
  }
}
