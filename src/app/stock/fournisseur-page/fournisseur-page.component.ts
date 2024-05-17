import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-fournisseur-page',
  templateUrl: './fournisseur-page.component.html',
  styleUrls: ['./fournisseur-page.component.css']
})
export class FournisseurPageComponent {
  fournisseurs: any[] = [];
  newFournisseur: any = {};
  isNewCustom: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFournisseurs();
  }

  fetchFournisseurs(): void {
    this.http.get<any[]>('http://localhost:8083/fournisseurs/getAll')
      .subscribe(
        response => {
          this.fournisseurs = response;
        },
        error => {
          console.error('Error fetching fournisseurs:', error);
        }
      );
  }

  saveFournisseur(): void {
    this.http.post<any>('http://localhost:8083/fournisseurs/add', this.newFournisseur).subscribe(
      response => {
        this.isNewCustom = true;
        this.fetchFournisseurs(); // Refresh the list
      },
      error => {
        console.log("custom didnt get added ", error);
      }
    );
  }

  applySearch(): void {
    if (this.searchTerm.trim() !== '') {
      this.fournisseurs = this.fournisseurs.filter(fournisseur =>
        fournisseur.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fournisseur.address.toLowerCase().includes(this.searchTerm.toLowerCase()) 
      );
      this.currentPage=1;
    } else {
      this.fetchFournisseurs();
    }
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.fetchFournisseurs();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getPages().length) {
      this.currentPage++;
    }
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.fournisseurs.length / this.itemsPerPage);
    return new Array(pageCount).fill(null).map((_, index) => index + 1);
  }
}
