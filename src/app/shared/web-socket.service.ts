import { Injectable } from '@angular/core';
import { Client, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {/**  
  private client: Client;
  private messageSubject: Subject<any> = new Subject<any>();

  constructor() {
    const stompConfig: StompConfig = {
      webSocketFactory: () => {
        return new SockJS('http://localhost:8083/ws');
      }
    };
    this.client = new Client(stompConfig);
    this.client.onConnect = () => {
      console.log('WebSocket connected');
      this.client.subscribe('/topic/messages', (message) => {
        console.log('Received message:', message);
        this.messageSubject.next(message.body);
      });
    };
    this.client.onStompError = (error) => {
      console.error('WebSocket error:', error);
    };
    this.client.onWebSocketClose = (event) => {
      console.log('WebSocket connection closed', event);
    };
    this.client.onWebSocketError = (event) => {
      console.error('WebSocket connection error', event);
    };
    this.client.activate();
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  sendMessage(message: any) {
    this.client.publish({ destination: '/app/sendMessage', body: JSON.stringify(message) });
  }*/
}
