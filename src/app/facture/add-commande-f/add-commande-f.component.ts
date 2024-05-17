import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-commande-f',
  templateUrl: './add-commande-f.component.html',
  styleUrl: './add-commande-f.component.css'
})
export class AddCommandeFComponent {

  dateCommande = new Date().toISOString().substring(0, 16);
  adresse = '';
  typeCommande = 'IN';
  selectedFournisseur = '';
  selectedClient = ''
  selectedProduit: any = {};
  produits: any[] = [];
  categories: any[] = [];
  fournisseurs: any[] = [];
  clients: any[] = [];
  refCodes: String[] = [];
  produitsList: any[] = [];
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
  
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchProduits();
    this.fetchFournisseurs();
    this.fetchClients();
  }

  fetchProduits(): void {
    this.http.get<any[]>('http://localhost:8083/produits/getAll')
      .subscribe(
        response => {
          this.produits = response;
        },
        error => {
          console.error('Error fetching produits:', error);
        }
      );
  }

  fetchClients(): void {
    this.http.get<any[]>('http://localhost:8083/clients/getAll')
      .subscribe(
        response => {
          this.clients = response;
        },
        error => {
          console.error('Error fetching clients:', error);
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

  onTypeChange(): void {
    this.resetFields();this.isNewCustom = true;
  }
  
  searchProduits(name: string): void {
    this.http.post<any[]>('http://localhost:8083/produits/search',  name )
      .subscribe(data => {
        this.produitsList = data;
        
      });
  }
  libelleArray:String[]=[];
  searchProduitByLibelle(libelle: String): void {
    console.log(libelle);
    this.http.post<any[]>('http://localhost:8083/produits/searchProduitByLibelle', { query: libelle })
      .subscribe(data => {
          console.log(data);
          this.libelleArray = data;
        });
  }


  searchByRefCode(refCode: String): void {
    console.log(refCode);
    this.http.post<any[]>('http://localhost:8083/produits/searchBarCodes', { query: refCode })
      .subscribe(data => {
          console.log(data);
          this.refCodes = data;
        });
  }

  
  clearItems(arrayName: string): void {
    if (arrayName === 'refCodes') {
      this.refCodes = [];
    } else if (arrayName === 'libelleArray') {
      this.libelleArray = [];
    }
  }
  
  
  
  

  

  addNewItem(): void {
    this.produitsList.push({
      refCode: '',
      libelle: '',
      quantity: 0,
      price: 0,
      netHT: 0
    });
  }
  updateProduitValues(produit: any): void {
    if (produit.refCode) {
      
      this.selectedProduit=this.produits.find(p => p.barcode === produit.refCode);
      if (this.selectedProduit) {
        produit.id = this.selectedProduit.id;
        produit.libelle = this.selectedProduit.libelle;
        produit.price = this.selectedProduit.prix;
        produit.tax = this.selectedProduit.tax;
        produit.remise = this.selectedProduit.remise;
        this.updateNetHT(produit);
      }
    }
  
    if (produit.libelle) {
       
      this.selectedProduit=this.produits.find(p => p.libelle === produit.libelle);;
      if (this.selectedProduit) {
        produit.id = this.selectedProduit.id;
        produit.refCode = this.selectedProduit.barcode;
        produit.price = this.selectedProduit.prix;
        produit.tax = this.selectedProduit.tax;
        produit.remise = this.selectedProduit.remise;
        this.updateNetHT(produit);
      }
    }
  }
  
  
  
showResult:boolean=false;
  deleteProduit(index: number): void {
    this.produitsList.splice(index, 1);
  }
montantTotalHT:number=0;
montantTotalTTC:number=0;
montantTotalRemise:number=0;
updateNetHT(produit: any): void {
  if (this.selectedProduit) {
    this.showResult=true;
    produit.price = this.selectedProduit.prix;
    produit.netHT = produit.quantity * this.selectedProduit.prix;

    // Check if remise is a number before performing arithmetic operation
    const remiseValue = parseFloat(produit.remise || '0');
    if (!isNaN(remiseValue)) {
      produit.netHT -= produit.netHT * (remiseValue / 100);
      this.montantTotalRemise -= produit.netHT * (remiseValue / 100);
    } else {
      this.montantTotalRemise += produit.netHT * (produit.remise || 0) / 100;
    }

    produit.netTTC = produit.netHT * (1+(produit.tax*0.01));

    this.montantTotalHT=this.montantTotalHT+produit.netHT;
    this.montantTotalTTC=this.montantTotalHT * ((this.selectedProduit.tax*0.01)+1);

  }
}
  
  

  onFournisseurChange(): void {
    console.log(this.fournisseurs);
    console.log("Fournisseur selected:", this.selectedFournisseur);
    if (this.selectedFournisseur === 'custom') {
      this.enableFournisseurFields();
      this.isNewCustom = false;
    } else {
      const selectedFournisseur = this.fournisseurs.find(f => f.id.toString() === this.selectedFournisseur);

      console.log("Selected Fournisseur:", selectedFournisseur); // Debug
      if (selectedFournisseur) {
        this.fournisseurNom = selectedFournisseur.nom;
        this.fournisseurAdresse = selectedFournisseur.address; // Assuming the address property exists
        this.fournisseurNumero = selectedFournisseur.numero; // Assuming the numero property exists
      }
      
    }
  }


  
  onClientChange(): void {
    console.log("Client selected:", this.selectedClient);
    if (this.selectedClient === 'custom') {
      this.enableClientFields();
      this.isNewCustom = false;
    } else {
      const selectedClient = this.clients.find(c => c.id.toString() === this.selectedClient);
      console.log("Selected Client:", selectedClient);
      if (selectedClient) {
        this.clientNom = selectedClient.nom;
        this.clientAdresse = selectedClient.address; 
        this.clientNumero = selectedClient.numero_telephone;
        this.clientEmail = selectedClient.email;
      }
      this.disableClientFields();
    }
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
    this.selectedFournisseur = '';
    this.selectedClient = '';
    this.fournisseurNom = '';
    this.fournisseurAdresse = '';
    this.fournisseurNumero = '';
    this.clientNom = '';
    this.clientAdresse = '';
    this.clientNumero = '';
    this.isFournisseurSelected = false;
    this.isClientSelected = false;
  }

codeCommande:String='';
showAlert:boolean=false;
SaveCommande(): void {
  if (!this.isNewCustom) {
    alert("Save before proceeding");
    return;
  }

  // Check if the fournisseur or client ID is empty based on the typeCommande
  if (this.typeCommande === 'IN' && !this.selectedFournisseur) {
    alert('Please select a fournisseur.');
    return;
  }

  if (this.typeCommande === 'OUT' && !this.selectedClient) {
    alert('Please select a client.');
    return;
  }

  const elementFacturesDTO = this.produitsList.map(produit => {
    return {
      ProduitId:produit.id,
      
      refProduit:produit.refCode,
      libelle: produit.libelle,
      quantity: produit.quantity,
      prix: produit.price,
      tax: produit.tax,
      remise: produit.remise,
      netHT:produit.netHT,
      netTTC:produit.netTTC,
    };
  });
  const newCommandeDTO: any = {
    dateCommande: new Date(this.dateCommande).toISOString(),
    montantTotal: this.montantTotalTTC,
    adresse: this.adresse,
    fournisseurNom: this.fournisseurNom,
    clientNom: this.clientNom,
    type_commande: this.typeCommande,
    elementsFacture: elementFacturesDTO,
    fournisseur_id: this.typeCommande === 'OUT' ? null : this.selectedFournisseur,
    client_id: this.typeCommande === 'IN' ? null : this.selectedClient,
  };
console.log(this.selectedFournisseur);console.log(this.selectedClient);
  console.log(newCommandeDTO);

  this.http.post<any>('http://localhost:8083/commandes/SaveCommande', newCommandeDTO).subscribe(
    response => {
      this.codeCommande=response;
      this.showAlert=true;
    },
    error => {
      console.log("didnt get saved", error);
    }
  );
}

  onNewCustomSave(): void {
    if (this.typeCommande === 'IN') {
      this.saveFournisseur();
    } else {
      this.saveClient();
    }
  }

saveFournisseur(): void {
  const fournisseur: any =  {
    nom: this.fournisseurNom,
    numero: this.fournisseurNumero,
    address: this.fournisseurAdresse
  };
   
   this.http.post<any>('http://localhost:8083/fournisseurs/add', fournisseur).subscribe(
     response => {
       this.isNewCustom = true;
       alert("new Fournisseur "+ fournisseur.nom +" has been added")
     },
     error => {
  console.log("custom didnt get added ",error)
     }
  );
}


saveClient(): void {
  const client: any =  {
    nom: this.clientNom,
    email:this.clientEmail,
    numero_telephone: this.clientNumero,
    address: this.clientAdresse
  };
  
  
  this.http.post<any[]>('http://localhost:8083/clients/add',  client ).subscribe(
  response => {
    this.isNewCustom = true;
    alert("new Client "+ client.nom +" has been added")
  },
  error => {
    console.log("custom didnt get added ",error)
  }
);
}
}
