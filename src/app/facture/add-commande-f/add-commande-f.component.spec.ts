import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommandeFComponent } from './add-commande-f.component';

describe('AddCommandeFComponent', () => {
  let component: AddCommandeFComponent;
  let fixture: ComponentFixture<AddCommandeFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCommandeFComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCommandeFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
