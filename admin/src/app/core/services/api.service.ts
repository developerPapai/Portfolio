import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected http = inject(HttpClient);
  protected platformId = inject(PLATFORM_ID);
  
  protected get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
