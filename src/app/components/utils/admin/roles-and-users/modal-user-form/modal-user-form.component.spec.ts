import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProjectFormComponent } from './modal-project-form.component';

describe('ModalProjectFormComponent', () => {
  let component: ModalProjectFormComponent;
  let fixture: ComponentFixture<ModalProjectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalProjectFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
