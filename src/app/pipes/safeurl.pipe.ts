import {
  Component,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  PipeTransform,
  Pipe,
  OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string, args?: any): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      value + '#embedded=true'
    );
  }
}
