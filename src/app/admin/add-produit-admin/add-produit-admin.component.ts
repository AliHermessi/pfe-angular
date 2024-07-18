import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-produit-admin',
  templateUrl: './add-produit-admin.component.html',
  styleUrls: ['./add-produit-admin.component.css']
})
export class AddProduitAdminComponent {

  constructor(private http: HttpClient) {}

  produits: any[] = [];
  categories: any[] = [];
  fournisseurs: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 7;
  libelle: string = '';
  description: string = '';
  prix: number = 0;
  quantite: number = 0;
  date_arrivage: string = '';
  categorieIDn: number = 0;
  fournisseurIDn: number = 0;
  status: String = '';
  cout: number = 0;
  brand: String = '';
  customStatus: string = '';
  showAlert: boolean = false;
  addTriggered: boolean = false;
  showAddButton: boolean = false;
  taxe: number = 0;
  minStock: number = 0;
  maxStock: number = 0;

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchFournisseurs();
  }

  fetchCategories(): void {
    this.http.get<any[]>('http://localhost:8083/categories/getAll')
      .subscribe(
        response => {
          this.categories = response;
        },
        error => {
          console.error('Error fetching categories:', error);
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

  addProduit(): void {
    const produit = {
        libelle: this.libelle,
        description: this.description,
        prix: this.prix,
        cout: this.cout,
        quantite: this.quantite,
        date_arrivage: this.date_arrivage,
        categorieId: this.categorieIDn,
        fournisseurId: this.fournisseurIDn,
        minStock: this.minStock,
        maxStock: this.maxStock,
        tax: this.taxe,
        status: this.status,
        brand: this.brand
    };

    Swal.fire({
        title: 'Confirmer l\'ajout du produit',
        html: `
            <p><strong>Libellé:</strong> ${produit.libelle}</p>
            <p><strong>Description:</strong> ${produit.description}</p>
            <p><strong>Prix:</strong> ${produit.prix}</p>
            <p><strong>Coût:</strong> ${produit.cout}</p>
            <p><strong>Quantité:</strong> ${produit.quantite}</p>
            <p><strong>Date d'arrivage:</strong> ${produit.date_arrivage}</p>
            <p><strong>ID Catégorie:</strong> ${produit.categorieId}</p>
            <p><strong>ID Fournisseur:</strong> ${produit.fournisseurId}</p>
            <p><strong>Stock Min:</strong> ${produit.minStock}</p>
            <p><strong>Stock Max:</strong> ${produit.maxStock}</p>
            <p><strong>Taxe:</strong> ${produit.tax}</p>
            <p><strong>Statut:</strong> ${produit.status}</p>
            <p><strong>Marque:</strong> ${produit.brand}</p>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            this.http.post<any>('http://localhost:8083/produits/add', produit)
                .subscribe(
                    response => {
                        console.log(produit);
                        Swal.fire(
                            'Succès!',
                            'Le produit a été ajouté avec succès.',
                            'success'
                        );
                        this.resetFields();
                    },
                    error => {
                        console.error('Erreur lors de l\'ajout du produit:', error);
                        Swal.fire(
                            'Erreur!',
                            'Une erreur s\'est produite lors de l\'ajout du produit.',
                            'error'
                        );
                    }
                );
        }
    });
}


  resetFields(): void {
    this.libelle = '';
    this.description = '';
    this.prix = 0;
    this.quantite = 0;
    this.date_arrivage = '';
    this.categorieIDn = 0;
    this.fournisseurIDn = 0;
    this.brand = '';
    this.customStatus = '';
    this.taxe = 0;
    this.minStock = 0;
    this.maxStock = 0;
  }

  addCustomFournisseur() {
    Swal.fire({
      title: 'Add Custom Fournisseur',
      html: `<input id="swal-input1" class="swal2-input" placeholder="Nom">
             <input id="swal-input2" class="swal2-input" placeholder="Address">
             <input id="swal-input3" class="swal2-input" placeholder="Numero">`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Save',
      preConfirm: () => {
        const nom = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const address = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const numero = (document.getElementById('swal-input3') as HTMLInputElement).value;
        this.saveFournisseur({ nom, address, numero });
      }
    });
  }

  addCustomCategorie() {
    Swal.fire({
      title: 'Add Custom Categorie',
      html: `<input id="swal-input1" class="swal2-input" placeholder="Nom">
             <input id="swal-input2" class="swal2-input" placeholder="Description">`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Save',
      preConfirm: () => {
        const nom = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const description = (document.getElementById('swal-input2') as HTMLInputElement).value;
        this.saveCategorie({ nom, description });
      }
    });
  }

  saveFournisseur(data: any) {
    this.http.post('http://localhost:8083/fournisseurs/add', data).subscribe(response => {
      console.log('Custom fournisseur added successfully:', response);
      this.fetchFournisseurs();
      Swal.fire('Success', 'Custom fournisseur added successfully', 'success');
    }, error => {
      console.error('Error adding custom fournisseur:', error);
      Swal.fire('Error', 'Failed to add custom fournisseur', 'error');
    });
  }

  saveCategorie(data: any) {
    this.http.post('http://localhost:8083/categories/add', data).subscribe(response => {
      console.log('Custom categorie added successfully:', response);
      this.fetchCategories();
      Swal.fire('Success', 'Custom categorie added successfully', 'success');
    }, error => {
      console.error('Error adding custom categorie:', error);
      Swal.fire('Error', 'Failed to add custom categorie', 'error');
    });
  }

  triggerAdd(): void {
    this.addTriggered = true;
    this.showAddButton = this.checkFormValidity();
  }

  checkFormValidity(): boolean {
    return !!this.libelle && !!this.description && !!this.prix && !!this.cout &&
      !!this.quantite && !!this.brand && !!this.fournisseurIDn && !!this.categorieIDn && !!this.date_arrivage;
  }
}
