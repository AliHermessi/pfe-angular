import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFactureComponent } from './home-facture.component';

describe('HomeFactureComponent', () => {
  let component: HomeFactureComponent;
  let fixture: ComponentFixture<HomeFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeFactureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
