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
      
    
      
    
  }
     
}
