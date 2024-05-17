import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commande-stock',
  templateUrl: './commande-stock.component.html',
  styleUrl: './commande-stock.component.css'
})
export class CommandeStockComponent {

commandes: any[] = [];
currentPage:number=1;
totalPages:number=0;
pageSize:number=10;


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    
    this.fetchCommandes();
    
   
    
  }
  fetchCommandes() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    
    this.http.get<any[]>('http://localhost:8083/commandes/getAll')
  .subscribe(
    response => {
      this.commandes = response;
      this.totalPages = Math.ceil(this.commandes.length / this.pageSize);
      this.commandes = this.commandes.slice(start, end);
    },
    error => {
      console.error('Error fetching commandes:', error);
      // Show an error message to the user
    }
  );
  }


  prevPage(): void {
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
  sortColumn: string = ''; // Default sort by 'libelle' column
  sortDirection: string = 'asc';
  changeSort(column: string): void {
    if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
    }

    // Sort the commandes array based on the selected column and direction
    this.commandes.sort((a, b) => { 
        if (this.sortDirection === 'asc') {
            return a[this.sortColumn] > b[this.sortColumn] ? 1 : -1;
        } else {
            return a[this.sortColumn] < b[this.sortColumn] ? 1 : -1;
        }
    });
}

getSortClass(column: string): string {
  if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? 'fa-chevron-down' : 'fa-chevron-up';
  } else {
      return ''; // Return an empty string if the column is not sorted
  }
}


  getEmptyRows(): number[] {
    const emptyRowCount = this.pageSize - this.commandes.length;
    return Array.from({length: emptyRowCount}, (_, i) => i);
}



}
