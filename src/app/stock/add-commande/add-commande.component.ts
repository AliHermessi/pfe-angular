import { HttpClient } from '@angular/common/http';
import { Component, HostListener, NgModule, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Commande } from '../../models/commande.model';
import { ElementFacture } from '../../models/element-facture.model';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-add-commande',
  templateUrl: './add-commande.component.html',
  styleUrls: ['./add-commande.component.css']
})
export class AddCommandeComponent implements OnInit {

  dateCommande = new Date().toISOString().substring(0, 16);
  adresse = '';
  typeCommande = 'NO TYPE';
  
  selectedProduit: any = {};
  produits: any[] = [];
  categories: any[] = [];
  fournisseurs: any[] = [];
  clients: any[] = [];
  refCodes: String[] = [];
  produitsList: any[] = [];
  commandes : any[] = [];
  commande : any=[];
  ListelementFactures : any[] = [];
  isFournisseurSelected = false;
  isClientSelected = false;
  fournisseurNom = '';
  fournisseurAdresse = '';
  fournisseurNumero = '';
  clientNom = '';
  clientAdresse = '';
  clientNumero = '';
  clientEmail = '';
  isNewCustom: boolean = true;
  codeCommande:String='';
  showAlert:boolean=false;
  showResult:boolean=false;
  selectedCodeCommande: string='';
  showDropdown: boolean = false;
  codeCommandeList: string[]=[];
  selectedProduits:any[]=[];
  constructor(private http: HttpClient,private sharedService: SharedService, private router: Router) {}

  ngOnInit(): void {
    this.sharedService.selectedProduits$.subscribe(produits => {
    this.selectedProduits = produits;
  });
  this.processSelectedProduits(this.selectedProduits);
}
processSelectedProduits(produits: any[]): void {
 
  produits.forEach(produit => {
    this.ListelementFactures.push({
      id:produit.id,
      refProduit: produit.barcode,
      libelle: produit.libelle,
      quantity: 1,
      price: produit.prix,
      tax:produit.tax,
      netHT: 0,
      remise:0,
      netTTC:0,
    });
  });
  
  
  // Log or perform any further processing with produitsList
  console.log('Produits List:', this.produitsList);

}
  

  

  
  

  searchByCodeCommande(selectedCodeCommande: string): void {
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
    this.commande.elementsFacture.forEach((elementFacture: ElementFacture) => {
      this.addNewItem(elementFacture);
      console.log(elementFacture);
    });
    console.log(this.ListelementFactures);
  }

  toggleDropdown(event: Event) {
    this.showDropdown = !this.showDropdown;
    event.stopPropagation();
  }

  @HostListener('document:click')
  closeDropdown() {
    this.showDropdown = false;
  }

  selectOption(option: string) {
    this.selectedCodeCommande = option;
    this.updateElementFactures();
    this.closeDropdown();
  }



  addNewItem(elementFacture:ElementFacture): void {
    this.ListelementFactures.push({
      refProduit: elementFacture.refProduit,
      libelle: elementFacture.libelle,
      quantity: elementFacture.quantity,
      quantityOut:elementFacture.quantity,
    });
  }
  
  
  
  

  deleteProduit(index: number): void {
    this.produitsList.splice(index, 1);
  }



 


  
 

  



  enableFournisseurFields(): void {
    this.isFournisseurSelected = true;
  }

  disableFournisseurFields(): void {
    this.isFournisseurSelected = false;
  }

  enableClientFields(): void {
    this.isClientSelected = true;
  }

  disableClientFields(): void {
    this.isClientSelected = false;
  }

  resetFields(): void {
    
    this.fournisseurNom = '';
    this.fournisseurAdresse = '';
    this.fournisseurNumero = '';
    this.clientNom = '';
    this.clientAdresse = '';
    this.clientNumero = '';
    this.isFournisseurSelected = false;
    this.isClientSelected = false;
  }


  Imprimer(): void {
    


    const elementFacturesDTO = this.ListelementFactures.map(elementFacture => {
      return {
        libelle: elementFacture.libelle,
        quantity: elementFacture.quantity,
        prix: elementFacture.price,
        tax: elementFacture.tax,
        remise: elementFacture.remise,
        netHT:elementFacture.netHT,
        netTTC:elementFacture.netTTC,
      };
    });

    const newCommandeDTO: any = {
      dateCommande: new Date(this.dateCommande).toISOString(),
      
      adresse: this.adresse,
      fournisseurNom: this.fournisseurNom,
      clientNom: this.clientNom,
      type_commande: this.typeCommande,
      elementsFacture: elementFacturesDTO,
      fournisseur_id: this.typeCommande === 'OUT' ? null : this.commande.client_id,
      client_id: this.typeCommande === 'IN' ? null : this.commande.fournisseur_id,
    };


    this.http.post<any>('http://localhost:8083/commandes/printBonLivraison', newCommandeDTO).subscribe(
      response => {
        alert('ok');
      },
      error => {
        console.log("didnt get saved", error);
      }
    );
  }



}
