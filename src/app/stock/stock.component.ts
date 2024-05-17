import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { HomeStockComponent } from './home-stock/home-stock.component';
import { ListStockComponent } from './list-stock/list-stock.component';
import { NavbarStockComponent } from './navbar-stock/navbar-stock.component';
import { CommandeStockComponent } from './commande-stock/commande-stock.component';



@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})



export class StockComponent {

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

  activeTab: string = 'Dashboard';
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.activeTab = sessionStorage.getItem('activeTab') || 'home';
    this.fetchProduits();
    this.fetchCategories();
    this.fetchFournisseurs();
   
    
  }
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event): void {
    // Store activeTab in sessionStorage before unloading the window
    sessionStorage.setItem('activeTab', this.activeTab);
  }
  

  toggleNav(tab: string): void {
    this.activeTab = tab;
  }










  sortColumn: string = ''; // Default sort by 'libelle' column
  sortDirection: string = 'asc'; // 'asc' or 'desc'
  
  
  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.fetchProduits(); // Apply new sorting
  }
  
  sortProduits(produits: any[]): any[] {
    return produits.sort((a, b) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];
  
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        if (this.sortDirection === 'asc') {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      } else {
        const strValueA = String(valueA);
        const strValueB = String(valueB);
  
        if (this.sortDirection === 'asc') {
          return strValueA.localeCompare(strValueB);
        } else {
          return strValueB.localeCompare(strValueA);
        }
      }
    });
  }
  
  
  

  fetchProduits(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
  
    this.http.get<any[]>('http://localhost:8083/produits/getAll')
      .subscribe(
        response => {
          // Sort products based on the current sorting
          
          this.produits = this.sortProduits(response);
          
          // Update total pages after sorting
          this.totalPages = Math.ceil(this.produits.length / this.pageSize);
  
          // Slice the sorted products to get the current page
          this.produits = this.produits.slice(start, end);
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


  

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchProduits();
      
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchProduits();
      
    }
  }
  Component:String='list';

  selectedComponent(componentName: string): void {
    this.Component = componentName;
  }

  addProduit(): void {
    const produit = {
      libelle: this.libelle,
      description: this.description,
      prix: this.prix,
      quantite: this.quantite,
      date_arrivage: this.date_arrivage,
      categorie: { id: Number(this.categorieIDn) },
      fournisseur: { id: Number(this.fournisseurIDn) }
    };

    this.http.post<any>('http://localhost:8083/produits/add', produit)
      .subscribe(
        response => {
          this.fetchProduits();
          this.resetFields();
        },
        error => {
          console.error('Error adding produit:', error);
        }
      );
  }

  resetFields(): void {
    this.libelle = '';
    this.description = '';
    this.prix = 0;
    this.quantite = 0;
    this.date_arrivage = '';
    this.categorieIDn = 0;
    this.fournisseurIDn = 0;
    
  }


 

    

  }
  







