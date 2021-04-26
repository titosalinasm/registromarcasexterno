import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsesoriaVirtualComponent } from './asesoria-virtual.component';

describe('AsesoriaVirtualComponent', () => {
  let component: AsesoriaVirtualComponent;
  let fixture: ComponentFixture<AsesoriaVirtualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsesoriaVirtualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsesoriaVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
