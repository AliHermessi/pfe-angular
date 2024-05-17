import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-list-commande-f',
  templateUrl: './list-commande-f.component.html',
  styleUrl: './list-commande-f.component.css'
})
export class ListCommandeFComponent {

  commandes: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 8;
  searchTerm: string = '';
  emptyRows: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchCommandes();
  }

  fetchCommandes(): void {
    this.http.get<any[]>('http://localhost:8083/commandes/getAll')
      .subscribe(
        response => {
          this.commandes = response;
          this.totalPages = Math.ceil(this.commandes.length / this.pageSize);
          this.emptyRows = Array(this.pageSize - this.commandes.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize).length).fill(null);
        },
        error => {
          console.error('Error fetching commandes:', error);
        }
      );
  }

  applySearch() {
    this.commandes = this.commandes.filter(commande => commande.codeFacture.includes(this.searchTerm) || commande.code.includes(this.searchTerm));
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

  openCommande(id: number): void {
    console.log("ok");
  }

showAlert:boolean=false;
codeFactureRetourne:String='';
convertirCommandeEtCreerFacture(id:number):void{

  this.http.post<any>(`http://localhost:8083/commandes/ConvertirCommandeEtCreerFacture`, id).subscribe(
    response =>{
      
      this.showAlert=true;
      this.fetchCommandes();
    }

  );


}

deleteCommande(id:number):void{
  this.http.delete<any>(`http://localhost:8083/commandes/delete/${id}`)
  .subscribe(
    () => {
      this.fetchCommandes();
    },
    error => {
      console.error('Error deleting produit:', error);
    }
  );
}


getPageNumbers(): number[] {
  const pageNumbers: number[] = [];
  for (let i = 0; i < this.totalPages; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
}


}
