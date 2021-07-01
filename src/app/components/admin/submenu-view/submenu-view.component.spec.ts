import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuViewComponent } from './submenu-view.component';

describe('SubmenuViewComponent', () => {
  let component: SubmenuViewComponent;
  let fixture: ComponentFixture<SubmenuViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmenuViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmenuViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
