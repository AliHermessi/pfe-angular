import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private eventSource!: EventSource;

  constructor(private http: HttpClient, private ngZone: NgZone) { }

  connect(): Observable<any> {
    return new Observable<any>(observer => {
      this.eventSource = new EventSource('http://localhost:8083/notifications/stream');

      this.eventSource.onmessage = (event) => {
        console.log('Received notification:', event.data);
        this.ngZone.run(() => {
          observer.next(JSON.parse(event.data));
        });
      };

      this.eventSource.onerror = (error) => {
        console.error('Error occurred:', error);
        this.ngZone.run(() => {
          observer.error(error);
        });
      };

      return () => {
        this.eventSource.close();
      };
    });
  }

  createNotification(notification: any): Observable<any> {
    return this.http.post('http://localhost:8083/notifications', notification);
  }
}
