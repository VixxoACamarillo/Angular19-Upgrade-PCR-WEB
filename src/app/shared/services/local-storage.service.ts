import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public writeLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public readLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  public deleteLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  public clearAllLocalStorage(): void {
    localStorage.clear();
  }
}
