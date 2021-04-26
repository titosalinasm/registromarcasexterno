import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioridadExtranjeraComponent } from './prioridad-extranjera.component';

describe('PrioridadExtranjeraComponent', () => {
  let component: PrioridadExtranjeraComponent;
  let fixture: ComponentFixture<PrioridadExtranjeraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrioridadExtranjeraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrioridadExtranjeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
