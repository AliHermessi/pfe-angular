import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-fournisseur-charts',
  templateUrl: './client-fournisseur-charts.component.html',
  styleUrls: ['./client-fournisseur-charts.component.css']
})
export class ClientFournisseurChartsComponent implements OnInit {
  suppliers: any[] = [];
  clients: any[] = [];
  chartOptions: any;
  testData: any[] = [
    {
      produitId: 1,
      barcode: '123456789',
      libelle: 'Product A',
      type_commande: 'IN',
      quantity: 10,
      prix: 20,
      cout: 15,
      netHT: 150,
      totalCout: 150,
      total: 200,
      date: new Date(),
      fournisseurName: 'Supplier A',
      categorieName: 'Category A',
      clientName: ''
    },
    {
      produitId: 2,
      barcode: '987654321',
      libelle: 'Product B',
      type_commande: 'OUT',
      quantity: 15,
      prix: 25,
      cout: 18,
      netHT: 200,
      totalCout: 200,
      total: 300,
      date: new Date(),
      fournisseurName: '',
      categorieName: 'Category B',
      clientName: 'Client X'
    },
    {
      produitId: 3,
      barcode: '111111111',
      libelle: 'Product C',
      type_commande: 'IN',
      quantity: 20,
      prix: 30,
      cout: 20,
      netHT: 250,
      totalCout: 250,
      total: 400,
      date: new Date(),
      fournisseurName: 'Supplier B',
      categorieName: 'Category A',
      clientName: ''
    },
    {
      produitId: 4,
      barcode: '222222222',
      libelle: 'Product D',
      type_commande: 'OUT',
      quantity: 8,
      prix: 18,
      cout: 12,
      netHT: 120,
      totalCout: 120,
      total: 180,
      date: new Date(),
      fournisseurName: '',
      categorieName: 'Category C',
      clientName: 'Client Y'
    },
    {
      produitId: 5,
      barcode: '333333333',
      libelle: 'Product E',
      type_commande: 'IN',
      quantity: 12,
      prix: 25,
      cout: 18,
      netHT: 200,
      totalCout: 200,
      total: 300,
      date: new Date(),
      fournisseurName: 'Supplier A',
      categorieName: 'Category B',
      clientName: ''
    },
    {
      produitId: 6,
      barcode: '444444444',
      libelle: 'Product F',
      type_commande: 'OUT',
      quantity: 10,
      prix: 20,
      cout: 15,
      netHT: 150,
      totalCout: 150,
      total: 200,
      date: new Date(),
      fournisseurName: '',
      categorieName: 'Category A',
      clientName: 'Client Z'
    }
  ];
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchPVEData();
    this.chartOptions = {
      legend: {
        position: 'bottom' // Adjust the position of the legend
      },
      tooltips: {
        enabled: true, // Enable tooltips
        callbacks: {
          label: function(tooltipItem: any, data: any) {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const currentValue = dataset.data[tooltipItem.index];
            const percentage = Math.round((currentValue / total) * 100);
            return `${data.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
          }
        }
      }
    };
    console.log(this.clients);
    console.log(this.suppliers);
  }

  fetchPVEData(): void {
    this.http.get<any[]>('http://localhost:8083/dashboard/AllPVE')
      .subscribe( data => {
        this.processPVEData(data);
      });
  }

  processPVEData(data: any[]): void {
    console.log(data);
    const supplierData: any = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    };
    const clientData: any = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    };
    data.forEach(item => {
      if (item.type_commande === 'IN') {
        const supplierIndex = supplierData.labels.findIndex((s: any) => s === item.fournisseurName);
        if (supplierIndex === -1) {
          supplierData.labels.push(item.fournisseurName);
          supplierData.datasets[0].data.push(item.quantity);
          supplierData.datasets[0].backgroundColor.push('#' + Math.floor(Math.random()*16777215).toString(16));
        } else {
          supplierData.datasets[0].data[supplierIndex] += item.quantity;
        }
      } else if (item.type_commande === 'OUT') {
        const clientIndex = clientData.labels.findIndex((c: any) => c === item.clientName);
        if (clientIndex === -1) {
          clientData.labels.push(item.clientName);
          clientData.datasets[0].data.push(item.quantity);
          clientData.datasets[0].backgroundColor.push('#' + Math.floor(Math.random()*16777215).toString(16));
        } else {
          clientData.datasets[0].data[clientIndex] += item.quantity;
        }
      }
    });
    this.suppliers = supplierData;
    this.clients = clientData;
  }
}
