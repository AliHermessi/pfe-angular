import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { ElementFacture } from '../../models/element-facture.model';

@Component({
  selector: 'app-ajout-stock',
  templateUrl: './ajout-stock.component.html',
  styleUrls: ['./ajout-stock.component.css']
})
export class AjoutStockComponent {
  selectedElement: any = null;
  selectedCommande: any = null;
  element:any=[];
  ListelementFactures: ElementFacture[] = [];
  productList: any[] = [];
  commandes: any[] = [];
  showDropdown: boolean = false;
  codeCommandeList: string[] = [];
  status: string = '';
  description: string = '';
  selectedCodeCommande: string = '';
  quantity: number = 1;
  customStatus: string = '';
  commande:any=[];
  
  constructor(private http: HttpClient) {}


  searchCommande(selectedCodeCommande: string): void {
    if (selectedCodeCommande.length >= 1) {
      this.http.post<any[]>('http://localhost:8083/commandes/search', selectedCodeCommande)
        .subscribe(data => {
          console.log(selectedCodeCommande);
          this.commandes = data;
          this.codeCommandeList = this.commandes.map(commande => commande.codeCommande);
          console.log(this.commandes);

          // Update the commande property with the fetched data
          if (this.commandes.length > 0) {
            this.commande = this.commandes[0];
            this.updateElementFactures(); // Update ListelementFactures
          }
        });
    }
  }

  updateElementFactures(): void {
    if (!this.commande || !this.commande.elementsFacture) {
      return;
    }
    this.ListelementFactures = []; // Clear existing data
    this.commande.elementsFacture.forEach((elementFacture: ElementFacture) => this.ListelementFactures.push(elementFacture) );
    console.log(this.ListelementFactures);
    // Other logic for updating fields based on commande data
  }
  


  searchProduct(query: String): void {
    if (query !== '') {
      this.ListelementFactures.filter(elementFacture =>
        elementFacture.libelle.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  

  selectProduct(product: any): void {
    this.selectedElement = product.libelle;
    this.element=product;
    console.log("Product selected:", product);
}

selectCommande(ch: string): void {
    this.selectedCodeCommande = ch;
    this.updateElementFactures();
    console.log("Command selected:", ch);
}


  clearSelectedElement(): void {
    this.selectedElement = null;
  }

  clearSelectedCommande(): void {
    this.selectedCommande = null;
    this.selectedCodeCommande = '';
  }

  showCommandeDropdown: boolean = false;
  showElementFactureDropdown: boolean = false;

  toggleCommandeDropdown(event: Event): void {
    this.showCommandeDropdown = !this.showCommandeDropdown;
    if (!this.showCommandeDropdown) {
        this.closeDropdowns();
    }
    this.showElementFactureDropdown = false; // Close elementFacture dropdown if open
    event.stopPropagation();
}

toggleElementFactureDropdown(event: Event): void {
    this.showElementFactureDropdown = !this.showElementFactureDropdown;
    if (!this.showElementFactureDropdown) {
        this.closeDropdowns();
    }
    this.showCommandeDropdown = false; // Close commande dropdown if open
    event.stopPropagation();
}

  @HostListener('document:click', ['$event'])
onDocumentClick(event: any): void {
  if (!event.target.closest('.custom-ng-select')) {
    this.closeDropdowns();
  }
}

closeDropdowns(): void {
  this.showCommandeDropdown = false;
  this.showElementFactureDropdown = false;
}



addProduit(): void {
  const message = `Êtes-vous sûr de vouloir ajouter le produit "${this.selectedElement.refProduit}" 
  de la commande "${this.selectedCodeCommande}" avec le statut "${this.status}" et 
  la quantité "${this.quantity}" ?`;

  Swal.fire({
    title: 'Confirmation',
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Non'
  }).then((result) => {
    if (result.isConfirmed) {
      const produit = {
        ...this.element,
        quantity: this.quantity
      };
      const params = new HttpParams()
        .set('refProduit', produit.refProduit)
        .set('libelle', produit.libelle)
        .set('quantite', produit.quantity.toString())
        .set('ch', this.status);
      this.http.get<any>('http://localhost:8083/produits/updateReturned', { params })
        .subscribe(
          response => {
            Swal.fire({
              title: 'Enregistré!',
              text: 'Le produit a été ajouté avec succès.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          error => {
            console.error('Error adding produit:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Une erreur est survenue lors de l\'ajout du produit.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
    }
  });
}
}
