import { Component, OnInit, ViewChild, ɵConsole, Output, AfterViewInit, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { InicioService } from 'src/app/services/inicio-terminos.service';
// import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
// import { PideService } from 'src/app/services/pide.service';
import { DataGlobalService } from 'src/app/services/data-global.service';
import { GlobalService } from 'src/app/global.service';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
// import { Observable } from 'rxjs';
// import { filter, map } from 'rxjs/operators';
import { DataSelService } from 'src/app/services/data-sel.service';
// import { ToastrService } from 'ngx-toastr';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
// import { ToastService } from 'src/app/services/toast.service';
import { InicioAceptoTerminoService } from 'src/app/services/inicio-acepto-terminos.service';
// import { Location } from '@angular/common';
import { AvisosService } from 'src/app/services/avisos.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
// import { async } from '@angular/core/testing';
// import { Observable, Subject } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _spinner: NgxSpinnerService,
    // private spinnerService: SpinnerService,
    private dataGlobalService: DataGlobalService,
    private configuracionService: ConfiguracionService,
    private inicioService: InicioService,
    private avisosService: AvisosService,
    // private modalService: BsModalService,
    private globalService: GlobalService,
    private dataSelService: DataSelService,
    private formBuilder: FormBuilder,
    // private toast: ToastService,
    private inicioAceptoTerminoService: InicioAceptoTerminoService,
    // private location: Location,

  ) {
    // this.spinner = this.spinnerService.visibility.value;
  }

  @ViewChild('modalTerminos') modalTerminos: ModalDirective;
  isModalTerminosShown = false;
  @ViewChild('modalAvisos') modalAvisos: ModalDirective;
  isModalAvisosShown = false;

  strLogo: String;
  spinner: boolean;
  spinnerMsg: string = '';
  objTerminos: any = {};
  objAvisos: any = {};
  blValidTerminos: boolean = true;

  // Formulario principal
  terminosForm = this.formBuilder.group({
  blTerminos: ['', [Validators.required]],
    // recaptcha: ['', [Validators.required]],
  });

  lstProcesos: any[] = [];
  objConfiguracion: any = {};

  vcManual: string;


  ngOnInit() {

    this.obtenerParametrosURL();
    this.cargarConfiguracion();

  }

  cargarConfiguracion() {
    console.log('cargarConfiguracion');
    this.spinner = true;
    this._spinner.show();
    let params = {
      vcCodConfiguracion: '',
    }

    this.configuracionService.getWithPost$(params).subscribe(
      resp => {
        // console.log('data: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
          this.globalService.lstConfiguracion = resp.lstConfiguracion;
          let filter = this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_P_001));
          this.vcManual = this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes('COD_MANUAL'))[0].vcValor1;
          console.log(this.vcManual);
          // console.log('this.globalService.lstConfiguracion: ' + JSON.stringify(filter[0]));
          this.objConfiguracion = filter[0];
          // this.objConfiguracion = this.globalService.lstConfiguracion[0];
        } else {
          console.log('Error toast');
        }
        this.spinner = false;
        this._spinner.hide();

        this.cargarDatosSel();
      },
      error => {
        this.spinner = false;
        this._spinner.hide();
        console.log('Error toast');
      }
    );
  }

  obtenerParametrosURL() {
    if (!this.globalService.codUsuarioSel)
      this.route.queryParams.subscribe(
        params => {
          // this.globalService.codUsuarioSel = params['username'];
          this.globalService.codUsuarioSel = '46678997'
          // TODO: comentar para producción
           sessionStorage.setItem('access_token', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhcHBEU0RSZW5vdmFjaW9uIiwic2NvcGUiOlsic2VsIl0sIm9yZ2FuaXphdGlvbiI6IkluZGVjb3BpIiwiZXhwIjoxNjE5NjEyNjg5LCJhdXRob3JpdGllcyI6WyJTRUxfUkVOT1ZBQ0lPTiJdLCJqdGkiOiI4YzRkYjQ1My0wZTlkLTRlOGEtOGUzOC01NTBmM2QzMjcxZjYiLCJjbGllbnRfaWQiOiJzZWwiLCJ1c2VybmFtZSI6ImFwcERTRFJlbm92YWNpb24ifQ.Elxg3nBSDRBnNCix46JXL_3YiYRCPE0WpK0dqAdxU3t2Iw3__CK8GB3uWDSQ-26uvlk39cXbrjpOBenPL6zDPrNMuuS0ReqTZg_ekkZPQ4durLr3rfKbKIpo4Vl9aoTJgeP7mD3oRL0EraEkCAyjeTF__wmG1xPwop-ePZt_Qtqs9VgKBwS96KpjEByLDGDm6Iq9Us7ze4FlvDQ0bCWcczxegyufEK_wQK7MYsVjkzQMR98DV7YTPEPwT6unK_lLX_OSR-__CFIm8QrvmWwsAsp0oUog16oPcZtGIpW-Vvb63HRpHLI-huBdGP6sDg7TOhIsEfWhs9LZxEW41s7kfg');
          //sessionStorage.setItem('access_token', '' + params['access_token']);
                   this.globalService.codAccessToken = params['access_token'];

        }
      );
  }

  cargarListasGlobales() {
    this._spinner.show();
    let params = {};
    return this.dataGlobalService.getWithPost$(params).subscribe(
      resp => {
        this.globalService.listaGeneral = resp;
        this.lstProcesos = resp.lstProcesos;
        this._spinner.hide();
      },
      error => {
        this._spinner.hide();
        console.log('Error toast');
      }
    );
  }

  cargarDatosSel() {
    console.log('cargarDatosSel');
    this._spinner.show();
    // this.spinner = true;
    // this.spinnerService.show();
    let params = {
      vcUsuario: this.globalService.codUsuarioSel
    };
    return this.dataSelService.getWithPost$(params).subscribe(
      resp => {
        console.log('resp cargarDatosSel: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
          this.globalService.agregarDataGenerica(resp.objUsuario.vcUsuario);
          this.globalService.dataUsuarioSel = resp.objUsuario;

        } else {

          console.log('Error toast');
        }
        // this._spinner.hide();

        // console.log("DEspues de cargar los datos del SEL: "+JSON.stringify(this.globalService.dataUsuarioSel));
        // this.obtenerParametrosURL();
        this.consultarConsideraciones();
        this.cargarListasGlobales();

      },
      error => {
        this._spinner.hide();
        // console.log('Error dataSelService');
      }
    );
  }

  rutaNavegacion() {

    this.router.navigate(['/registro']);
  }


  onChangeTerminos($event) {
    this.blValidTerminos = !$event.target.checked;
  }

  consultarConsideraciones() {
    console.log('consultarConsideraciones');
    this._spinner.show();
    let params = {
      nuIdProcedimiento: CONSTANTES.appId.registro_marcas,
      nuIdUsuarioSel: this.globalService.dataUsuarioSel.nuIdUsuarioSel
    }
    console.log("idusuarioSEL: "+this.globalService.dataUsuarioSel.nuIdUsuarioSel)
    // this.tokenService.getWithPost$(params).subscribe(
    //VERIFICAR TERMINOS
    this.inicioService.getWithPost$(params).subscribe(
      resp => {
        //  console.log('verificar terminos resp: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
          if (resp.nuFlagVerificar === 0) {
            this.objTerminos = resp;
            this.globalService.objTerminos = resp;
            // let objClass = { class: 'modal-lg' };
            // let template: TemplateRef<any> = 'modalTerminos';
            // this.openModal(this.modalTerminos, objClass);
            this.showModalTerminos();
          } else if (resp.nuFlagVerificar === 1) {
            this.consultarAvisos();
          }
        } else {
          // this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
          console.log('Error toast');
        }
        this._spinner.hide();
      },
      error => {
        this._spinner.hide();
        // this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        console.log('Error toast');
        // this.spinner = false;
        // this.spinnerMsg = '';
        // this.showToast('Error', 'Hubo un error al intentar acceder a nuestros servicios: ' + error.message, 'error');
      }
    );
  }

  consultarAvisos() {
    console.log('consultarAvisos');
    this._spinner.show();
    let params = {
      nuIdProcedimiento: CONSTANTES.appId.registro_marcas,
    }

    this.avisosService.getWithPost$(params).subscribe(
      resp => {
        console.log('verificar terminos resp: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
          if (resp.nuFlagAviso === 1) {
            this.objAvisos = resp;
            this.showModalAvisos();

          }
        } else {
          // this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
          console.log('Error toast');

        }
        this._spinner.hide();
      },
      error => {
        this._spinner.hide();
        console.log('Error toast');
        // this.spinner = false;
        // this.spinnerMsg = '';
        // this.showToast('Error', 'Hubo un error al intentar acceder a nuestros servicios: ' + error.message, 'error');
      }
    );
  }


  showModalTerminos(): void {
    this.isModalTerminosShown = true;
  }

  hideModalTerminos(): void {
    this.modalTerminos.hide();
  }

  onHiddenTerminos(): void {
    this.isModalTerminosShown = false;
    this.consultarAvisos();
  }

  showModalAvisos(): void {
    this.isModalAvisosShown = true;
  }

  hideModalAvisos(): void {
    this.modalAvisos.hide();
  }

  onHiddenAvisos(): void {
    this.isModalAvisosShown = false;
  }

  aceptarTerminos(): void {
    // console.log('aceptarTerminos');
    this.spinner = true;

    if (this.blValidTerminos) return;

    let params = {
      nuIdProcedimiento: CONSTANTES.appId.registro_marcas,
      nuIdUsuarioSel: this.globalService.dataUsuarioSel.nuIdUsuarioSel
    }
    this.inicioAceptoTerminoService.getWithPost$(params).subscribe(
      resp => {
              if (resp.nuError === 0) {
                console.log('resp: ' + JSON.stringify(resp));
                this.spinner = false;
                this.hideModalTerminos();
              } else {
                // this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
                console.log('Error toast');
              }
            },
      error => {
        this.spinner = false;
        // this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        console.log('Error toast');
               }
    );
  }

  // aceptarAvisos(): void {
  //   this.hideModalAvisos();
  // }

  goServicios(): void {
    window.location.href = `https://${window.location.hostname}//sel-renovacion#/tupa/2/9?username=${this.globalService.codUsuarioSel}&access_token=${this.globalService.codAccessToken}`;
  }

  myFnc($event) {
    console.log('$event: ' + $event);
  }

}
