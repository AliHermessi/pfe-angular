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
      cout:this.cout,
      quantite: this.quantite,
      date_arrivage: this.date_arrivage,
      categorieId:  this.categorieIDn,
      fournisseurId: this.fournisseurIDn,
      minStock: this.minStock,
      maxStock: this.maxStock,
      tax: this.taxe,
      status:this.status,
      brand:this.brand
    };

    this.http.post<any>('http://localhost:8083/produits/add', produit)
      .subscribe(
        response => {
          console.log(produit);
          setTimeout(() => {
            this.showAlert = false;
          }, 5000); // Hide alert after 5 seconds
          this.resetFields();
        },
        error => {
          console.error('Error adding produit:', error);
        }
      );
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
