import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAppAssoccComponent } from './modal-app-assocc.component';

describe('ModalAppAssoccComponent', () => {
  let component: ModalAppAssoccComponent;
  let fixture: ComponentFixture<ModalAppAssoccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAppAssoccComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAppAssoccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
