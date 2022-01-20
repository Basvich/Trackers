import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgGetSrvComponent } from './dlg-get-srv.component';

describe('DlgGetSrvComponent', () => {
  let component: DlgGetSrvComponent;
  let fixture: ComponentFixture<DlgGetSrvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgGetSrvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgGetSrvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
