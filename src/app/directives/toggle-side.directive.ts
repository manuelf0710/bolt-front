import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { SidebarToggleService } from '../services/sidebar-toggle.service';

@Directive({
  selector: '[appToggleSide]',
})
export class ToggleSideDirective implements OnInit {
  public sideMemory: string;

  constructor(
    private _el: ElementRef,
    private sideToggleService: SidebarToggleService
  ) {}

  ngOnInit() {
    this.sideMemory = sessionStorage.getItem('sidebarStatus') || 'open';

    if (this.sideMemory == 'close') {
      this.sideToggleService.sideStatus = false;
      this.sideToggleService.closeSide();
    } else {
      this.sideToggleService.sideStatus = true;
      this.sideToggleService.openSide();
    }
  }

  @HostListener('click', ['$event']) onclick(event) {
    if (this._el.nativeElement.id == 'collapseSide') {
      if (this.sideToggleService.sideStatus) {
        this.sideToggleService.openSide();
      } else {
        this.sideToggleService.closeSide();
      }
    } else {
      if (this.sideToggleService.sideStatus) {
        this.sideToggleService.openSide();
      }
    }
  }
}
