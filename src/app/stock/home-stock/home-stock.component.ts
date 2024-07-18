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
  username:String|null='';

  ngOnInit(): void {
    this.fetchProduits();
    this.fetchCategories();
    this.fetchFournisseurs();
    this.username = sessionStorage.getItem('ngx-webstorage|username');

  }
  onCardClick(type: string): void {
    if (type === 'produits') {
      this.router.navigate(['/stock/list-stock']);
    } else if (type === 'categories') {
      this.router.navigate(['/stock/categorie']);
    } else if (type === 'fournisseurs') {
      this.router.navigate(['/stock/fournisseur']);
    }
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
