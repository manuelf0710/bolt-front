import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubmenuFormComponent } from './modal-submenu-form.component';

describe('ModalSubmenuFormComponent', () => {
  let component: ModalSubmenuFormComponent;
  let fixture: ComponentFixture<ModalSubmenuFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSubmenuFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSubmenuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
