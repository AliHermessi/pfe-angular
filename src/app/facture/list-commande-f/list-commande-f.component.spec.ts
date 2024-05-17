import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCommandeFComponent } from './list-commande-f.component';

describe('ListCommandeFComponent', () => {
  let component: ListCommandeFComponent;
  let fixture: ComponentFixture<ListCommandeFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCommandeFComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCommandeFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
