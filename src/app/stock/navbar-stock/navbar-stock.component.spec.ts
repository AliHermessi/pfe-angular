import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarStockComponent } from './navbar-stock.component';

describe('NavbarStockComponent', () => {
  let component: NavbarStockComponent;
  let fixture: ComponentFixture<NavbarStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
