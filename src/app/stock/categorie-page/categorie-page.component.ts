import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { response } from 'express';

@Component({
  selector: 'app-categorie-page',
  templateUrl: './categorie-page.component.html',
  styleUrls: ['./categorie-page.component.css']
})
export class CategoriePageComponent {
  categories: any[] = [];
  filteredCategories: any[] = [];
  categorie: any = {};
  isNewCategorie: boolean = false;
  errorMessage: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 6;
  @ViewChild('updateDialogTemplate') updateDialogTemplate!: TemplateRef<any>;
  dialogRef: MatDialogRef<any> | undefined;
  updatedCategorie: any = {};

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.http.get<any[]>('http://localhost:8083/categories/getAll').subscribe(
      response => {
        this.categories = response;
        this.filteredCategories = this.categories.slice(0, this.pageSize);
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  saveCategorie(): void {
    this.http.post<any>('http://localhost:8083/categories/add', this.categorie).subscribe(
      response => {
        this.isNewCategorie = true;
        this.errorMessage = '';
        this.fetchCategories(); // Refresh the list of categories
      },
      error => {
        console.error('Error adding categorie:', error);
        this.errorMessage = 'Erreur lors de l\'ajout de la catégorie.';
      }
    );
  }

  searchCategories(): void {
    this.filteredCategories = this.categories.filter(categorie =>
      categorie.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.setCurrentPage(1); // Reset to the first page
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.filteredCategories = this.categories.slice(startIndex, startIndex + this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.setCurrentPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getPageNumbers().length) {
      this.setCurrentPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    return Array(Math.ceil(this.categories.length / this.pageSize)).fill(0).map((x, i) => i + 1);
  }

  getEmptyRows(): any[] {
    const emptyRows = Math.max(0, this.pageSize - this.filteredCategories.length);
    return Array(emptyRows).fill({});
  }

  updateCategorie(categorie: any): void {
    // Assign the current categorie values to updatedCategorie for the dialog form
    this.updatedCategorie = { ...categorie };

    this.dialogRef = this.dialog.open(this.updateDialogTemplate, {
      width: '500px',
      data: { categorie: this.updatedCategorie } // Pass data to the dialog
    });

    this.dialogRef.afterClosed().subscribe((result: string) => {
      // Handle dialog result
      if (result === 'apply') {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.put<any>(`http://localhost:8083/categories/update/${this.updatedCategorie.id}`, this.updatedCategorie, { headers }).subscribe(
          response => {
            console.log('Categorie updated:', response);
            Swal.fire('Succès', 'La catégorie a été mise à jour avec succès!', 'success');
            this.fetchCategories(); // Refresh categories list
          },
          error => {
            console.error('Error updating categorie:', error);
            Swal.fire('Erreur', 'Erreur lors de la mise à jour de la catégorie.', 'error');
          }
        );
      } else {
        // Reset updatedCategorie or perform cleanup if needed
        this.updatedCategorie = {};
      }
    });
  }

  onDialogCancel(): void {
    this.dialogRef?.close();
  }

  onDialogApply(): void {
    this.dialogRef?.close('apply');
  }

  supprimerCategorie(categorie: any): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer cette catégorie ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.get<any>(`http://localhost:8083/categories/${categorie.id}`).subscribe(
          (response) => {
            console.log(response);
            const nProduits = response.listIdProduit.length;
            console.log(nProduits);
  
            if (nProduits > 0) {
              Swal.fire({
                title: 'Confirmation',
                text: `${nProduits} produits seront affectés par cette suppression. Êtes-vous sûr de vouloir continuer ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, continuer !',
                cancelButtonText: 'Annuler'
              }).then((confirmResult) => {
                if (confirmResult.isConfirmed) {
                  this.http.delete(`http://localhost:8083/categories/delete/${categorie.id}`).subscribe(
                    () => {
                      Swal.fire(
                        'Supprimé !',
                        'La catégorie a été supprimée avec succès.',
                        'success'
                      );
                      this.fetchCategories();
                    },
                    (error) => {
                      Swal.fire(
                        'Erreur !',
                        'Une erreur s\'est produite lors de la suppression de la catégorie.',
                        'error'
                      );
                    }
                  );
                }
              });
            } else {
              this.http.delete(`http://localhost:8083/categories/delete/${categorie.id}`).subscribe(
                () => {
                  Swal.fire(
                    'Supprimé !',
                    'La catégorie a été supprimée avec succès.',
                    'success'
                  );
                  this.fetchCategories();
                },
                (error) => {
                  Swal.fire(
                    'Erreur !',
                    'Une erreur s\'est produite lors de la suppression de la catégorie.',
                    'error'
                  );
                }
              );
            }
          },
          (error) => {
            Swal.fire(
              'Erreur !',
              'Une erreur s\'est produite lors de la récupération des informations de la catégorie.',
              'error'
            );
          }
        );
      }
    });
  }
  
}
