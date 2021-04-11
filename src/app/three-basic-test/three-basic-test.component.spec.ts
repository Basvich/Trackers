import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeBasicTestComponent } from './three-basic-test.component';

describe('ThreeBasicTestComponent', () => {
  let component: ThreeBasicTestComponent;
  let fixture: ComponentFixture<ThreeBasicTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeBasicTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeBasicTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
