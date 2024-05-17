// commande.model.ts

import { ElementFacture } from './element-facture.model';

export class Commande {
  
  dateCommande: Date;
  montantTotal: number;
  adresse: string;
  fournisseurName: string;
  clientName: string;
  fournisseurId?: number; // new field
  clientId?: number;
  type_commande: string;
  elementFactures: ElementFacture[];

  constructor(
    
    dateCommande: Date,
    adresse: string,
    fournisseurName: string,
    clientName: string,
    clientId: number,
  fournisseurId: number,
    type_commande: string,
    montantTotal: number,
    elementFactures: ElementFacture[],
  ) {
    this.dateCommande = dateCommande;
    this.montantTotal = montantTotal; 
    this.adresse = adresse;
    this.fournisseurName = fournisseurName;
    this.clientName = clientName;
    this.type_commande = type_commande;
    this.elementFactures = elementFactures;
    
    this.clientId=clientId;
    this.fournisseurId=fournisseurId;

  }

  
}
