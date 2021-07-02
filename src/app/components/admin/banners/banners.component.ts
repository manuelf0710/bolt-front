import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { ModalConfirmationComponent } from '../../utils/pop up/modal-confirmation/modal-confirmation.component';
import { UiService } from 'src/app/services/ui.service';
import { Banner } from 'src/app/model/banner.model';

import { Banners } from 'src/app/mocks/banner-mock';
import { Subscription } from 'rxjs';
import { BannersService } from 'src/app/services/banners.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit, OnDestroy {
  private bannerSubs: Subscription;
  public lang: string;
  public bannerForm: FormGroup;
  public banner_list: Banner[] = [];
  public open_form: boolean = false;
  public edit_form: boolean = false;
  public redirec_option: boolean = false;
  public sizeError: boolean = false;
  public sizeErrorPdf: boolean = false;
  public urlImagBanner: string = '';
  public urlPdfBanner: string = '';
  public pdfFile: any = null;
  public imgFile: any = null;
  public BannerName: string = '';
  public BannerStatus: number = 0;
  public urlAction: boolean = true;
  public message_action_es: string = 'deshabilitar';
  public message_action_en: string = 'disable';
  public assetUrl: string;
  public bannerId: string;

  private errorMessage: any = {
    es: {
      banner_name_es: 'Ingrese un nombre en español',
      banner_name_en: 'Ingrese un nombre en inglés',
      button_text_es: 'Ingrese un texto para el botón en español',
      button_text_en: 'Ingrese un texto para el botón en inglés',
      message_es: 'Ingrese una descripción en español',
      message_en: 'Ingrese una descripción en inglés',
      url_exter: 'Ingrese una url válida',
    },
    en: {
      banner_name_es: 'Enter a name in spanish',
      banner_name_en: 'Enter a name in english',
      button_text_es: 'Enter a button text in spanish',
      button_text_en: 'Enter a button text in english',
      message_es: 'Enter a description in spanish',
      message_en: 'Enter a description in english',
      url_exter: 'Enter a valid url ',
    },
  };
  constructor(
    private formBuilder: FormBuilder,
    private ui: UiService,
    private dialog: MatDialog,
    private bannerService: BannersService
  ) {
    this.assetUrl = environment.serverUrl.split('/api')[0];
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp';
    this.initforms();
    this.getData();
  }

  getData() {
    this.ui.showLoading();
    this.bannerSubs = this.bannerService.banners$.subscribe((banner) => {
      this.ui.dismissLoading();
      this.banner_list = banner;
    });
    this.bannerService.getData();
  }

  initforms() {
    this.bannerForm = this.formBuilder.group({
      banner_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      banner_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      button_text_es: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]),
      button_text_en: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      url_exter: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(250),
      ]),
      message_es: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
      message_en: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
      ]),
    });
  }

  openBannerForm(action?: any) {
    this.open_form = true;
    setTimeout(() => {
      let cont = document.querySelector('#container');

      cont.scroll({
        top: 800,
        behavior: 'smooth',
      });
      window.scroll({
        top: 100,
      });
    }, 100);

    if (action) {
      this.bannerId = action.id;
      this.edit_form = true;
      this.loadBanner(action);
    }
  }

  loadBanner(target) {
    if (target) {
      this.bannerForm.patchValue({
        banner_name_es: target['name_es'],
        banner_name_en: target['name_en'],
        button_text_es: target['button_es'],
        button_text_en: target['button_en'],
        message_es: target['content_es'],
        message_en: target['content_en'],
      });

      if (target['url_redirect'] != 'null') {
        this.bannerForm.patchValue({
          url_exter: target['url_redirect'],
        });
      }

      this.urlImagBanner = target['image'];
      this.BannerStatus = target['status'];

      if (target['pdf'] == 'null') {
        this.urlAction = true;
      } else {
        this.urlPdfBanner = target['pdf'];
        this.urlAction = false;
      }

      this.BannerName =
        this.lang == 'Esp' ? target['name_es'] : target['name_en'];
    }
  }

  updateBanner(operation?: string) {
    if (this.urlPdfBanner.length == 0 && !this.urlAction) {
      this.sizeErrorPdf = true;
    }
    if (this.urlImagBanner.length == 0) {
      this.sizeError = true;
    }
    if (this.bannerForm.invalid) {
      (<any>Object).values(this.bannerForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    const formData = new FormData();
    formData.append('name_es', this.bannerForm.controls.banner_name_es.value);
    formData.append('name_en', this.bannerForm.controls.banner_name_en.value);
    formData.append('button_es', this.bannerForm.controls.button_text_es.value);
    formData.append('button_en', this.bannerForm.controls.button_text_en.value);
    formData.append('content_es', this.bannerForm.controls.message_es.value);
    formData.append('content_en', this.bannerForm.controls.message_en.value);
    formData.append('url_redirect', this.bannerForm.controls.url_exter.value);
    formData.append('image', this.imgFile);
    formData.append('status', this.BannerStatus.toString());
    formData.append('pdf', this.pdfFile);

    if (operation == 'post') {
      this.bannerService.postData(formData);
    } else {
      if (this.bannerId != null) {
        this.bannerService.updateData(formData, this.bannerId);
      }
    }
  }

  deleteBanner(target) {
    this.bannerService.delete(target);
  }

  updateBannerStatus(banner: Banner, msg_es: string, msg_en: string) {
    this.bannerService.changeStatus(banner, msg_es, msg_en);
  }

  cancel() {
    this.open_form = false;
    this.edit_form = false;
    this.sizeError = false;
    this.sizeErrorPdf = false;
    this.urlAction = true;
    this.BannerName = '';
    this.urlImagBanner = '';
    this.urlPdfBanner = '';
    this.bannerForm.reset('');
    this.bannerForm.markAsUntouched();
    let cont = document.querySelector('#container');
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }

  showConfirmation(target: any, operation: string, event?: any) {
    let banner_name = this.lang == 'Esp' ? target.name_es : target.name_en;
    let message_es = 'eliminar';
    let message_en = 'delete';
    if (operation == 'update' && event.checked) {
      message_es = 'habilitar';
      message_en = 'enable';
    } else if (operation == 'update' && !event.checked) {
      message_es = 'deshabilitar';
      message_en = 'disable';
    }

    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        banner_name: banner_name,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    });

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.ui.showLoading();
        if (operation == 'update') {
          if (operation == 'update' && event.checked) {
            message_es = 'habilitó';
            message_en = 'enabled';
          } else {
            message_es = 'deshabilitó';
            message_en = 'disabled';
          }
          this.updateBannerStatus(target, message_es, message_en);
        } else {
          this.deleteBanner(target);
        }
      } else {
        if (operation == 'update') {
          window.location.reload();
        }
      }
    });
  }

  public getMessageform(controlName: any): string {
    let error = '';
    const control = this.bannerForm.get(controlName);
    if (control.touched && control.errors) {
      if (this.lang == 'Esp') {
        error = this.errorMessage['es'][controlName];
      }
      if (this.lang == 'Eng') {
        error = this.errorMessage['en'][controlName];
      }
    }
    return error;
  }

  loadFile(eventfile) {
    if (eventfile.item(0).type == 'application/pdf') {
      if (eventfile.item(0).size > 500000) {
        this.sizeErrorPdf = true;
        return;
      }
      this.sizeErrorPdf = false;
      this.urlPdfBanner = eventfile.item(0).name;
      this.pdfFile = eventfile.item(0);
    }
    if (
      eventfile.item(0).type == 'image/jpeg' ||
      eventfile.item(0).type == 'image/png'
    ) {
      if (eventfile.item(0).size > 500000) {
        this.sizeError = true;
        return;
      }
      this.sizeError = false;
      this.urlImagBanner = eventfile.item(0).name;
      this.imgFile = eventfile.item(0);
    }
  }

  disableField() {
    this.urlAction = !this.urlAction;
    if (!this.urlAction) {
      this.bannerForm.controls.url_exter.reset();
      this.sizeError = false;
    } else {
      this.pdfFile = null;
      this.sizeErrorPdf = false;
    }
  }

  ngOnDestroy() {
    this.bannerSubs.unsubscribe();
  }
}
