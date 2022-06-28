import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarsystemComponent } from './solarsystem.component';

describe('SolarsystemComponent', () => {
  let component: SolarsystemComponent;
  let fixture: ComponentFixture<SolarsystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarsystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
