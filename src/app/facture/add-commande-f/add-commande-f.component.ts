import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Coordinate, toStringHDMS } from 'ol/coordinate';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Nullable } from 'primeng/ts-helpers';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'ngx-webstorage';


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
  selectedProduits: any[] = [];

 commandeId : number|null = null;

  commandeDTO: any = {};

  finalButtonText : String = 'Énregistrer Commande' ;
  pageTitleText : String = 'Ajout du Commande'

  addressType: string = 'SURPLACE';
  map!: Map ;
  marker: Overlay | undefined;
  address!: string;
  @ViewChild('mapDialogTemplate') mapDialogTemplate!: TemplateRef<any>;
  dialogRef: MatDialogRef<any> | undefined;

  source: string | Nullable;

  constructor(private http: HttpClient, private router: Router,private sharedService: SharedService,public dialog: MatDialog,private route: ActivatedRoute
    ,private renderer: Renderer2,private session : SessionStorageService
    ) {}


  
  ngOnInit(): void {
    this.fetchClients();
    this.fetchFournisseurs();
    this.fetchProduits();
    this.source = this.route.snapshot.queryParams['source'];

    if (this.source === 'list-produit') {
      this.sharedService.selectedProduits$.subscribe(produits => {
        this.selectedProduits = produits;
        this.processSelectedProduits(this.selectedProduits);
      });
    } else if (this.source === 'list-commande') {
      this.sharedService.commande$.subscribe(commande => {
        this.commandeDTO = commande;
        console.log(this.commandeDTO.id);
        this.finalButtonText = 'Confirmer modification';
        this.pageTitleText = 'Modifier commande n:° '+ this.commandeDTO.id + ' code : '+this.commandeDTO.codeCommande;
        this.processCommande(this.commandeDTO);
      });
    }

    this.initMap(); 
  }

processCommande(commandeDTO : any):void{
  this.dateCommande = commandeDTO.dateCommande || '';
 
 console.log(commandeDTO);
  
  this.typeCommande = commandeDTO.type_commande;
  if(commandeDTO.type_commande === 'IN'){
  this.selectedFournisseur = commandeDTO.fournisseur_id ;
  this.onFournisseurChange();
  this.fournisseurNom = commandeDTO.fournisseurName;
  this.fournisseurNumero = commandeDTO.numero;
  }else if (commandeDTO.type_commande === 'OUT'){
  this.selectedClient = commandeDTO.client_id ;
  this.onClientChange();
  this.clientNom = commandeDTO.clientName;
  this.clientNumero = commandeDTO.numero;
  }

if (commandeDTO.adresse === 'SURPLACE'){
this.addressType = "SURPLACE";
}
else {
  this.addressType = "LIVRAISON";
  console.log(commandeDTO.adresse);
  this.address = commandeDTO.adresse;
}

  this.processSelectedProduits(commandeDTO.elementsFacture);
  this.showResult=true;
  this.montantTotalHT = commandeDTO.montantTotalht || 0;

  this.montantTotalRemise = commandeDTO.totalRemise || 0;
  this.montantTotalTTC = commandeDTO.montantTotalttc || 0;
  
  this.codeCommande = commandeDTO.codeCommande || '';
  this.showResult = commandeDTO.showResult || false;
}




  initMap(): void {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([10.1815, 36.8065]), // Tunis, Tunisia coordinates
        zoom: 13
      })
    });

    this.map.setTarget('map'); // Ensure map is rendered in the correct div
    this.map.on('click', (event) => this.onMapClick(event));
  }

  onMapClick(event: any): void {
    const lonLatCoordinates = toLonLat(event.coordinate);
    const coordinates: [number, number] = [lonLatCoordinates[0], lonLatCoordinates[1]];

    if (!this.marker) {
      this.marker = new Overlay({
        position: event.coordinate,
        positioning: 'center-center',
        element: document.createElement('div'),
        stopEvent: false
      });
      this.map.addOverlay(this.marker);
    } else {
      this.marker.setPosition(event.coordinate);
    }

    this.reverseGeocode(coordinates);
  }

  reverseGeocode(coordinates: [number, number]): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates[1]}&lon=${coordinates[0]}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.address = data.display_name;
      })
      .catch(error => {
        console.error('Error fetching reverse geocode:', error);
      });
  }

  openMapDialog(): void {
    this.dialogRef = this.dialog.open(this.mapDialogTemplate, {
      width: '80%',
      height: '80%'
    });

    this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.map = new Map({
          target: 'popupMap',
          layers: [
            new TileLayer({
              source: new OSM()
            })
          ],
          view: new View({
            center: fromLonLat([10.1815, 36.8065]), // Tunis, Tunisia coordinates
            zoom: 13
          })
        });

        this.map.on('singleclick', (event) => {
          this.onMapClick(event);
          this.dialogRef?.close();
        });
      }, 0);
    });
  }

  closeDialog(): void {
    this.dialogRef?.close();
  }




  processSelectedProduits(produits: any[]): void {
   
    produits.forEach(produit => {
      this.produitsList.push({
        id:produit.id,
        refCode: produit.refProduit,
        libelle: produit.libelle,
        quantity: 1,
        price: produit.prix,
        tax:produit.tax,
        netHT: produit.netHT,
        remise:produit.remise,
        netTTC:produit.netTTC,
        minQuantity : produit.quantity,
      });
    });
    this.produitsList.forEach(produit => {
      this.updateNetHT(produit)
    })
    
    // Log or perform any further processing with produitsList
    console.log('Produits List:', this.produitsList);

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
          console.log(this.clients);
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
          console.log(this.fournisseurs);
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
  
  
  
  

  addNewProductItem() {
    this.produitsList.push({
      id:0,
      refCode: '',
      libelle: '',
      quantity: 0,
      price: 0,
      netHT: 0,
      remise: 0,
      tax: 0,
      netTTC: 0,
      minQuantity:0,
      isNewProduct: true // Add this line
    });
  }

  addNewItem(): void {
    this.produitsList.push({
      id:0,
      refCode: '',
      libelle: '',
      quantity: 0,
      price: 0,
      netHT: 0,
      remise:0,
      netTTC:0,
      minQuantity:0,

    });
    
  }

  onNewProductChange(produit: any) {
    console.log(produit);
    if (produit.libelle) {
      produit.price =  100; // Ensure price is initialized correctly
      produit.quantity =  1; // Ensure quantity is initialized correctly
      produit.netHT = 0;
      produit.remise =  0; // Ensure remise is initialized correctly
      produit.tax =  0; // Ensure tax is initialized correctly
      produit.netTTC = 0;
      this.selectedProduit=produit;
      this.updateNetHT(produit);
      console.log(this.selectedProduit);
      console.log('New Product Values:', produit); // Recalculate totals
    }
  }



  updateProduitValues(produit: any): void {
    
    if (produit.refCode) {
      console.log("ref");
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
      console.log("lib");
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
    console.log(produit);
  }
  
  
  
showResult:boolean=false;
deleteProduit(index: number): void {
  const produit = this.produitsList[index];

  // Subtract the product values from the totals
  this.montantTotalHT -= produit.netHT || 0;
  this.montantTotalTTC -= produit.netTTC || 0;

  // Since remise should not be negative on the page, we use Math.abs()
  this.montantTotalRemise -= Math.abs(produit.netHT * (produit.remise / 100));
  this.montantTotalRemise = Math.abs(this.montantTotalRemise);

  // Remove the product from the list
  this.produitsList.splice(index, 1);

  // Recalculate montantTotalTTC
  this.montantTotalTTC = this.produitsList.reduce((total, p) => total + (p.netTTC || 0), 0);
  this.montantTotalTTC = Math.round(this.montantTotalTTC * 100) / 100;

  // If the produitsList is empty after removing the product, set showResult to false
  if (this.produitsList.length === 0) {
    this.showResult = false;
  }
}


montantTotalHT: number = 0;
montantTotalTTC: number = 0;
montantTotalRemise: number = 0;

updateNetHT(produit: any): void {
  // Ensure price and quantity are initialized correctly
  if (produit.isNewProduct) {
    produit.price = produit.price || 0;
    produit.quantity = produit.quantity || 1;
  } else {
    this.selectedProduit = this.produits.find(p => p.id === produit.id);
    if (this.selectedProduit) {
      produit.price = this.selectedProduit.prix;
      produit.tax = this.selectedProduit.tax || 0;
      produit.remise = this.selectedProduit.remise || 0;
    }
  }

  // Calculate netHT without considering tax
  const oldNetHT = produit.netHT || 0; // Store the previous netHT
  const netHTWithoutTax = produit.quantity * produit.price;

  // Calculate the total amount without tax
  const totalWithoutTax = netHTWithoutTax - (netHTWithoutTax * (produit.remise / 100));

  // Calculate the tax amount
  const taxAmount = totalWithoutTax * (produit.tax / 100);

  // Calculate netHT considering tax
  produit.netHT = totalWithoutTax + taxAmount;

  // Calculate netTTC
  produit.netTTC = produit.netHT + taxAmount;

  // Calculate the remise for this product
  const remiseAmount = oldNetHT - produit.netHT;

  // Update total remise
  this.montantTotalRemise += Math.abs(remiseAmount);

  // Update montantTotalHT and montantTotalTTC
  this.montantTotalHT += (produit.netHT - oldNetHT);
  this.montantTotalTTC = this.produitsList.reduce((total, p) => total + (p.netTTC || 0), 0);
  this.montantTotalTTC = Math.round(this.montantTotalTTC * 100) / 100;

  // Set showResult to true to display results
  this.showResult = true;
}





onClientChange(): void {
  this.isClientSelected = true;
  const selectedClientObj = this.clients.find(client => client.id === parseInt(this.selectedClient));
  if (selectedClientObj) {
    console.log(selectedClientObj);
    this.clientNom = selectedClientObj.nom;
    this.clientAdresse = selectedClientObj.address;
    this.clientNumero = selectedClientObj.numero_telephone;
    this.clientEmail = selectedClientObj.email;
  }
}

onFournisseurChange(): void {
  this.isFournisseurSelected = true;
  const selectedFournisseurObj = this.fournisseurs.find(fournisseur => fournisseur.id === parseInt(this.selectedFournisseur));
  if (selectedFournisseurObj) {
    console.log(selectedFournisseurObj);
    this.fournisseurNom = selectedFournisseurObj.nom;
    this.fournisseurAdresse = selectedFournisseurObj.address;
    this.fournisseurNumero = selectedFournisseurObj.numero;
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


  onAddressTypeChange() {
    if (this.addressType === 'SURPLACE') {
      this.address = 'SURPLACE';
    } else {
      this.address = '';
    }
  }




codeCommande:String='';
showAlert:boolean=false;

SaveCommande(): void {
  if (this.validateFields()) {
    const elementFacturesDTO = this.produitsList.map(produit => ({
      ProduitId: produit.id,
      refProduit: produit.refCode,
      libelle: produit.libelle,
      quantity: produit.quantity,
      prix: produit.price,
      tax: produit.tax,
      remise: produit.remise,
      netHT: produit.netHT,
      netTTC: produit.netTTC,
    }));

    const newCommandeDTO: any = {
      id: this.commandeId,
      dateCommande: this.dateCommande,
      montantTotal: this.montantTotalTTC,
      adresse: this.address,
      fournisseurNom: this.fournisseurNom,
      clientNom: this.clientNom,
      type_commande: this.typeCommande,
      elementsFacture: elementFacturesDTO,
      fournisseur_id: this.typeCommande === 'OUT' ? null : this.selectedFournisseur,
      client_id: this.typeCommande === 'IN' ? null : this.selectedClient,
      montantTotalttc: this.montantTotalTTC,
      montantTotalht: this.montantTotalHT,
      totalTax: this.montantTotalHT - this.montantTotalTTC,
      totalRemise: this.montantTotalRemise,
    };

    // Using SweetAlert2 for confirmation
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir enregistrer cette commande ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, enregistrer'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with HTTP POST
        this.http.post<any>('http://localhost:8083/commandes/SaveCommande', newCommandeDTO).subscribe(
          response => {
            const list = this.session.retrieve('roles');
            if (list.includes('ADMIN')) {
              this.router.navigate(['/admin/list-facture']);
            } else if (list.includes('FACTURE')) {
              this.router.navigate(['/facture/list-facture']);
            }
          },
          error => {
            const list = this.session.retrieve('roles');
            if (list.includes('ADMIN')) {
              this.router.navigate(['/admin/list-facture']);
            } else if (list.includes('FACTURE')) {
              this.router.navigate(['/facture/list-facture']);
            }
          }
        );
      }
    });
  }
}






  onNewCustomSave(): void {
    if (this.typeCommande === 'IN') {
      this.saveFournisseur();
    } else {
      this.saveClient();
    }
  }

  saveFournisseur(): void {
    const fournisseur: any = {
      nom: this.fournisseurNom,
      numero: this.fournisseurNumero,
      address: this.fournisseurAdresse
    };

    // Show entered values in SweetAlert and ask for confirmation
    Swal.fire({
      title: 'Confirmer l\'ajout du Fournisseur',
      html: `
        <p><strong>Nom:</strong> ${fournisseur.nom}</p>
        <p><strong>Numéro:</strong> ${fournisseur.numero}</p>
        <p><strong>Adresse:</strong> ${fournisseur.address}</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with HTTP POST request
        this.http.post<any>('http://localhost:8083/fournisseurs/add', fournisseur).subscribe(
          response => {
            Swal.fire({
              title: 'Nouveau Fournisseur ajouté!',
              text: `Le fournisseur ${fournisseur.nom} a été ajouté avec succès.`,
              icon: 'success',
              confirmButtonText: 'Confirmé'
            }).then((result) => {
              if (result.isConfirmed) {
                this.isNewCustom = true;
                this.fetchFournisseurs(); // Fetch updated data
              }
            });
          },
          error => {
            console.error('Erreur lors de l\'ajout du fournisseur:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Le fournisseur n\'a pas pu être ajouté. Veuillez réessayer plus tard.'
            });
          }
        );
      }
    });
  }

  saveClient(): void {
    const client: any = {
      nom: this.clientNom,
      email: this.clientEmail,
      numero_telephone: this.clientNumero,
      address: this.clientAdresse
    };

    // Show entered values in SweetAlert and ask for confirmation
    Swal.fire({
      title: 'Confirmer l\'ajout du Client',
      html: `
        <p><strong>Nom:</strong> ${client.nom}</p>
        <p><strong>Email:</strong> ${client.email}</p>
        <p><strong>Numéro de téléphone:</strong> ${client.numero_telephone}</p>
        <p><strong>Adresse:</strong> ${client.address}</p>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with HTTP POST request
        this.http.post<any>('http://localhost:8083/clients/add', client).subscribe(
          response => {
            Swal.fire({
              title: 'Nouveau Client ajouté!',
              text: `Le client ${client.nom} a été ajouté avec succès.`,
              icon: 'success',
              confirmButtonText: 'Confirmé'
            }).then((result) => {
              if (result.isConfirmed) {
                this.isNewCustom = true;
                this.fetchClients(); // Fetch updated data
              }
            });
          },
          error => {
            console.error('Erreur lors de l\'ajout du client:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Le client n\'a pas pu être ajouté. Veuillez réessayer plus tard.'
            });
          }
        );
      }
    });
  }


  alertMessage: string = '';
  countdown: number = 10;
  successMessage: string = '';
  showAlert1:boolean = false;
  showAlert2:boolean = true;
  
  showSuccessAlert(message: string) {
    this.successMessage = message;
    this.showAlert1 = true;
    this.countdown = 12; // Reset countdown
    this.startCountdown();
  }
  showErrorAlert(message: string) {
    this.alertMessage = message;
    this.showAlert2 = true;
    this.countdown = 15; // Reset countdown
    this.startCountdown();
  }
  // Function to start the countdown
  startCountdown() {
    setTimeout(() => {
      this.countdown--;
      if (this.countdown > 0) {
        this.startCountdown();
      } else {
        this.hideAlert();
      }
    }, 1000);
  }

  // Function to hide the alert
  hideAlert() {
    this.showAlert = false;
  }

  // Function to validate fields
  validateFields(): boolean {
    const fieldsToCheck = [
      this.dateCommande,
      this.addressType,
      this.addressType === 'LIVRAISON' ? this.address : true,
      this.typeCommande,
      this.typeCommande === 'IN' ? this.selectedFournisseur : true,
      this.typeCommande === 'IN' && this.selectedFournisseur === 'custom' ? this.fournisseurNom : true,
      this.typeCommande === 'IN' && this.selectedFournisseur === 'custom' ? this.fournisseurAdresse : true,
      this.typeCommande === 'IN' && this.selectedFournisseur === 'custom' ? this.fournisseurNumero : true,
      this.typeCommande === 'OUT' ? this.selectedClient : true,
      this.typeCommande === 'OUT' && this.selectedClient === 'custom' ? this.clientNom : true,
      this.typeCommande === 'OUT' && this.selectedClient === 'custom' ? this.clientEmail : true,
      this.typeCommande === 'OUT' && this.selectedClient === 'custom' ? this.clientAdresse : true,
      this.typeCommande === 'OUT' && this.selectedClient === 'custom' ? this.clientNumero : true,
    ];
  console.log(fieldsToCheck);
    const productFieldsToCheck = this.produitsList.every(produit => 
      produit.refCode && produit.libelle && produit.quantity && produit.price &&
      produit.netHT &&  produit.tax && produit.netTTC
    );
  
    const fieldsValid = fieldsToCheck.every(field => field !== null && field !== undefined && field !== '');
    
    if (!fieldsValid || !productFieldsToCheck) {
      this.showErrorAlert('Certains champs sont vides, veuillez les remplir.');
      return false;
    }
  
    return true;
  }
  




}
