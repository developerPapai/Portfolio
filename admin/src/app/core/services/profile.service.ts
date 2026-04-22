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

  updateProfile(profileData: Partial<Profile>): Observable<{success: boolean, data: Profile}> {
    // Clear cache
    this.profile$ = undefined;
    return this.http.put<{success: boolean, data: Profile}>('/profile', profileData);
  }

  uploadFile(file: File, type: 'image' | 'resume'): Observable<{success: boolean, url: string}> {
    const formData = new FormData();
    formData.append(type, file);
    return this.http.post<{success: boolean, url: string}>('/upload/' + type, formData);
  }
}
