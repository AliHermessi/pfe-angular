import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorie-page',
  templateUrl: './categorie-page.component.html',
  styleUrls: ['./categorie-page.component.css']
})
export class CategoriePageComponent {
  categories: any[] = [];
  filteredCategories: any[] = [];
  newCategorie: any = {};
  isNewCustom: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.http.get<any[]>('http://localhost:8083/categories/getAll')
      .subscribe(
        response => {
          this.categories = response;
          this.applySearch();
        },
        error => {
          console.error('Error fetching Categories:', error);
        }
      );
  }

  saveCategorie(): void {
    this.http.post<any>('http://localhost:8083/categories/add', this.newCategorie).subscribe(
      response => {
        this.isNewCustom = true;
        this.fetchCategories(); // Refresh the list
      },
      error => {
        console.log("custom didnt get added ", error);
      }
    );
  }

  applySearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      
    }
    this.currentPage = 1;
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.applySearch();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
}
