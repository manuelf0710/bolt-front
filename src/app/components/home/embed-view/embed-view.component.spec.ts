import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedViewComponent } from './embed-view.component';

describe('EmbedViewComponent', () => {
  let component: EmbedViewComponent;
  let fixture: ComponentFixture<EmbedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
