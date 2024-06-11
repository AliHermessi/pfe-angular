import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  produits: any[] = [];
  categories: any[] = [];
  fournisseurs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 7;
  libelle: string = '';
  description: string = '';
  prix: number = 0;
  quantite: number = 0;
  date_arrivage: string = '';
  categorieIDn: number = 0;
  fournisseurIDn: number = 0;
  status: string = '';
  cout: number = 0;
  brand: string = '';
  activeTab: string = 'home';
  sortColumn: string = '';
  sortDirection: string = 'asc';
  Component: string = 'list';

  constructor(private http: HttpClient, private router: Router) {
    
  }

  ngOnInit(): void {
    this.activeTab = sessionStorage.getItem('activeTab') || 'home';
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event): void {
    sessionStorage.setItem('activeTab', this.activeTab);
  }

  toggleNav(tab: string): void {
    this.activeTab = tab;
    this.router.navigate([`/stock/${tab}`]);
  }

  setActiveTab(url: string): void {
    const urlSegments = url.split('/');
    this.activeTab = urlSegments[urlSegments.length - 1];
  }

 
}
