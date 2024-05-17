import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { PVE } from '../../models/pve-model';



@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

totalValues:any=[];

  constructor(private http:HttpClient) {}

  ngOnInit(): void {
  }

}
