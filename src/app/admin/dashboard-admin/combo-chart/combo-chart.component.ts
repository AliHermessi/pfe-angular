import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-combo-chart',
  templateUrl: './combo-chart.component.html',
  styleUrl: './combo-chart.component.css'
})
export class ComboChartComponent  implements OnInit {
  totalValues: any = [];
  data: any[] = [];
  cardColor:string="000000";
  loading: boolean = false;
  error: string | null = null;
  view: [number, number] = [700, 400]; // Adjust the size as needed
  colorScheme: Color = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#FF0000', '#00FF00'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getTotalInfo();
  }

  getTotalInfo(): void {
    const now = new Date();
    const startDate = format(startOfWeek(now), 'yyyy-MM-dd');
    const endDate = format(endOfWeek(now), 'yyyy-MM-dd');

    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

 

    this.http.get<any>('http://localhost:8083/dashboard/TotalValues', { params })
      .subscribe(
        data => {
          console.log(data);
          this.totalValues = data;
          this.data = this.transformToNumberCardData(data);
          
        },
        error => {
          this.error = 'Failed to fetch total values';
          console.log(error);
        }
      );
  }

  transformToNumberCardData(totalValues: any): any[] {
    return [
      {
        name: 'Total Commande',
        value: totalValues.totalCommande
      },
      {
        name: 'Total Facture',
        value: totalValues.totalFacture
      },
      {
        name: 'Total Produits',
        value: totalValues.totalProduits
      },
      {
        name: 'Total Cost',
        value: totalValues.totalCost
      },
      {
        name: 'Total Revenue',
        value: totalValues.totalRevenu
      },
      {
        name: 'Empty',
        value: 0
      }
    ];
  }
}
