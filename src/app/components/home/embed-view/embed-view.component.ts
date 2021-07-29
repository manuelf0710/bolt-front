import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppList } from 'src/app/model/AppList';
import { AppsService } from 'src/app/services/apps.service';
import { HttpService } from 'src/app/services/http.service';

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
  public cur_url: SafeUrl = '';
  constructor(
    private router: Router,
    private appService: AppsService,
    private sanitizer: DomSanitizer,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.getData();
    let dt = new FormData();
    dt.append('username', 'modeloj\\delgadv');

    this.httpService
      .post('http://tableaudev.gmodelo.com.mx/trusted', dt)
      .subscribe((response: any) => {
        console.log(response);
      });
  }

  ngAfterViewInit(): void {
    this.subscriber = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event) {
          this.getData();
        }
      });
  }

  getData() {
    this.ext_id = this.router.url.replace('/app-view/', '');
    this.appSbc = this.appService
      .getDataById(this.ext_id)
      .subscribe((res: any[]) => {
        this.elementProps.push(res);
        this.elementProps.forEach((dash) => {
          this.getSafeUrl(dash['url']);
        });
      });
    this.appService.getData();
  }

  getSafeUrl(url: any) {
    this.cur_url = this.sanitizer.bypassSecurityTrustResourceUrl(
      url + '#embedded=true'
    );
  }

  ngOnDestroy() {
    this.appSbc.unsubscribe();
    this.subscriber.unsubscribe();
  }
}
