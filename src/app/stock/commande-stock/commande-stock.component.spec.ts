import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeStockComponent } from './commande-stock.component';

describe('CommandeStockComponent', () => {
  let component: CommandeStockComponent;
  let fixture: ComponentFixture<CommandeStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommandeStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
