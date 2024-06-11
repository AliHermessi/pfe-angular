import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = 'http://localhost:8083/messages';
  private sseUrl = `${this.baseUrl}/streamMessages`;
  private conversationsUrl = `${this.baseUrl}/getConversations`;
  private messagesUrl = `${this.baseUrl}/getMessages`;
  private createConversationUrl = `${this.baseUrl}/createConversation`;
  private sendMessageUrl = `${this.baseUrl}/sendMessage`;

  private messageSubject: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {}

  getConversations(userId: number): Observable<any> {
    return this.http.get(`${this.conversationsUrl}/${userId}`);
  }

  getMessages(conversationId: number): Observable<any> {
    return this.http.get(`${this.messagesUrl}/${conversationId}`);
  }

  createConversation(userIds: number[]): Observable<any> {
    return this.http.post(this.createConversationUrl, userIds);
  }

  sendMessage(conversationId: number, message: any): Observable<any> {
    return this.http.post(`${this.sendMessageUrl}/${conversationId}`, message);
  }

  streamMessages(conversationId: number): Observable<any> {
    const eventSource = new EventSource(`${this.sseUrl}/${conversationId}`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.comment === 'heartbeat') {
        // Handle heartbeat
      } else {
        this.messageSubject.next(data);
      }
    };
    eventSource.onerror = () => {
      eventSource.close();
    };
    return this.messageSubject.asObservable();
  }
}
