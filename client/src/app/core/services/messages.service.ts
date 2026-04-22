import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService extends ApiService {
  
  sendMessage(messageData: {name: string, email: string, subject?: string, message: string}): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>('/messages', messageData);
  }
}
