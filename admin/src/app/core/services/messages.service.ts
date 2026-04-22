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

  getMessages(): Observable<{success: boolean, count: number, data: any[]}> {
    return this.http.get<{success: boolean, count: number, data: any[]}>('/messages');
  }

  markAsRead(id: string): Observable<{success: boolean, data: any}> {
    return this.http.patch<{success: boolean, data: any}>(`/messages/${id}/read`, { read: true });
  }

  deleteMessage(id: string): Observable<{success: boolean, message: string}> {
    return this.http.delete<{success: boolean, message: string}>(`/messages/${id}`);
  }
}
