import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-stock',
  templateUrl: './home-stock.component.html',
  styleUrl: './home-stock.component.css'
})
export class HomeStockComponent {
  constructor(private http: HttpClient, private router: Router) {}
  produits: any[] = [];
  categories:any [] = [];
  fournisseurs:any[] = [] ;
  currentPage: number=1;
  totalPages: number=1;
  pageSize: number=7;
  libelle: string = '';
  description: string = '';
  prix: number = 0;
  quantite: number = 0;
  date_arrivage: string = '';
  categorieIDn: number = 0;
  fournisseurIDn: number = 0;
  status:String='';
  cout:number=0;
  brand:String='';
  ngOnInit(): void {
    this.fetchProduits();
  }

  fetchProduits(): void {
    this.http.get<any[]>('http://localhost:8083/produits/getAll')
      .subscribe(
        response => {

          this.produits = response;
        },
        error => {
          console.error('Error fetching produits:', error);
        }
      );
  }
  

  fetchCategories(): void {
    

    this.http.get<any[]>('http://localhost:8083/categories/getAll')
      .subscribe(
        response => {
          
          this.categories = response;
          
        },
        error => {
          console.error('Error fetching categories:', error);
        }
      );
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


}
