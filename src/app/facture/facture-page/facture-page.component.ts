import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sharedData$ } from '../list-facture/shared-data';
import { SharedService } from '../../shared/shared.service';
import { response } from 'express';
@Component({
  selector: 'app-facture-page',
  templateUrl: './facture-page.component.html',
  styleUrls: ['./facture-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacturePageComponent implements OnInit {
  factureDTO: any  = [];
  elementFactures: any[] = [];
  newElementFactures: any[] = [];
  company : any = [];
  
  storedId = sessionStorage.getItem("factureId");
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef,private sharedService:SharedService) { }

  ngOnInit(): void {
      
      this.fetchCompany();
      this.fetchElementFacture(); 
      
    
  }
      fetchCompany():void{

        this.http.get<any[]>('http://localhost:8083/auth/entreprise').subscribe(
          response => {
            this.company=response;
            console.log(response);
          }
        )
      }

      fetchElementFacture(): void {
        this.factureDTO = this.sharedService.getFacture();
        console.log("Retrieved factureDTO from shared service:", this.factureDTO);
      
        // Check if the retrieved value is not null or undefined
        if (this.factureDTO) {
          // If factureDTO is available, set the session storage
          sessionStorage.setItem("factureId", String(this.factureDTO.id));
          console.log("Set factureId in session storage:", this.factureDTO.id);
        } else {
          // If factureDTO is not available, retrieve the id from session storage
          
          console.log("Retrieved factureId from session storage:", this.storedId);
          if (this.storedId) {
            
            // Fetch factureDTO using the retrieved id
            this.http.get<any[]>(`http://localhost:8083/factures/get/${this.storedId}`).subscribe(
              response => {
                this.factureDTO = response;
                console.log("Fetched factureDTO:", this.factureDTO);
              }
            );
          } else {
            console.log("FactureId is not available in session storage.");
          }
        }
      }
      
      
    getTotalHT(): number {
      let totalHT = 0;
      for (const element of this.factureDTO.elementFactures) {
        totalHT += element.quantity * element.prix * (1 - element.remise / 100);
      }
      return totalHT;
    }
    
    getTotalTVA(): number {
      let totalHT = this.getTotalHT();
      let totalTVA = 0;
      for (const element of this.factureDTO.elementFactures) {
        totalTVA += totalHT * (element.tax / 100);
      }
      return totalTVA;
    }
    
    getTotalTTC(): number {
      let totalHT = this.getTotalHT();
      let totalTVA = this.getTotalTVA();
      return totalHT + totalTVA;
    }
    printInvoice() {
      window.print();
    }
  
}
