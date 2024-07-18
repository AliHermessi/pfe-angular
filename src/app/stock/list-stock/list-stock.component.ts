import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-stock',
  templateUrl: './list-stock.component.html',
  styleUrls: ['./list-stock.component.css']
})
export class ListStockComponent implements OnInit {
  produits: any[] = [];
  categories: any[] = [];
  filteredCategories: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  searchValue: string = '';
  selectedCategory: string | null = null;
   minQuantity!: number;
 maxQuantity!: number;
minPrice!: number;
 maxPrice!: number;
startDate!: Date;
 endDate!: Date;
  filterList: string[] = [];
  isArrowUp: boolean = false;
  showFilters: boolean = false;
selectedProduits:any [] = [] ;
  constructor(private http: HttpClient,private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    this.fetchProduits();
    this.fetchCategories();
  }

  toggleProductSelection(product: any): void {
    product.selected = !product.selected; // Toggle selected state
    if (product.selected) {
      this.selectedProduits.push(product); // Add product to selectedProducts array
    } else {
      const index = this.selectedProduits.findIndex(p => p.id === product.id);
      if (index !== -1) {
        this.selectedProduits.splice(index, 1); // Remove product from selectedProducts array
      }
    }
    console.log(this.selectedProduits);
  }

  toggleArrow(): void {
    this.isArrowUp = !this.isArrowUp;
    this.showFilters = !this.showFilters;
  }
  

  fetchProduits(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
  
    this.http.get<any[]>('http://localhost:8083/produits/getAll')
     .subscribe(
        response => {
          this.produits = this.sortProduits(response);
  
          // Iterate through products to check selected status
          this.produits.forEach(product => {
            product.selected = this.selectedProduits.some(selected => selected.id === product.id);
          });
  
          this.totalPages = Math.ceil(this.produits.length / this.pageSize);
          this.produits = this.produits.slice(start, end);
        },
        error => {
          console.error('Error fetching produits:', error);
        }
      );
  }
  getEmptyRows(): number[] {
    const emptyRowCount = this.pageSize - this.produits.length;
    return Array.from({length: emptyRowCount}, (_, i) => i);
}

  fetchCategories(): void {
    this.http.get<any[]>('http://localhost:8083/categories/getAll')
     .subscribe(
        response => {
          this.categories = response;
          this.filteredCategories = response;
        },
        error => {
          console.error('Error fetching categories:', error);
        }
      );
  }
categorieSearchValue:String='';
  categorieSearch(): void {
    const value = this.categorieSearchValue.toLowerCase();
    if (value) {
      this.filteredCategories = this.categories.filter(category => category.nom.toLowerCase().includes(value));
    } else {
      this.filteredCategories = this.categories;
    }
  }

  sortColumn: string = ''; // Default sort by 'libelle' column
  sortDirection: string = 'asc'; // 'asc' or 'desc'

  changeSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc'? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.produits = this.sortProduits(this.produits); // Sort the filtered products
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
 
updateTotalpage(number:number) : void {
  this.pageSize=number;
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
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  setCurrentPage(page: number): void {
    this.currentPage = page;
    this.fetchProduits(); // Make sure to fetch products for the new page
  }
  
  clearFilters(): void {
    this.searchValue = '';
    this.currentPage = 1;
    this.fetchProduits();
  }

  search(): void {
    this.currentPage = 1;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    if (this.searchValue !== '') {
      this.http.post<any[]>('http://localhost:8083/produits/search', { search: this.searchValue })
        .subscribe(
          response => {
            this.produits = response;
            this.totalPages = Math.ceil(this.produits.length / this.pageSize);
            this.produits = this.produits.slice(start, end);
          },
          error => {
            console.error('Search error:', error);
          }
        );
    } else {
      this.fetchProduits();
    }
  }

  updateFilterList(filterName: string): void {
    if (!this.filterList.includes(filterName)) {
      this.filterList.push(filterName);
    } else {
      this.filterList = this.filterList.filter(item => item !== filterName);
    }
  }

  applyFilters(): void {
    let filteredProducts = this.produits.slice();
  
    // Category filter
    if (this.filterList.includes('category') && this.selectedCategory) {
      filteredProducts = filteredProducts.filter(product => product.categorieName === this.selectedCategory);
    }
  
    // Quantity filters
    if (this.filterList.includes('quantity')) {
      if (this.minQuantity!== null) {
        filteredProducts = filteredProducts.filter(product => product.quantite >= this.minQuantity);
      }
      if (this.maxQuantity!== null) {
        filteredProducts = filteredProducts.filter(product => product.quantite <= this.maxQuantity);
      }
    }
  
    // Price filters
   
      if (this.minPrice!== null) {
        filteredProducts = filteredProducts.filter(product => product.prix >= this.minPrice);
      }
      if (this.maxPrice!== null) {
        filteredProducts = filteredProducts.filter(product => product.prix <= this.maxPrice);
      }
    
  
    // Date filters
    if (this.filterList.includes('date')) {
      if (this.startDate!== null) {
        filteredProducts = filteredProducts.filter(product => {
          const arrivalDate = new Date(product.date_arrivage);
          return arrivalDate >= this.startDate;
        });
      }
      if (this.endDate!== null) {
        filteredProducts = filteredProducts.filter(product => {
          const arrivalDate = new Date(product.date_arrivage);
          return arrivalDate <= this.endDate;
        });
      }
    }
  
    console.log(filteredProducts);
    this.produits = filteredProducts;
    this.totalPages = Math.ceil(this.produits.length / this.pageSize);
    this.currentPage = 1;
  }

  
  creerCommande(): void {
    this.sharedService.setSelectedProduits(this.selectedProduits);
    this.router.navigate(['/stock/add-commande']);
    console.log(this.selectedProduits); // Navigate to the add-commande-f page
  }
removeSelectedProduit(selectedProduit: any): void {
  const index = this.selectedProduits.findIndex(p => p.id === selectedProduit.id);
  if (index !== -1) {
    this.selectedProduits.splice(index, 1); // Remove the selected produit from the array
  }
}
resetSelectedProduits():void {

this.selectedProduits=[];

}

selectedProduitsPage: number = 1;
pageSizeSelectedProduits: number = 10;

get selectedProduitsRows(): any[][] {
  const start = (this.selectedProduitsPage - 1) * this.pageSizeSelectedProduits;
  const end = start + this.pageSizeSelectedProduits;
  return this.chunkArray(this.selectedProduits, 5).slice(start, end);
}

chunkArray(array: any[], size: number): any[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
}


}