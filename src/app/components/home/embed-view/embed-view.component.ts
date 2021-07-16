import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppList } from 'src/app/model/AppList';
import { AppsService } from 'src/app/services/apps.service';

@Component({
  selector: 'app-embed-view',
  templateUrl: './embed-view.component.html',
  styleUrls: ['./embed-view.component.scss'],
})
export class EmbedViewComponent implements OnInit, OnDestroy {
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

  getData() {
    /*this.appSbc = this.appService.apps$.subscribe((apps) => {
      apps.forEach((singleApp) => {
        if (singleApp.id == this.ext_id) {
          this.elementProps.push(singleApp);
        }
      });
    }); */

    this.appService.getDataById(this.ext_id).subscribe(
      (res: any[]) => {
        this.elementProps = res;
        //console.log('la res', res);
        //this.prop = MockProjects;
        if (this.elementProps) {
        }
      },
      (error: any) => {
        console.log('ha ocurrido un error ');
        console.log('error ', error);
      },
      () => {}
    );
    //this.appService.getDataById(this.ext_id);
  }

  getSafeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      url + '#embedded=true'
    );
  }

  ngOnDestroy() {
    this.appSbc.unsubscribe();
  }
}
