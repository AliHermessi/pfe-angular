import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-facture',
  templateUrl: './home-facture.component.html',
  styleUrl: './home-facture.component.css'
})
export class HomeFactureComponent {

  constructor(private http: HttpClient, private router: Router) {}

  factures: any[] = [];
  commandes:any [] = [];
  clients:any[] = [] ;
username:String|null='';

  ngOnInit(): void {
    this.fetchFactures();
    this.fetchClients();
    this.fetchCommandes();
    this.username = sessionStorage.getItem('ngx-webstorage|username');

  }

  fetchFactures(): void {
    this.http.get<any[]>('http://localhost:8083/factures/getAll')
      .subscribe(
        response => {

          this.factures = response;
        },
        error => {
          console.error('Error fetching produits:', error);
        }
      );
  }
  

  fetchCommandes(): void {
    

    this.http.get<any[]>('http://localhost:8083/commandes/getAll')
      .subscribe(
        response => {
          
          this.commandes = response;
          
        },
        error => {
          console.error('Error fetching categories:', error);
        }
      );
  }

  fetchClients(): void {
    

    this.http.get<any[]>('http://localhost:8083/clients/getAll')
      .subscribe(
        response => {
         
          this.clients = response;
          
        },
        error => {
          console.error('Error fetching fournisseurs:', error);
        }
      );
  }

  onCardClick(type: string): void {
    if (type === 'commandes') {
      this.router.navigate(['/facture/list-commande-f']);
    } else if (type === 'factures') {
      this.router.navigate(['/facture/list-facture']);
    } else if (type === 'clients') {
      this.router.navigate(['/facture/client']);
    }
  }
}
