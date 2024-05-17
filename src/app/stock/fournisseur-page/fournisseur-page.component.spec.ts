import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurPageComponent } from './fournisseur-page.component';

describe('FournisseurPageComponent', () => {
  let component: FournisseurPageComponent;
  let fixture: ComponentFixture<FournisseurPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FournisseurPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FournisseurPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
