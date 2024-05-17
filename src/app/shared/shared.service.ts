import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
private facture : any[] = [];
  constructor() { }
  setFacture(data:any[]){
    console.log("setted");
    this.facture=data;
  }

  getFacture(){
    console.log("got it");
  return this.facture
  }
}
