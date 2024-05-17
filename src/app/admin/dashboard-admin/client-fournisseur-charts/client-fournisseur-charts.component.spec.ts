import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFournisseurChartsComponent } from './client-fournisseur-charts.component';

describe('ClientFournisseurChartsComponent', () => {
  let component: ClientFournisseurChartsComponent;
  let fixture: ComponentFixture<ClientFournisseurChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientFournisseurChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientFournisseurChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
