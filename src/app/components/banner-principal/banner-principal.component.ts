import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-banner-principal',
  templateUrl: './banner-principal.component.html',
  styleUrls: ['./banner-principal.component.css']
})
export class BannerPrincipalComponent implements OnInit {

  @Input() objConfiguracion: any;
  // objConfiguracion: any = {};
  constructor(
    private globalService: GlobalService,
  ) {
    // console.log('constructor - BannerPrincipalComponent');
    // console.log('objConfiguracion: ' + JSON.stringify(this.objConfiguracion));
    if (!this.objConfiguracion) this.objConfiguracion = this.globalService.lstConfiguracion[0];
    // console.log('objConfiguracion 2: ' + JSON.stringify(this.objConfiguracion));

    // this.objConfiguracion = this.globalService.lstConfiguracion[0];
    // console.log('objConfiguracion - BannerPrincipalComponent: ' + JSON.stringify(this.objConfiguracion));
  }

  ngOnInit() {
    // console.log('init - BannerPrincipalComponent');
    // this.objConfiguracion = this.globalService.getLstConfiguracion();
    // this.objConfiguracion = this.globalService.lstConfiguracion[0];
    // console.log('objConfiguracion - BannerPrincipalComponent: ' + JSON.stringify(this.objConfiguracion));
  }

  // ngAfterContentInit() {
  //   console.log('ngAfterContentInit!');
  //   setTimeout(() => {
  //     // console.log(this.abc.nativeElement.innerText);
  //     this.objConfiguracion = this.globalService.lstConfiguracion[0];
  //     console.log('objConfiguracion - ngAfterContentInit: ' + this.objConfiguracion);
  //   }, 5000);

  // }

}
