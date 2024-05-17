import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProduitAComponent } from './list-produit-a.component';

describe('ListProduitAComponent', () => {
  let component: ListProduitAComponent;
  let fixture: ComponentFixture<ListProduitAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListProduitAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListProduitAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
