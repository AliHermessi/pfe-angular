import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fournisseur-page',
  templateUrl: './fournisseur-page.component.html',
  styleUrls: ['./fournisseur-page.component.css']
})
export class FournisseurPageComponent {
  fournisseurs: any[] = [];
  filteredFournisseurs: any[] = [];
  newFournisseur: any = {};
  isNewFournisseur: boolean = false;
  errorMessage: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  @ViewChild('updateDialogTemplate') updateDialogTemplate!: TemplateRef<any>;
  dialogRef: MatDialogRef<any> | undefined;
  updatedFournisseur: any = {};

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.fetchFournisseurs();
  }

  fetchFournisseurs(): void {
    this.http.get<any[]>('http://localhost:8083/fournisseurs/getAll').subscribe(
      response => {
        this.fournisseurs = response;
        this.filteredFournisseurs = this.fournisseurs.slice(0, this.pageSize);
      },
      error => {
        console.error('Error fetching fournisseurs:', error);
      }
    );
  }

  saveFournisseur(): void {
    if (!this.isValidEmail(this.newFournisseur.email)) {
      this.errorMessage = "L'email doit être valide.";
      return;
    }

    if (!this.isValidPhoneNumber(this.newFournisseur.numero)) {
      this.errorMessage = 'Le numéro de téléphone doit être valide.';
      return;
    }

    this.http.post<any>('http://localhost:8083/fournisseurs/add', this.newFournisseur).subscribe(
      response => {
        this.isNewFournisseur = true;
        this.errorMessage = '';
        this.fetchFournisseurs(); // Refresh the list of fournisseurs
      },
      error => {
        console.error('Error adding fournisseur:', error);
        this.errorMessage = 'Erreur lors de l\'ajout du fournisseur.';
      }
    );
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }

  isValidPhoneNumber(phone: string): boolean {
    const phonePattern = /^[0-9]+$/;
    return phonePattern.test(phone);
  }

  searchFournisseurs(): void {
    this.filteredFournisseurs = this.fournisseurs.filter(fournisseur =>
      fournisseur.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.setCurrentPage(1); // Reset to the first page
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.filteredFournisseurs = this.fournisseurs.slice(startIndex, startIndex + this.pageSize);
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
    const pageCount = Math.ceil(this.fournisseurs.length / this.pageSize);
    return new Array(pageCount).fill(null).map((_, index) => index + 1);
  }

  getEmptyRows(): any[] {
    const rowCount = this.pageSize - this.filteredFournisseurs.length;
    return new Array(rowCount > 0 ? rowCount : 0).fill({});
  }

  updateFournisseur(fournisseur: any): void {
    this.updatedFournisseur = { ...fournisseur };
    this.dialogRef = this.dialog.open(this.updateDialogTemplate, {
      width: '500px',
      data: { fournisseur: this.updatedFournisseur }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put(`http://localhost:8083/fournisseurs/update/${fournisseur.id}`, this.updatedFournisseur).subscribe(
          () => {
            this.fetchFournisseurs(); // Refresh the list of fournisseurs
            Swal.fire('Succès', 'Fournisseur mis à jour avec succès', 'success');
          },
          error => {
            console.error('Error updating fournisseur:', error);
            Swal.fire('Erreur', 'Erreur lors de la mise à jour du fournisseur', 'error');
          }
        );
      }
    });
  }

  supprimerFournisseur(Fournisseur: any): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce fournisseur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.get<any>(`http://localhost:8083/fournisseurs/${Fournisseur.id}`).subscribe(
          (response) => {
            const nCommandes = response.listIdCommande.length;
            const nProduits = response.listIdProduit.length;
  
            if (nCommandes > 0 || nProduits > 0) {
              Swal.fire({
                title: 'Confirmation',
                text: `${nCommandes} commandes et ${nProduits} produits seront affectés par cette suppression. Êtes-vous sûr de vouloir continuer ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, continuer !',
                cancelButtonText: 'Annuler'
              }).then((confirmResult) => {
                if (confirmResult.isConfirmed) {
                  this.http.delete(`http://localhost:8083/fournisseurs/delete/${Fournisseur.id}`).subscribe(
                    () => {
                      Swal.fire(
                        'Supprimé !',
                        'Le fournisseur a été supprimé avec succès.',
                        'success'
                      );
                      this.fetchFournisseurs();
                    },
                    (error) => {
                      Swal.fire(
                        'Erreur !',
                        'Une erreur s\'est produite lors de la suppression du fournisseur.',
                        'error'
                      );
                    }
                  );
                }
              });
            } else {
              this.http.delete(`http://localhost:8083/fournisseurs/delete/${Fournisseur.id}`).subscribe(
                () => {
                  Swal.fire(
                    'Supprimé !',
                    'Le fournisseur a été supprimé avec succès.',
                    'success'
                  );
                  this.fetchFournisseurs();
                },
                (error) => {
                  Swal.fire(
                    'Erreur !',
                    'Une erreur s\'est produite lors de la suppression du fournisseur.',
                    'error'
                  );
                }
              );
            }
          },
          (error) => {
            Swal.fire(
              'Erreur !',
              'Une erreur s\'est produite lors de la récupération des informations du fournisseur.',
              'error'
            );
          }
        );
      }
    });
  }
  
  
  

  onDialogCancel(): void {
    this.dialogRef?.close();
  }

  onDialogApply(): void {
    this.dialogRef?.close(this.updatedFournisseur);
  }
}
