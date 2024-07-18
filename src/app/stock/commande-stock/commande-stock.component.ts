import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-commande-stock',
  templateUrl: './commande-stock.component.html',
  styleUrl: './commande-stock.component.css'
})
export class CommandeStockComponent {

  commandes: any[] = [];
  filteredCommandes: any[] = []; // New array for filtered commandes
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 8;
  searchTerm: string = '';
  emptyRows: any[] = [];
  filterValue: string = 'tous'; // Default filter value
  sortOrder: string = 'desc'; // Default sort order (newest to oldest)

  constructor(private http: HttpClient,private session : SessionStorageService ,private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    this.fetchCommandes();
  }

  fetchCommandes(): void {
    this.http.get<any[]>('http://localhost:8083/commandes/getAll')
      .subscribe(
        response => {
          console.log(response);
          this.commandes = response;
          this.applyFilterAndSort(); // Apply filter and sort on initial fetch
          this.totalPages = Math.ceil(this.filteredCommandes.length / this.pageSize);
          this.emptyRows = Array(this.pageSize - this.filteredCommandes.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize).length).fill(null);
        },
        error => {
          console.error('Error fetching commandes:', error);
        }
      );
  }

  applyFilterAndSort(): void {
    // Apply filtering based on filterValue
    switch (this.filterValue) {
      case 'tous':
        this.filteredCommandes = this.commandes.slice();
        break;
      case 'Facture générer':
        this.filteredCommandes = this.commandes.filter(commande => commande.factureGenerated);
        break;
      case 'facture non générer':
        this.filteredCommandes = this.commandes.filter(commande => !commande.factureGenerated);
        break;
      default:
        this.filteredCommandes = this.commandes.slice();
    }

    // Apply sorting by dateCommande based on sortOrder
    if (this.sortOrder === 'desc') {
      this.filteredCommandes.sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime());
    } else {
      this.filteredCommandes.sort((a, b) => new Date(a.dateCommande).getTime() - new Date(b.dateCommande).getTime());
    }
  }

  applySearch(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredCommandes = this.commandes.filter(commande => commande.codeCommande.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.filteredCommandes = this.commandes.slice();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchCommandes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchCommandes();
    }
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
    this.fetchCommandes();
  }

 
  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  ImprimerBDL(id: number): void {
    const username = sessionStorage.getItem('ngx-webstorage|username');
    if (!username) {
      console.error('Username not found in session storage');
      return;
    }

    const url = `http://localhost:8083/commandes/generatePdfBDL/${id}?user=${username}`;
    window.location.href = url;

  }

  

}
