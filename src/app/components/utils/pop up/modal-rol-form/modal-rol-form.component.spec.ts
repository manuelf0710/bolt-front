import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRolFormComponent } from './modal-rol-form.component';

describe('ModalRolFormComponent', () => {
  let component: ModalRolFormComponent;
  let fixture: ComponentFixture<ModalRolFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRolFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
