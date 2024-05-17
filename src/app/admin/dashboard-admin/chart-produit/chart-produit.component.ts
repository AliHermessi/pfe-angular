import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { format, subDays } from 'date-fns';

@Component({
  selector: 'app-chart-produit',
  templateUrl: './chart-produit.component.html',
  styleUrls: ['./chart-produit.component.css']
})
export class ChartProduitComponent implements OnInit {
  products: any[] = [];
  selectedProductId: number = 0;
  startDate: string = '';
  endDate: string = '';
  chartData: any;
  chartOptions: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchProducts();
    this.setInitialDates();
    this.chartData = {
      labels: [],
      datasets: []
    };
    this.initializeChartOptions();
    this.updateChart();  // Update chart on initialization with default data
  }

  fetchProducts(): void {
    this.http.get<any[]>('http://localhost:8083/produits/getAll')
      .subscribe(data => {
        this.products = data;
      });
  }

  setInitialDates(): void {
    const today = new Date();
    this.endDate = format(today, 'yyyy-MM-dd');
    this.startDate = format(subDays(today, 7), 'yyyy-MM-dd');
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
      },
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any, data: any) {
              if (!data.datasets || !data.datasets[tooltipItem.datasetIndex]) {
                return '';
              }
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
              const currentValue = dataset.data[tooltipItem.index];
              const percentage = Math.round((currentValue / total) * 100);
              return `${data.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
            }
          }
        }
      }
    };
  }

  updateChart(): void {
    this.fetchPVEData(this.selectedProductId, this.startDate, this.endDate);
  }

  fetchPVEData(produitId: number, startDate: string, endDate: string): void {
    this.http.get<any[]>('http://localhost:8083/dashboard/AllPVE')
      .subscribe(data => {
        this.processPVEData(data, produitId, startDate, endDate);
      });
  }

  processPVEData(data: any[], produitId: number, startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    const totalCosts: number[] = [];
    const totalRevenues: number[] = [];
    const totalNetHTs: number[] = [];

    days.forEach(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      let dayTotalCost = 0;
      let dayTotalRevenue = 0;
      let dayTotalNetHT = 0;

      data.forEach(item => {
        if (item.produitId === produitId && format(new Date(item.date), 'yyyy-MM-dd') === dayString) {
          if (item.type_commande === 'IN') {
            dayTotalCost += item.totalCout;
          } else if (item.type_commande === 'OUT') {
            dayTotalRevenue += item.quantity * item.prix;
            dayTotalNetHT += item.netHT - item.totalCout;
          }
        }
      });

      totalCosts.push(dayTotalCost);
      totalRevenues.push(dayTotalRevenue);
      totalNetHTs.push(dayTotalNetHT);
    });

    this.chartData = {
      labels: days.map(day => format(day, 'yyyy-MM-dd')),
      datasets: [
        {
          type: 'bar',
          label: 'Total Cost',
          backgroundColor: '#42A5F5',
          data: totalCosts
        },
        {
          type: 'bar',
          label: 'Total Revenue',
          backgroundColor: '#66BB6A',
          data: totalRevenues
        },
        {
          type: 'bar',
          label: 'Total Net HT',
          borderColor: '#FFA726',
          backgroundColor: '#FFA726',
          fill: false,
          data: totalNetHTs
        }
      ]
    };
    console.log('Chart data:', this.chartData);

  }
}
