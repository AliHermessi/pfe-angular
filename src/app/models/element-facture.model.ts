// element-facture.model.ts

export class ElementFacture {
  refProduit:String;
    libelle: string;
    quantity: number;
    tax: number;
    prix: number;
    remise: number;
  
    constructor(
      refProduit:String,
      libelle: string,
      quantity: number,
      
      tax: number,
    prix: number,
    remise: number,
    ) {
      this.refProduit = refProduit;
      this.libelle = libelle;
      this.quantity = quantity;
      this.prix = prix;
      this.tax = tax;
      this.remise = remise;
    }
  }
  