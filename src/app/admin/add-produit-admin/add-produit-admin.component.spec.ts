import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProduitAdminComponent } from './add-produit-admin.component';

describe('AddProduitAdminComponent', () => {
  let component: AddProduitAdminComponent;
  let fixture: ComponentFixture<AddProduitAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProduitAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProduitAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
