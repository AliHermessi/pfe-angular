import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-produit',
  templateUrl: './chart-produit.component.html',
  styleUrls: ['./chart-produit.component.css']
})
export class ChartProduitComponent implements OnInit {
  products: any[] = [];
  selectedProductId: number = 0;
  startDate: string='';
  endDate: string='';
  chartData: any;
  chartOptions: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchProducts();
    this.initializeChartOptions();
    this.setInitialDates();
    this.chartData = {
      labels: [],
      datasets: []
    };
  }

  fetchProducts(): void {
    this.http.get<any[]>('http://localhost:8083/produits/getAll')
      .subscribe(data => {
        this.products = data;
      });
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Values'
          }
        }
      }
    };
  }

  setInitialDates(): void {
    const today = new Date();
    this.endDate = this.formatDate(today);
    this.startDate = this.formatDate(new Date(today.setDate(today.getDate() - 7))); // Last 7 days
  }

  updateChart(): void {
    this.fetchPVEData(this.selectedProductId, new Date(this.startDate), new Date(this.endDate));
  }

  fetchPVEData(produitId: number, startDate: Date, endDate: Date): void {
    this.http.get<any[]>('http://localhost:8083/dashboard/AllPVE')
      .subscribe(data => {
        console.log('Fetched PVE Data:', data);
        this.processPVEData(data, produitId, startDate, endDate);
      });
  }

  processPVEData(data: any[], produitId: number, startDate: Date, endDate: Date): void {
    const dates: Date[] = [];
    let date = new Date(startDate);
    while (date <= endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    const dailySales = dates.map(date => ({
        date,
        total: 0,
        totalCount: 0,
        netHT: 0
    }));

    console.log('Initialized Daily Sales:', dailySales);

    data.forEach(pve => {
      console.log(pve.produitId === produitId);
      console.log('pve.produitId:', pve.produitId);
      console.log('produitId:', produitId);
      if (pve.produitId.toString().trim() === produitId.toString().trim()) {
            const saleDate = new Date(pve.date);
            const saleDateIndex = dailySales.findIndex(d => d.date.toDateString() === saleDate.toDateString());
            if (saleDateIndex >= 0) {
                dailySales[saleDateIndex].total += pve.total;
                dailySales[saleDateIndex].totalCount += pve.quantity; // Assuming quantity is the total count
                dailySales[saleDateIndex].netHT += pve.netHT;
            }
        }
    });

    console.log('Processed Daily Sales:', dailySales);

    this.chartData = {
        labels: dailySales.map(s => s.date), // Use ISOString to ensure consistent format
        datasets: [
            {
                type: 'bar',
                label: 'Total Sales',
                data: dailySales.map(s => s.total),
                borderColor: '#5AA454',
                backgroundColor: '#5AA454',
                fill: false
            },
            {
                type: 'bar',
                label: 'Total Count',
                data: dailySales.map(s => s.totalCount),
                borderColor: '#A10A28',
                backgroundColor: '#A10A28',
                fill: false
            },
            {
                type: 'bar',
                label: 'Net HT',
                data: dailySales.map(s => s.netHT),
                borderColor: '#C7B42C',
                fill: false
            }
        ]
    };

    console.log('Chart Data:', this.chartData);
}


  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
