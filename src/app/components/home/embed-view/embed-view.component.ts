import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppList } from 'src/app/model/AppList';
import { AppsService } from 'src/app/services/apps.service';

@Component({
  selector: 'app-embed-view',
  templateUrl: './embed-view.component.html',
  styleUrls: ['./embed-view.component.scss'],
})
export class EmbedViewComponent implements OnInit, AfterViewInit, OnDestroy {
  public subscriber: Subscription;
  public appSbc: Subscription;
  public ext_id: string;
  public objEmbed = AppList;
  public elementProps = [];
  public saveUrl: any[] = [];

  constructor(
    private router: Router,
    private appService: AppsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.ext_id = this.router.url.replace('/app-view/', '');
    this.getData();
  }

  ngAfterViewInit(): void {
    this.subscriber = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event) {
          window.location.href = event['url'];
        }
      });
  }

  getData() {
    this.appSbc = this.appService
      .getDataById(this.ext_id)
      .subscribe((res: any[]) => {
        this.elementProps.push(res);
      });
    this.appService.getData();
  }

  getSafeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      url + '#embedded=true'
    );
  }

  ngOnDestroy() {
    this.appSbc.unsubscribe();
    this.subscriber.unsubscribe();
  }
}
