import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedProduitsSubject = new BehaviorSubject<any[]>([]);
  private activeTabAdminSubject = new BehaviorSubject<string>('');
  

  selectedProduits$ = this.selectedProduitsSubject.asObservable();
  activeTabAdmin$ = this.activeTabAdminSubject.asObservable();

  private commandeSubject = new BehaviorSubject<any | null>(null);
  commande$ = this.commandeSubject.asObservable();

  setCommande(commande: any) {
    this.commandeSubject.next(commande);
  }

  clearCommande() {
    this.commandeSubject.next(null);
  }

  setSelectedProduits(produits: any[]): void {
    this.selectedProduitsSubject.next(produits);
  }

  getActiveTabAdmin(): string {
    return this.activeTabAdminSubject.getValue();
  }

  clearSelectedProduits(): void {
    this.selectedProduitsSubject.next([]);
  }
  clearactiveTabAdmin(): void {
    this.activeTabAdminSubject.next('');
  }

  setActiveTabAdmin(tab: string): void {
    this.activeTabAdminSubject.next(tab);
  }
}
