import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {
  public step: number = 1;
  public admin: boolean = true;
  public lang: string;
  private languajeSetTutorial = new Subject<string>();
  constructor(private ui: UiService) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp';
  }

  closeTutorial() {
    this.ui.dismissModal(TutorialComponent);
  }
  next() {
    ++this.step;
    if (!this.admin && this.step == 5) {
      this.step = 6;
    }
  }
  save() {
    localStorage.setItem('tutorial', 'done');
    this.closeTutorial();
  }
  languageTutorial(languaje: string) {
    this.lang = languaje;
    localStorage.setItem('lang', languaje);
    this.languajeSetTutorial.next(languaje);
    this.next();
  }
}
