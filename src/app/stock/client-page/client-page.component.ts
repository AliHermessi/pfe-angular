import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-client-page',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.css']
})
export class ClientPageComponent {
  clients: any[] = [];
  filteredClients: any[] = [];
  client: any = {};
  isNewClient: boolean = false;
  errorMessage: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 6;
  @ViewChild('updateDialogTemplate') updateDialogTemplate!: TemplateRef<any>;
  dialogRef: MatDialogRef<any> | undefined;
  updatedClient: any = {};

  @ViewChild('mapDialogTemplate') mapDialogTemplate!: TemplateRef<any>;

  map!: Map;
  marker: Overlay | undefined;
  address: string = '';

  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.fetchClients();
  }

  fetchClients(): void {
    this.http.get<any[]>('http://localhost:8083/clients/getAll').subscribe(
      response => {
        this.clients = response;
        this.filteredClients = this.clients.slice(0, this.pageSize);
      },
      error => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  saveClient(): void {
    if (!this.isValidEmail(this.client.email)) {
      this.errorMessage = "L'email doit être valide.";
      return;
    }

    if (!this.isValidPhoneNumber(this.client.numero_telephone)) {
      this.errorMessage = 'Le numéro de téléphone doit être valide.';
      return;
    }

    this.http.post<any>('http://localhost:8083/clients/add', this.client).subscribe(
      response => {
        this.isNewClient = true;
        this.errorMessage = '';
        this.fetchClients(); // Refresh the list of clients
      },
      error => {
        console.error('Error adding client:', error);
        this.errorMessage = 'Erreur lors de l\'ajout du client.';
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

  searchClients(): void {
    this.filteredClients = this.clients.filter(client =>
      client.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.setCurrentPage(1); // Reset to the first page
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.filteredClients = this.clients.slice(startIndex, startIndex + this.pageSize);
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
    return Array(Math.ceil(this.clients.length / this.pageSize)).fill(0).map((x, i) => i + 1);
  }

  getEmptyRows(): any[] {
    const emptyRows = Math.max(0, this.pageSize - this.filteredClients.length);
    return Array(emptyRows).fill({});
  }

  updateClient(client: any): void {
    // Assign the current client values to updatedClient for the dialog form
    this.updatedClient = { ...client };

    this.dialogRef = this.dialog.open(this.updateDialogTemplate, {
      width: '500px',
      data: { client: this.updatedClient } // Pass data to the dialog
    });

    this.dialogRef.afterClosed().subscribe((result: string) => {
      // Handle dialog result
      if (result === 'apply') {
        this.http.put<any>(`http://localhost:8083/clients/update/${this.updatedClient.id}`, this.updatedClient).subscribe(
          response => {
            Swal.fire('Succès', 'Le client a été mis à jour avec succès!', 'success');
            this.fetchClients(); // Refresh clients list
          },
          error => {
            console.error('Error updating client:', error);
            Swal.fire('Erreur', 'Erreur lors de la mise à jour du client.', 'error');
          }
        );
      } else {
        // Reset updatedClient or perform cleanup if needed
        this.updatedClient = {};
      }
    });
  }

  onDialogCancel(): void {
    this.dialogRef?.close();
  }

  onDialogApply(): void {
    this.dialogRef?.close('apply');
  }

  supprimerClient(client: any): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer ce client ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.get<any>(`http://localhost:8083/clients/get/${client.id}`).subscribe(
          (response) => {
            const numberOfOrders = response.listIdCommande.length;
            if (numberOfOrders > 0) {
              Swal.fire({
                title: 'Confirmation',
                text: `${numberOfOrders} commandes seront affectées par cette suppression. Êtes-vous sûr de vouloir continuer ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, continuer !',
                cancelButtonText: 'Annuler'
              }).then((confirmResult) => {
                if (confirmResult.isConfirmed) {
                  this.deleteClient(client);
                }
              });
            } else {
              this.deleteClient(client);
            }
          },
          (error) => {
            Swal.fire(
              'Erreur !',
              'Une erreur s\'est produite lors de la récupération des informations du client.',
              'error'
            );
          }
        );
      }
    });
  }

  deleteClient(client: any): void {
    this.http.delete(`http://localhost:8083/clients/delete/${client.id}`).subscribe(
      () => {
        Swal.fire(
          'Supprimé !',
          'Le client a été supprimé avec succès.',
          'success'
        );
        this.fetchClients();
      },
      (error) => {
        Swal.fire(
          'Erreur !',
          'Une erreur s\'est produite lors de la suppression du client.',
          'error'
        );
      }
    );
  }

}
