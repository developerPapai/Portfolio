import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiService } from './api.service';

export interface Profile {
  name: string;
  title: string;
  bio: string;
  location?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  profileImageUrl?: string;
  resumeUrl?: string;
  heroTagline: string;
  heroTaglines?: string[];
  availableForWork: boolean;
  yearsOfExperience: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends ApiService {
  // Share replay to avoid multiple duplicate requests for profile data
  private profile$?: Observable<{success: boolean, data: Profile}>;

  getProfile(): Observable<{success: boolean, data: Profile}> {
    if (!this.profile$) {
      this.profile$ = this.http.get<{success: boolean, data: Profile}>('/profile').pipe(
        shareReplay(1)
      );
    }
    return this.profile$;
  }
}
