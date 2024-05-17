import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarFactureComponent } from './navbar-facture.component';

describe('NavbarFactureComponent', () => {
  let component: NavbarFactureComponent;
  let fixture: ComponentFixture<NavbarFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarFactureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
