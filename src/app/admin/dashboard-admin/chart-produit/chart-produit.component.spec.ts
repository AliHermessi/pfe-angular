import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartProduitComponent } from './chart-produit.component';

describe('ChartProduitComponent', () => {
  let component: ChartProduitComponent;
  let fixture: ComponentFixture<ChartProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartProduitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
