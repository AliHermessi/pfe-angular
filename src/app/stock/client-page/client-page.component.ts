import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-client-page',
  templateUrl: './client-page.component.html',
  styleUrl: './client-page.component.css'
})
export class ClientPageComponent {
  clients: any[] = [];
  client: any = {};
  isNewClient: boolean = false;

  constructor(private http: HttpClient) {
    this.fetchClients();
  }

  fetchClients(): void {
    this.http.get<any[]>('http://localhost:8083/clients/getAll').subscribe(
      response => {
        this.clients = response;
      },
      error => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  saveClient(): void {
    this.http.post<any>('http://localhost:8083/clients/add', this.client).subscribe(
      response => {
        this.isNewClient = true;
        this.fetchClients(); // Refresh the list of clients
        alert("Nouveau client " + this.client.nom + " a été ajouté!");
      },
      error => {
        console.error('Error adding client:', error);
      }
    );
  }
}
