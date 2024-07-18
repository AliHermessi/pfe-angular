import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import Swal from 'sweetalert2';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-list-commande-f',
  templateUrl: './list-commande-f.component.html',
  styleUrls: ['./list-commande-f.component.css']
})
export class ListCommandeFComponent {

  commandes: any[] = [];
  filteredCommandes: any[] = []; // New array for filtered commandes
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 8;
  searchTerm: string = '';
  emptyRows: any[] = [];
  filterValue: string = 'tous'; // Default filter value
  sortOrder: string = 'desc'; // Default sort order (newest to oldest)

  constructor(private http: HttpClient,private session : SessionStorageService ,private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    this.fetchCommandes();
  }

  fetchCommandes(): void {
    this.http.get<any[]>('http://localhost:8083/commandes/getAll')
      .subscribe(
        response => {
          this.commandes = response;
          this.applyFilterAndSort(); // Apply filter and sort on initial fetch
          this.totalPages = Math.ceil(this.filteredCommandes.length / this.pageSize);
          this.emptyRows = Array(this.pageSize - this.filteredCommandes.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize).length).fill(null);
        },
        error => {
          console.error('Error fetching commandes:', error);
        }
      );
  }

  applyFilterAndSort(): void {
    // Apply filtering based on filterValue
    switch (this.filterValue) {
      case 'tous':
        this.filteredCommandes = this.commandes.slice();
        break;
      case 'Facture générer':
        this.filteredCommandes = this.commandes.filter(commande => commande.factureGenerated);
        break;
      case 'facture non générer':
        this.filteredCommandes = this.commandes.filter(commande => !commande.factureGenerated);
        break;
      default:
        this.filteredCommandes = this.commandes.slice();
    }

    // Apply sorting by dateCommande based on sortOrder
    if (this.sortOrder === 'desc') {
      this.filteredCommandes.sort((a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime());
    } else {
      this.filteredCommandes.sort((a, b) => new Date(a.dateCommande).getTime() - new Date(b.dateCommande).getTime());
    }
  }

  applySearch(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredCommandes = this.commandes.filter(commande => commande.codeCommande.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.filteredCommandes = this.commandes.slice();
    }
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

  modifierCommande(id: number): void {
    Swal.fire({
      title: 'Modifier la commande',
      text: 'Êtes-vous sûr de vouloir modifier cette commande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, modifier !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeModifierCommande(id);
      }
    });
  }

  private executeModifierCommande(id: number): void {
    this.http.get<any>(`http://localhost:8083/commandes/get/${id}`).subscribe(
      response => {
        this.sharedService.setCommande(response);
        const list = this.session.retrieve('roles');
        if (list.includes('ADMIN')) {
          this.router.navigate(['/admin/add-commande-f'], { queryParams: { source: 'list-commande' } });
        } else if (list.includes('FACTURE')) {
          this.router.navigate(['/facture/add-commande-f'], { queryParams: { source: 'list-commande' } });
        }
      },
      error => {
        console.error('Error fetching commande:', error);
      }
    );
  }

  convertirCommandeEtCreerFacture(id: number): void {
    Swal.fire({
      title: 'Générer la facture',
      text: 'Êtes-vous sûr de vouloir générer la facture pour cette commande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, générer la facture !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeConvertirCommandeEtCreerFacture(id);
      }
    });
  }

private executeConvertirCommandeEtCreerFacture(id: number): void {
    this.http.post<any>(`http://localhost:8083/commandes/ConvertirCommandeEtCreerFacture`, id).subscribe(
      response => {
console.log(response);
        Swal.fire({
          title: 'Imprimer la facture',
          text: 'Voulez-vous imprimer cette facture maintenant ?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui, imprimer !',
          cancelButtonText: 'Non'
        }).then((printResult) => {
          if (printResult.isConfirmed) {
            this.generatePDF(response);
          }
        });

        const list = this.session.retrieve('roles');
        if (list.includes('ADMIN')) {
          this.router.navigate(['/admin/list-facture']);
        } else if (list.includes('FACTURE')) {
          this.router.navigate(['/facture/list-facture']);
        }

        // Suggérer l'impression après le succès de la création de la facture
        
      },
      error => {
        console.error('Error converting commande:', error);
        const list = this.session.retrieve('roles');
        if (list.includes('ADMIN')) {
          this.router.navigate(['/admin/list-facture']);
        } else if (list.includes('FACTURE')) {
          this.router.navigate(['/facture/list-facture']);
        }
      }
    );
  }

user: String = '';

generatePDF(id: number): void {
  if (this.session) {
      this.user = this.session.retrieve('username'); 
  }
  const url = `http://localhost:8083/factures/generatePdf/${id}?user=${this.user}`;
  window.location.href = url;
}


  deleteCommande(id: number): void {
    Swal.fire({
      title: 'Supprimer la commande',
      text: 'Êtes-vous sûr de vouloir supprimer cette commande ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeDeleteCommande(id);
      }
    });
  }

  private executeDeleteCommande(id: number): void {
    this.http.delete<any>(`http://localhost:8083/commandes/delete/${id}`)
      .subscribe(
        () => {
          console.log('Commande deleted successfully');
          this.fetchCommandes(); // Refresh commandes list after deletion
        },
        error => {
          console.error('Error deleting commande:', error);
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



  Imprimer(id: number): void {
    const username = sessionStorage.getItem('ngx-webstorage|username');
    if (!username) {
      console.error('Username not found in session storage');
      return;
    }

    const url = `http://localhost:8083/commandes/generatePdfCommande/${id}?user=${username}`;
    this.http.get(url, { responseType: 'arraybuffer', observe: 'response' })
      .subscribe((response: HttpResponse<ArrayBuffer>) => {
        if (response.body) {
          this.openPdfInNewTab(response.body);
        } else {
          console.error('Empty response body received');
          // Handle empty response body scenario
        }
      }, error => {
        console.error('Error generating PDF:', error);
        // Handle error as needed
      });
  }

  private openPdfInNewTab(pdfBytes: ArrayBuffer): void {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  }


}
