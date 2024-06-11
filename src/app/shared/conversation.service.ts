import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = 'http://localhost:8083/conversations';

  constructor(private http: HttpClient) { }

  getConversations(username: string): Observable<Conversation[]> {
    return this.http.get<Conversation[]>('http://localhost:8083/conversations/getAll', { params: { username } });
  }

  getConversation(id: number): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/${id}`);
  }
 createConversation(usernames: string[]): Observable<Conversation> {
  return this.http.post<Conversation>(`${this.apiUrl}/create`, usernames);
}

  // Implement other methods as needed, e.g., createConversation(), deleteConversation(), etc.
}
