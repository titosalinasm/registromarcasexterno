import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesnizaComponent } from './clasesniza.component';

describe('ClasesnizaComponent', () => {
  let component: ClasesnizaComponent;
  let fixture: ComponentFixture<ClasesnizaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasesnizaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasesnizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
