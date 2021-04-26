import { Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GlobalService } from 'src/app/global.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { DataGlobalService } from 'src/app/services/data-global.service';
import { DataSelService } from 'src/app/services/data-sel.service';
import { PideService } from 'src/app/services/pide.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {

  @Output() propagar = new EventEmitter<any>();
  @Output() validEvent = new EventEmitter<any>();
  @ViewChild('templateAgregarPersona') _templateAgregarPersona: TemplateRef<any>;
  @ViewChild('input_archivo_representante') _input_archivo_representante: ElementRef;

  // @ViewChild('templateAgregarPersona2') _templateAgregarPersona2: TemplateRef<any>;

  blcargarDatos: boolean = true;
  modalRef: BsModalRef;
  isInvalid: boolean = true;
  isInvalidModal: boolean = true;
  objConfiguracion: any = {};

  nuIdTipoDocumento: number;

  // blShowLabelPide: boolean = false;
  // blShowInputPide: boolean = true;
  // blShowPersonaPide: boolean = true;

  nuModo: number = 1; // 1: inserttar, 2:actualizar
  isSolicitante: boolean = true;
  isInit: boolean = true; // Identificador de carga inicial
  isNoBindCombos: boolean = true; // Identificador de carga inicial
  blErrorPide: boolean = false;
  lstAdjuntos: any[] = [];

  /*variables visuales*/
  blShowRow0: boolean = false;
  blShowRow1: boolean = false;
  blShowRow2: boolean = false;
  blShowRow3: boolean = false;
  blShowRow4: boolean = false;
  blShowRow5: boolean = false;
  blShowRow6: boolean = false;
  blShowRow7: boolean = false;
  blShowRow8: boolean = false;
  blShowRow9: boolean = false;

  blShowDataTipoPersoneria: boolean = false;
  blShowLabelTipoPersoneria: boolean = false;
  blShowComboTipoPersoneria: boolean = false;

  blShowDataTipoDoc: boolean = false;
  blShowLabelTipoDoc: boolean = false;
  blShowComboTipoDoc: boolean = false;

  blShowDataNroDoc: boolean = false;
  blShowLabelNroDoc: boolean = false;
  blShowInputNroDoc: boolean = false;

  blShowDataNombres: boolean = false;
  blShowLabelNombres: boolean = false;
  blShowInputNombres: boolean = false;

  blShowDataRSocial: boolean = false;
  blShowLabelRSocial: boolean = false;
  blShowInputRSocial: boolean = false;

  blShowDataApPat: boolean = false;
  blShowLabelApPat: boolean = false;
  blShowInputApPat: boolean = false;

  blShowDataApMat: boolean = false;
  blShowLabelApMat: boolean = false;
  blShowInputApMat: boolean = false;

  blShowDataPaisOrigen1: boolean = false;
  blShowLabelPaisOrigen1: boolean = false;
  blShowComboPaisOrigen1: boolean = false;

  blShowDataPaisOrigen2: boolean = false;
  blShowLabelPaisOrigen2: boolean = false;
  blShowComboPaisOrigen2: boolean = false;

  blShowDataPaisResidencia: boolean = false;
  blShowLabelPaisResidencia: boolean = false;
  blShowComboPaisResidencia: boolean = false;

  blShowDataPais: boolean = false;
  blShowTitlePais: boolean = false;
  blShowLabelPais: boolean = false;
  blShowComboPais: boolean = false;

  blShowDataDepto: boolean = false;
  blShowTitleDepto: boolean = false;
  blShowLabelDepto: boolean = false;
  blShowComboDepto: boolean = false;

  blShowDataProv: boolean = false;
  blShowLabelProv: boolean = false;
  blShowComboProv: boolean = false;

  blShowDataDist: boolean = false;
  blShowLabelDist: boolean = false;
  blShowComboDist: boolean = false;

  blShowDataDireccion: boolean = false;
  blShowLabelDireccion: boolean = false;
  blShowInputDireccion: boolean = false;

  blShowDataSexo: boolean = false;
  // blShowLabelSexo: boolean = false;
  blShowComboSexo: boolean = false;

  blShowDataTelefono: boolean = false;
  // blShowLabelTelefono: boolean = false;
  blShowInputTelefono: boolean = false;

  blShowDataRepresentante: boolean = false;

  blShowBtnBuscarPide: boolean = true;

  // blShowPersonaDNI: boolean = false;
  // blShowPersonaRUC: boolean = false;
  /*variables visuales*/

  objPide: any = {};
  objDataSEL : any;
  lstPersona: any[] = [];
  objPersona: any = {};
  lstGenero: any[];
  lstTipoPersoneria: any[];
  lstTipoDocumento: any[];
  lstArchivoRepresentanteTmp : any[];

  paramsUbigeo: any = {};
  lstPaises: any[] = [];
  lstDepartamentos: any[] = [];
  lstProvincias: any[] = [];
  lstDistritos: any[] = [];

  objConfigArchRepresentante : any;

  agregarPersonaForm = this.formBuilder.group({
    nuTipoPersoneria: ['', [Validators.required]],
    nuTipoDocumento: ['', [Validators.required]],
    vcNroDocumento: ['', [Validators.required]],
    vcNombres: ['', [Validators.required]],
    vcRsocial: ['', [Validators.required]],
    vcPrimerApellido: ['', [Validators.required]],
    vcSegundoApellido: ['', [Validators.required]],
    nuPaisOrigen: ['', [Validators.required]],
    nuPaisResidencia: ['', [Validators.required]],
    nuDepartamento: ['', [Validators.required]],
    nuProvincia: ['', [Validators.required]],
    nuDistrito: ['', [Validators.required]],
    vcDireccion: ['', [Validators.required]],
    nuGenero: ['', [Validators.required]],
    vcTelefono: ['', [Validators.required]],
    nuFlagTituRepre: [0, [Validators.required]],
    vcPartidaRegistral: ['', [Validators.required]],
    vcNroExpediente: ['', [Validators.required]],
  });

  constructor(
    private globalService: GlobalService,
    private _spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private pideService: PideService,
    private ubigeoService: UbigeoService,
    /*OFT<*/
    private route: ActivatedRoute,
    private configuracionService: ConfiguracionService,
    private dataSelService: DataSelService,
    private dataGlobalService: DataGlobalService,
    private toastr: ToastrService,
    /*OFT>*/
  ) { }

  ngOnInit() {
    console.log('DatosPersonalesComponent');
    // /*OFT<*/
    // this.obtenerParametrosURL();
    // this.cargarConfiguracion();
    // /*OFT>*/
  }

  /*OFT<*/
  obtenerParametrosURL() {
    if (!this.globalService.codUsuarioSel)
      this.route.queryParams.subscribe(
        params => {
          this.globalService.codUsuarioSel = params['username'];
          // TODO: comentar para producción
          // sessionStorage.setItem('access_token', 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhcHBEU0RSZW5vdmFjaW9uIiwic2NvcGUiOlsic2VsIl0sIm9yZ2FuaXphdGlvbiI6IkluZGVjb3BpIiwiZXhwIjoxNjAyMTk4NTYxLCJhdXRob3JpdGllcyI6WyJTRUxfUkVOT1ZBQ0lPTiJdLCJqdGkiOiJjMmI1NWFiOC0yNWM1LTRkMGQtOWU4MS1jMmVhZjhmNTFiNWIiLCJjbGllbnRfaWQiOiJzZWwiLCJ1c2VybmFtZSI6ImFwcERTRFJlbm92YWNpb24ifQ.clweJycybj_5-vVP7-aZwEzdwl5QEdxgFZdUyH22UAbqr6mOLWveonGIBWlMXj_hSifSNQ3R3o5ptHqV-_Zo5vhTm8e89SGqBw_vTmMvrwfnCXqKuW2w3QNhigPBz57n0sHx61LaqN-weO7_2CqEj2l6ZJH3h8YLpgDv1OAI6_KSEOPSO1VstLiO_AIfHmRWCpA8tEGWKXgtFPh61qE9CGOGw6dk8_87e9t9X3Farot4aJVoN-zC8Vj4MhiPsv-tBM2XOlQQAp4Infgwe3t5dSbkgh76s0LmOdYaz6iOlYRO_4QgAHYCwTIy09uJSpLtbb5-dpHPcWs4pEPVFHSMDw');
          sessionStorage.setItem('access_token', '' + params['access_token']);
          // this.globalService.codAccessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhcHBEU0RSZW5vdmFjaW9uIiwic2NvcGUiOlsic2VsIl0sIm9yZ2FuaXphdGlvbiI6IkluZGVjb3BpIiwiZXhwIjoxNTk3OTcxNDI0LCJhdXRob3JpdGllcyI6WyJTRUxfUkVOT1ZBQ0lPTiJdLCJqdGkiOiJjNTRmZWM3MS1hYzZiLTQyZGEtYWFjZi0yNzZhNDM0NjNiZmEiLCJjbGllbnRfaWQiOiJzZWwiLCJ1c2VybmFtZSI6ImFwcERTRFJlbm92YWNpb24ifQ.QsgodRcWebEQtvhJYNDsp7oYea6jCyrFrgw5FwJlZVwdf0bzjQtymXWZG6Zqufvc3HPCXgYFPyZrH0RLG5-h_x8usntrk9uXQbYvHUkq6eJ2gVvlFeByE91I4PK8VmXTNLMdi7-ZWvNBENRLhXrB-BSKtZwIk7cOAx5UDDM-4nWAYxHJ6Kx7UFsBzllnnrk4Z_W6vYTfOkCf9NiENjs2v-CcDVFeamHiHzn2vXsTXfIFTjWsx6EpieMhhX0NQOvqSf9_jCMzzuLd2cUfa3RRxvKxcVdb8SVcAKt6t6-v-DPMHbRcNkNagadrgWvp61SX7PrtntgJovfana6iC9rKVw';
          this.globalService.codAccessToken = params['access_token'];
          // console.log('codUsuarioSel: ' + params['username']);
          // console.log('access_token: ' + params['access_token']);
        }
      );
  }

  cargarConfiguracion() {
    console.log('cargarConfiguracion');

    let paramsConfiguracion = { vcCodConfiguracion: '' };
    let paramsSel = { vcUsuario: this.globalService.codUsuarioSel };
    let paramsGlobal = {};

    combineLatest([
      this.configuracionService.getWithPost$(paramsConfiguracion),
      this.dataSelService.getWithPost$(paramsSel),
      this.dataGlobalService.getWithPost$(paramsGlobal)
    ])
      .subscribe(
        ([resp1, resp2, resp3]: any) => {

          // Response 1: Datos de Configuración
          this.globalService.lstConfiguracion = resp1.lstConfiguracion;
          this.objConfiguracion = this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_P_001));

          // Response 2: Datos del SEL
          console.log('data SEL: ' + JSON.stringify(resp2));
          this.globalService.agregarDataGenerica(resp2.objUsuario.vcUsuario);
          this.globalService.dataUsuarioSel = resp2.objUsuario;
          this.objDataSEL=resp2;

          console.log("tito: "+JSON.stringify(resp3));
          // Response 3: Datos Globales
          this.globalService.listaGeneral = resp3;
          this.lstPaises=this.globalService.listaGeneral.lstPaises;

          this.cargarDatos();
        }
      );
  }

  /*OFT>*/

  cargarDatos() {
    if (this.blcargarDatos) {
      console.log('cargar datos');
      // console.log('lista general sexo: ' + JSON.stringify(this.globalService.listaGeneral.lstGenero));
      this.lstGenero = this.globalService.listaGeneral.lstGenero;
      // if (this.) { }
      // this.lstTipoDocumento = this.globalService.listaGeneral.lstTipodocumento;
      // this.lstTipoDocumento = this.globalService.listaGeneral.lstTipodocumento.filter(e => e.nuIdTipoOrigen === this.objPide.);
      this.lstTipoPersoneria = this.globalService.listaGeneral.lstPersoneria;
      // this.nuIdTipoDocumento = this.globalService.dataUsuarioSel.nuIdTipoOrigen == 2 ? null : this.globalService.dataUsuarioSel.nuIdTipoDocumento;
      this.objConfigArchRepresentante=this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_CONF_ARCHIVO))[0].clValor1.objConfigArchRepresentante;
      console.log("configuracion: archivos: "+JSON.stringify(this.objConfigArchRepresentante))
  
      this.bindEventsForm();
      this.personaInicial();
      this.blcargarDatos = false;
    }
  }

  // Cargar datos de la persona del SEL
  personaInicial() {
    if (this.isInit) {
      if (this.globalService.dataUsuarioSel.nuIdTipoOrigen == 1) { // nacional
        // this.lstTipoDocumento = this.globalService.listaGeneral.lstTipodocumento.filter(e => e.nuIdTipoOrigen === this.globalService.dataUsuarioSel.nuIdTipoOrigen);

        this.obtenerPide();
        // let objClass = {
        //   backdrop: true,
        //   ignoreBackdropClick: true,
        //   class: 'modal-lg'
        // };
        // this.openModal(this._templateAgregarPersona, objClass);
      } else if (this.globalService.dataUsuarioSel.nuIdTipoOrigen == 2) { // extranjero
        this.blShowBtnBuscarPide = false;
        this.showControles2();
        // this.setDataPersona2();
        this.lstTipoDocumento = this.globalService.listaGeneral.lstTipodocumento.filter((e: any) => e.nuIdTipoOrigen == this.globalService.dataUsuarioSel.nuIdTipoOrigen);
        // this.showDataPersonaExtranjeraDefault();
        // this.agregarPersonaForm.patchValue({ nuTipoDocumento: this.globalService.dataUsuarioSel.nuIdTipoDocumento });
        // this.setDataPersonaDefault();
        let objClass = {
          backdrop: true,
          ignoreBackdropClick: true,
          class: 'modal-lg'
        };
        this.openModal(this._templateAgregarPersona, objClass);
      }
    }
  }

  validarFormulario() {
    console.log();
    // if (this.lstPersona.length > 0) this.isInvalid = false;
    // else this.isInvalid = true;

    if(this.validarExisteTitular()){
      this.isInvalid=false;
    }

    this.validEvent.emit(this.isInvalid);
  }

 validarModal(){
  if(this.agregarPersonaForm.controls.nuFlagTituRepre.value!=0)
   this.isInvalidModal=false;
 }

  validarExisteTitular(){
    let blFlag=false;
    for (let item of this.lstPersona) {
      if(item.nuFlagTituRepre==1){
        blFlag=true;
      }
    }
    return blFlag;
  }

  bindEventsForm() {

    this.agregarPersonaForm.get('nuTipoPersoneria').valueChanges.subscribe(value => {
      console.log('value nuTipoPersoneria: ', value);

      this.resetShowDataForm();
      if (!this.isInit) {
        if (value == 1) { // Natural
          this.lstTipoDocumento = this.globalService.listaGeneral.lstTipodocumento.filter((e: any) => e.nuIdTipoDocumento != 2);

        } else if (value == 2) {//juridica
          this.lstTipoDocumento = this.globalService.listaGeneral.lstTipodocumento.filter((e: any) => e.nuIdTipoDocumento != 1);
        }

      }

      this.limpiarAgregarManual();

      // this.showControles2();
    });

    this.agregarPersonaForm.get('nuTipoDocumento').valueChanges.subscribe(value => {
      console.log('valueChanges nuTipoDocumento: ', value);

      this.blShowBtnBuscarPide = value >= 3 ? false : true;

    this.blShowDataNroDoc = true;
    this.blShowLabelNroDoc = true;
    this.blShowInputNroDoc = true;
    this.obtenerDepartamento();
    this.limpiarAgregarManual();

      // this.agregarPersonaForm.reset();
      console.log(""+value);
      if (value >= 3) {
         this.showDataExtranjeros();
      }
      else if (value == 1 || value == 2) {
        this.resetShowDataForm2();
      }


    });

    this.agregarPersonaForm.get('nuFlagTituRepre').valueChanges.subscribe(value => {
      console.log('value: ' + value);
      // Titular de la marca
      if (value == 1) {
        this.blShowDataRepresentante = false;
      }

      // Representante de la marca
      if (value == 2) {
        this.blShowDataRepresentante = true;
      }

      this.validarModal()
    });


  }

  cambiarDepartamento(value :any){
    // console.log(JSON.stringify(event));
    this.obtenerProvincia(value);
      this.lstDistritos =[]
  }

  cambiarProvincia(value :any){
    // console.log(JSON.stringify(event));
    this.obtenerDistrito(value);
      // this.lstDistritos =[]
  }

  resetShowDataForm2() {
    console.log('ocultarTodos');
    // this.agregarPersonaForm.controls.nuTipoDocumento.setValue('');
    this.blShowRow0 = true;
    this.blShowRow1 = true;
    this.blShowRow2 = true;
    this.blShowRow3 = false;
    this.blShowRow4 = false;
    this.blShowRow5 = false;
    this.blShowRow6 = false;
    this.blShowRow7 = false;
    this.blShowRow8 = false;

    this.blShowDataTipoPersoneria = true;
    this.blShowComboTipoPersoneria = true;

    this.blShowDataTipoDoc = true;
    this.blShowLabelTipoDoc = false;
    this.blShowComboTipoDoc = true;

    this.blShowDataNroDoc = true;
    this.blShowLabelNroDoc = true;
    this.blShowInputNroDoc = true;

    this.blShowDataNombres = false;
    this.blShowLabelNombres = false;
    this.blShowInputNombres = false;

    this.blShowDataRSocial = false;
    this.blShowLabelRSocial = false;
    this.blShowInputRSocial = false;

    this.blShowDataApPat = false;
    this.blShowLabelApPat = false;
    this.blShowInputApPat = false;

    this.blShowDataApMat = false;
    this.blShowLabelApMat = false;
    this.blShowInputApMat = false;

    this.blShowDataPaisOrigen1 = false;
    this.blShowLabelPaisOrigen1 = false;
    this.blShowComboPaisOrigen1 = false;

    this.blShowDataPaisOrigen2 = false;
    this.blShowLabelPaisOrigen2 = false;
    this.blShowComboPaisOrigen2 = false;

    this.blShowDataDepto = false;
    this.blShowTitleDepto = false;
    this.blShowLabelDepto = false;
    this.blShowComboDepto = false;

    this.blShowDataProv = false;
    this.blShowLabelProv = false;
    this.blShowComboProv = false;

    this.blShowDataDist = false;
    this.blShowLabelDist = false;
    this.blShowComboDist = false;

    this.blShowDataDireccion = false;
    this.blShowLabelDireccion = false;
    this.blShowInputDireccion = false;

    this.blShowDataSexo = false;
    this.blShowComboSexo = false;

    this.blShowDataTelefono = false;
    this.blShowInputTelefono = false;


  }
  resetShowDataForm() {
    console.log('ocultarTodos');
    this.agregarPersonaForm.controls.nuTipoDocumento.setValue('');
    this.blShowRow0 = true;
    this.blShowRow1 = true;
    this.blShowRow2 = true;
    this.blShowRow3 = false;
    this.blShowRow4 = false;
    this.blShowRow5 = false;
    this.blShowRow6 = false;
    this.blShowRow7 = false;
    this.blShowRow8 = false;

    this.blShowDataTipoPersoneria = true;
    this.blShowComboTipoPersoneria = true;

    this.blShowDataTipoDoc = true;
    this.blShowLabelTipoDoc = false;
    this.blShowComboTipoDoc = true;

    this.blShowDataNroDoc = false;
    this.blShowLabelNroDoc = false;
    this.blShowInputNroDoc = false;

    this.blShowDataNombres = false;
    this.blShowLabelNombres = false;
    this.blShowInputNombres = false;

    this.blShowDataRSocial = false;
    this.blShowLabelRSocial = false;
    this.blShowInputRSocial = false;

    this.blShowDataApPat = false;
    this.blShowLabelApPat = false;
    this.blShowInputApPat = false;

    this.blShowDataApMat = false;
    this.blShowLabelApMat = false;
    this.blShowInputApMat = false;

    this.blShowDataPaisOrigen1 = false;
    this.blShowLabelPaisOrigen1 = false;
    this.blShowComboPaisOrigen1 = false;

    this.blShowDataPaisOrigen2 = false;
    this.blShowLabelPaisOrigen2 = false;
    this.blShowComboPaisOrigen2 = false;

    this.blShowDataDepto = false;
    this.blShowTitleDepto = false;
    this.blShowLabelDepto = false;
    this.blShowComboDepto = false;

    this.blShowDataProv = false;
    this.blShowLabelProv = false;
    this.blShowComboProv = false;

    this.blShowDataDist = false;
    this.blShowLabelDist = false;
    this.blShowComboDist = false;

    this.blShowDataDireccion = false;
    this.blShowLabelDireccion = false;
    this.blShowInputDireccion = false;

    this.blShowDataSexo = false;
    this.blShowComboSexo = false;

    this.blShowDataTelefono = false;
    this.blShowInputTelefono = false;


  }

 limpiarAgregarManual(){
  this.agregarPersonaForm.controls.vcNroDocumento.reset();
 }

  obtenerPide() {
    this._spinner.show();
    this.objPersona = {};
    let params = {
      vcDocIdentidad: this.isInit ? this.globalService.dataUsuarioSel.vcDocIdentidad : this.agregarPersonaForm.value.vcNroDocumento
    }
    this.pideService.getWithPost$(params).subscribe(
      resp => {
        console.log('data pide: ' + JSON.stringify(resp));
        this.objPide = resp;
        // console.log(params.vcDocIdentidad.length);
        if (resp.nuError == 0 || resp.nuError ==200) {
          if(params.vcDocIdentidad.length==8){
          if(resp.lstResultReniec[0]){
            if(resp.lstResultReniec.length>0){
            this.pideactivo(resp);
            }else{
              this.blErrorPide = true;
              console.log('Sin data 2');
              this.setDataPersona2();
            }
          }else{
            this.blErrorPide = true;
            console.log('Sin data 1');
            this.setDataPersona2();
          }
        }else if(params.vcDocIdentidad.length==11){
          if(resp.objDatosRuc){
            if(resp.objDatosRuc.vcRazonSocial.length>0){
            this.pideactivo(resp);
            }else{
              this.blErrorPide = true;
              console.log('Sin data 2');
              this.setDataPersona2();
            }
          }else{
            this.blErrorPide = true;
            console.log('Sin data 1');
            this.setDataPersona2();
          }
        }else{
          console.log("Documento inadecuado.");
        }

        } else if (resp.nuError == -1) {
          this.blErrorPide = true;
          console.log('No data');
           this.setDataPersona2();
          // this.showControles2();

        } else {
          this.blErrorPide = true;
          console.log('Servicio PIDE no disponible');
          this.setDataPersona2();
        }
        // console.log("aqui comienza", this.agregarPersonaForm.get('nuTipoDocumento').value);
        this.showControles2();


        if (this.isInit) {
          let objClass = {
            backdrop: true,
            ignoreBackdropClick: true,
            class: 'modal-lg'
          };

          this.openModal(this._templateAgregarPersona, objClass);
        }

        this._spinner.hide();
      },
      error => {
        this.blErrorPide = true;
        this.setDataPersona2();
        console.log('ERROR GENERAL PIDE...');
        this.showControles2();


        if (this.isInit) {
          let objClass = {
            backdrop: true,
            ignoreBackdropClick: true,
            class: 'modal-lg'
          };

          this.openModal(this._templateAgregarPersona, objClass);
        }

        this._spinner.hide();
      }
    );
  }

  pideactivo(resp : any){
    this.blErrorPide = false;
    let objPersona: any = {};
    objPersona.nuIdTipoOrigen = this.globalService.dataUsuarioSel.nuIdTipoOrigen;
    let nuIdTipoDocumento = this.isInit ? +this.globalService.dataUsuarioSel.nuIdTipoDocumento : +this.agregarPersonaForm.value.nuTipoDocumento;
    // console.log("Tipo de documento: "+nuIdTipoDocumento);
    if (nuIdTipoDocumento == 1) { // DNI

      let data = resp.lstResultReniec[0];
      objPersona.nuIdTipoPersona = 1; // Natural
      objPersona.vcNombres = data.vcReniecNombres;
      objPersona.vcApPaterno = data.vcReniecApPaterno;
      objPersona.vcApMaterno = data.vcReniecApMaterno;
      objPersona.nuIdPais = 168;
      objPersona.vcRutaUbigeo = data.vcReniecUbigeo;
      objPersona.vcDireccion = data.vcReniecDireccion;


    } else if (nuIdTipoDocumento == 2) { // RUC
      objPersona.nuIdTipoPersona = 2; // Juridica
      objPersona.nuIdPais = 168;

      let data = resp.objDatosRuc;
      objPersona.vcRazonSocial = data.vcRazonSocial;
      objPersona.vcRutaUbigeo = data.vcUbigeo;
      objPersona.vcDireccion = data.vcDireccion;

      this.blShowLabelDireccion = true;
      this.blShowInputDireccion = false;
    }

    objPersona.nuIdTipoDocumento = nuIdTipoDocumento;
    objPersona.vcIdTipoDocumento = this.globalService.dataUsuarioSel.vcIdTipoDocumento;
    objPersona.vcDocIdentidad = this.globalService.dataUsuarioSel.vcDocIdentidad;
    objPersona.vcCorreo = this.globalService.dataUsuarioSel.vcCorreo;

    let dataInd = resp.objUbigeoInd;
    objPersona.nuDepartamento = dataInd.nuDepartamento;
    objPersona.nuProvincia = dataInd.nuProvincia;
    objPersona.nuDistrito = dataInd.nuDistrito;
    objPersona.vcDepartamento = dataInd.vcDepartamento;
    objPersona.vcProvincia = dataInd.vcProvincia;
    objPersona.vcDistrito = dataInd.vcDistrito;


    /**/
    console.log('Pide ok');
    this.blShowLabelDepto = objPersona.nuDepartamento > 0;
    this.blShowComboDepto = objPersona.nuDepartamento == 0;
    this.blShowLabelProv = objPersona.nuProvincia > 0;
    this.blShowComboProv = objPersona.nuProvincia == 0;
    this.blShowLabelDist = objPersona.nuDistrito > 0;
    this.blShowComboDist = objPersona.nuDistrito == 0;
    this.objPersona = objPersona;
    // console.log('this.objPersona: ' + JSON.stringify(this.objPersona));
     this.setDataPersona2();
  }

  // mostrar modal para agregar nuevas personas de forma manual
  showModalPersonaManual() {
    this.isInvalidModal=true;
    this.objPersona = {};
    this.blErrorPide = false;
    this.lstDepartamentos = [];
    this.lstProvincias = [];
    this.lstDistritos = [];
    this.agregarPersonaForm.reset();

    this.resetShowDataForm();

    this.blShowRow0 = true;
    this.blShowRow1 = true;
    this.blShowRow2 = true;

    this.blShowDataTipoPersoneria = true;
    this.blShowComboTipoPersoneria = true;

    this.blShowDataTipoDoc = true;
    this.blShowComboTipoDoc = true;

    this.blShowDataNroDoc = false;
    this.blShowInputNroDoc = false;
    this.agregarPersonaForm.controls.nuTipoPersoneria.setValue('');

    let objClass = { class: 'modal-lg' };
    this.openModal(this._templateAgregarPersona, objClass);


  }

  // Mostrar los controles en caso exista PIDE o No
  showControles2() {
  console.log("showControles2")

    // this.nuIdTipoDocumento = this.isInit ? this.globalService.dataUsuarioSel.nuIdTipoDocumento : this.agregarPersonaForm.get('nuTipoDocumento').value;
     console.log("this.nuIdTipoDocumento: "+this.nuIdTipoDocumento);
    if (this.nuModo == 1) { // insertar

      if (!this.blErrorPide) { // pide ok o default = false

        if (this.nuIdTipoDocumento== 1 || this.nuIdTipoDocumento== 2) { // NACIONAL
          // console.log("Tito: "+this.globalService.dataUsuarioSel.nuIdTipoOrigen)
          if (this.nuIdTipoDocumento == 1) { //DNI

            this.blShowRow0 = true;
            this.blShowRow1 = true;
            this.blShowRow2 = true;
            this.blShowRow3 = true;
            this.blShowRow4 = true;
            this.blShowRow5 = true;
            this.blShowRow6 = true;
            this.blShowRow7 = true;
            this.blShowRow8 = true;

            if (this.isInit) {
              // this.blShowDataTipoPersoneria = true;
              // this.blShowLabelTipoPersoneria = true;

              this.blShowDataTipoDoc = true;
              this.blShowLabelTipoDoc = true;

              this.blShowDataNroDoc = true;
              this.blShowLabelNroDoc = true;

            } else {
              this.blShowDataTipoDoc = true;
              this.blShowComboTipoDoc = true;

              this.blShowDataNroDoc = true;
              this.blShowInputNroDoc = true;
            }

            // this.blShowBtnBuscarPide = true;
            // console.log("abel");

            this.blShowDataNombres = true;
            this.blShowLabelNombres = true;

            this.blShowDataApPat = true;
            this.blShowLabelApPat = true;

            this.blShowDataApMat = true;
            this.blShowLabelApMat = true;

            this.blShowDataPaisOrigen1 = false;
            this.blShowLabelPaisOrigen1 = false;

            this.blShowDataPaisOrigen2 = true;
            this.blShowLabelPaisOrigen2 = true;

            this.blShowDataPaisResidencia = true;
            this.blShowLabelPaisResidencia = true;

            this.blShowDataDireccion = true;
            this.blShowInputDireccion = true;

            this.blShowDataSexo = true;
            this.blShowComboSexo = true;

            this.blShowDataTelefono = true;
            this.blShowInputTelefono = true;

          } else if (this.nuIdTipoDocumento == 2) { //RUC
            // this.blShowRow0 = true;
            this.blShowRow1 = true;
            this.blShowRow2 = true;
            this.blShowRow3 = false;
            this.blShowRow4 = true;
            this.blShowRow5 = true;
            this.blShowRow6 = true;
            this.blShowRow7 = true;
            this.blShowRow8 = true;

            if (this.isInit) {
              this.blShowDataTipoDoc = true;
              this.blShowLabelTipoDoc = true;

              this.blShowDataNroDoc = true;
              this.blShowLabelNroDoc = true;
            } else {
              this.blShowDataTipoDoc = true;
              this.blShowComboTipoDoc = true;

              this.blShowDataNroDoc = true;
              this.blShowInputNroDoc = true;
            }

            // this.blShowBtnBuscarPide = true;

            this.blShowDataRSocial = true;
            this.blShowLabelRSocial = true;

            this.blShowDataPaisOrigen1 = true;
            this.blShowLabelPaisOrigen1 = true;

            this.blShowDataPaisResidencia = true;
            this.blShowLabelPaisResidencia = true;

            this.blShowDataDireccion = true;
            this.blShowInputDireccion = true;
            // this.blShowLabelDireccion = true;

            this.blShowDataTelefono = true;
            this.blShowInputTelefono = true;
          }


          // Obtener Ubigeo
          this.setDefaultUbigeo(this.objPersona);


        } else if (this.globalService.dataUsuarioSel.nuIdTipoOrigen === 2) { // EXTRANJEROS

          let nuIdTipoPersoneria = this.agregarPersonaForm.get('nuTipoPersoneria').value;

          this.blShowRow0 = true;
          this.blShowRow1 = true;
          this.blShowRow2 = true;
          this.blShowRow3 = true;
          this.blShowRow4 = true;
          this.blShowRow5 = true;
          this.blShowRow6 = true;
          this.blShowRow7 = true;
          console.log("extrangero");

          // this.blShowBtnBuscarPide = false;

          this.blShowDataTipoPersoneria = true;
          this.blShowComboTipoPersoneria = true;

          this.blShowDataTipoDoc = true;
          this.blShowComboTipoDoc = true;

          // this.blShowDataNroDoc = true;
           this.blShowInputNroDoc = true;

          if (nuIdTipoPersoneria == 1) { // NATURAL
            this.blShowDataNombres = true;
            this.blShowInputNombres = true;

            this.blShowDataRSocial = false;
            this.blShowInputRSocial = false;

            this.blShowDataApPat = true;
            this.blShowInputApPat = true;

            this.blShowDataApMat = true;
            this.blShowInputApMat = true;

            this.blShowDataPaisOrigen1 = true;
            this.blShowComboPaisOrigen1 = true;

            this.blShowDataPaisOrigen2 = true;
            this.blShowComboPaisOrigen2 = true;

            this.blShowDataPaisResidencia = true;
            this.blShowLabelPaisResidencia = true;

            this.blShowDataDepto = true;
            this.blShowComboDepto = true;

            this.blShowDataProv = true;
            this.blShowComboProv = true;

            this.blShowDataDist = true;
            this.blShowComboDist = true;

            this.blShowDataDireccion = true;
            this.blShowInputDireccion = true;

            this.blShowDataTelefono = true;
            this.blShowInputTelefono = true;

            this.blShowDataSexo = true;
            this.blShowComboSexo = true;

            this.blShowRow8 = true;
          } else if (nuIdTipoPersoneria == 2) { // JURIDICO
            this.blShowDataNombres = false;
            this.blShowInputNombres = false;

            this.blShowDataRSocial = true;
            this.blShowInputRSocial = true;

            this.blShowDataApPat = false;
            this.blShowInputApPat = false;

            this.blShowDataApMat = false;
            this.blShowInputApMat = false;

            this.blShowDataPaisOrigen1 = true;
            this.blShowComboPaisOrigen1 = true;

            this.blShowDataPaisOrigen2 = false;
            this.blShowComboPaisOrigen2 = false;

            this.blShowDataPaisResidencia = true;
            this.blShowLabelPaisResidencia = true;

            this.blShowDataDepto = true;
            this.blShowComboDepto = true;

            this.blShowDataProv = true;
            this.blShowComboProv = true;

            this.blShowDataDist = true;
            this.blShowComboDist = true;

            this.blShowDataDireccion = true;
            this.blShowInputDireccion = true;

            this.blShowDataTelefono = true;
            this.blShowInputTelefono = true;

            this.blShowDataSexo = false;
            this.blShowComboSexo = false;

            this.blShowRow8 = true;
          }

          // this.obtenerUbigeo();

          // this.blShowDataPaisOrigen = true;
          // this.blShowComboPaisOrigen = true;

          // this.blShowDataPaisResidencia = true;
          // this.blShowLabelPaisResidencia = true;



          /*if (this.lstPaises.length == 0) {
            this.paramsUbigeo = {
              'nuIdTipo': 2,
              'nuIdPadre': 1
            };
            // consulta paises
            this.consultaUbigeo_bk();
          }*/

        }
      } else { // pide error
        console.log("Error aqui: "+this.globalService.dataUsuarioSel.nuIdTipoDocumento);
        this.obtenerDepartamento();
        if (this.nuIdTipoDocumento == 1) { //DNI
        // console.log("DNI")
          this.blShowRow0 = true;
          this.blShowRow1 = true;
          this.blShowRow2 = true;
          this.blShowRow3 = true;
          this.blShowRow4 = true;
          this.blShowRow5 = true;
          this.blShowRow6 = true;
          this.blShowRow7 = true;
          this.blShowRow8 = true;

          if (this.isInit) {
            this.blShowDataTipoDoc = true;
            this.blShowLabelTipoDoc = true;

            this.blShowDataNroDoc = true;
            this.blShowLabelNroDoc = true;
            this.blShowDataPaisOrigen1=false;


          } else {
            this.blShowDataTipoDoc = true;
            this.blShowComboTipoDoc = true;

            this.blShowDataNroDoc = true;
            this.blShowInputNroDoc = true;
          }

          this.blShowDataNombres = true;
          this.blShowInputNombres = true;

          this.blShowDataApPat = true;
          this.blShowInputApPat = true;

          this.blShowDataApMat = true;
          this.blShowInputApMat = true;

          // this.blShowDataPaisOrigen1 = true;
          // this.blShowLabelPaisOrigen1 = true;

          this.blShowDataPaisResidencia = true;
          this.blShowLabelPaisResidencia = true;

          this.blShowDataDireccion = true;
          this.blShowInputDireccion = true;

          this.blShowDataSexo = true;
          this.blShowComboSexo = true;

          this.blShowDataTelefono = true;
          this.blShowInputTelefono = true;

        } else if (this.nuIdTipoDocumento == 2) { //RUC
          this.blShowRow0 = true;
          this.blShowRow1 = true;
          this.blShowRow2 = true;
          this.blShowRow3 = false;
          this.blShowRow4 = true;
          this.blShowRow5 = true;
          this.blShowRow6 = true;
          this.blShowRow7 = true;
          this.blShowRow8 = true;

          if (this.isInit) {
            this.blShowDataTipoDoc = true;
            this.blShowLabelTipoDoc = true;

            this.blShowDataNroDoc = true;
            this.blShowLabelNroDoc = true;
          } else {
            this.blShowDataTipoDoc = true;
            this.blShowComboTipoDoc = true;

            this.blShowDataNroDoc = true;
            this.blShowInputNroDoc = true;
          }

          this.blShowDataRSocial = true;
          this.blShowInputRSocial = true;

          this.blShowDataPaisOrigen1 = true;
          this.blShowLabelPaisOrigen1 = true;

          this.blShowDataPaisResidencia = true;
          this.blShowLabelPaisResidencia = true;

          this.blShowDataDireccion = true;
          this.blShowInputDireccion = true;

          this.blShowDataTelefono = true;
          this.blShowInputTelefono = true;
        }

        if (this.nuIdTipoDocumento == 1 || this.nuIdTipoDocumento == 2) {
          this.blShowDataDepto = true;
          this.blShowComboDepto = true;
          this.paramsUbigeo = {
            'nuIdTipo': 3,
            'nuIdPadre': 168
          };
          // consultar departamentos
          // this.consultaUbigeo_bk();

          this.blShowDataProv = true;
          this.blShowComboProv = true;

          this.blShowDataDist = true;
          this.blShowComboDist = true;
        }
      }

    }
    // else if (this.nuModo == 2) { // actualizar
    //   if (this.blErrorPide) { // error pide
    //     if (this.isInit) {

    //     } else {

    //     }
    //   } else { // pide ok or default

    //   }
    // }


  }

  showDataExtranjeros() {
    console.log("showDataExtranjeros")

          console.log("this.nuIdTipoDocumento: "+this.nuIdTipoDocumento);
      if (this.nuModo == 1) { // insertar

          this.obtenerDepartamento();
          if (this.agregarPersonaForm.controls.nuTipoPersoneria.value == 1) { //DNI
          console.log("natural")
            this.blShowRow0 = true;
            this.blShowRow1 = true;
            this.blShowRow2 = true;
            this.blShowRow3 = true;
            this.blShowRow4 = true;
            this.blShowRow5 = true;
            this.blShowRow6 = true;
            this.blShowRow7 = true;
            this.blShowRow8 = true;

            if (this.isInit) {
              this.blShowDataTipoDoc = true;
              this.blShowLabelTipoDoc = true;

              this.blShowDataNroDoc = true;
              this.blShowLabelNroDoc = true;
              this.blShowDataPaisOrigen1=false;


            } else {
              this.blShowDataTipoDoc = true;
              this.blShowComboTipoDoc = true;

              this.blShowDataNroDoc = true;
              this.blShowInputNroDoc = true;
            }

            this.blShowDataNombres = true;
            this.blShowInputNombres = true;

            this.blShowDataApPat = true;
            this.blShowInputApPat = true;

            this.blShowDataApMat = true;
            this.blShowInputApMat = true;

            this.blShowDataPaisOrigen1 = false;
            this.blShowLabelPaisOrigen1 = false;
            this.blShowComboPaisOrigen1 = false;

            this.blShowDataPaisOrigen2 = true;
            this.blShowLabelPaisOrigen2 = false;
            this.blShowComboPaisOrigen2 = true;

            this.blShowDataPaisResidencia = true;
            this.blShowLabelPaisResidencia = true;

            this.blShowDataDireccion = true;
            this.blShowInputDireccion = true;

            this.blShowDataSexo = true;
            this.blShowComboSexo = true;

            this.blShowDataTelefono = true;
            this.blShowInputTelefono = true;

            this.agregarPersonaForm.controls.nuPaisOrigen.setValue('');
            this.agregarPersonaForm.controls.nuDepartamento.setValue('');
            this.agregarPersonaForm.controls.nuProvincia.setValue('');
            this.agregarPersonaForm.controls.nuDistrito.setValue('');
            this.agregarPersonaForm.controls.nuGenero.setValue('');

          } else if (this.agregarPersonaForm.controls.nuTipoPersoneria.value == 2) { //RUC
            console.log("juridico")
            this.blShowRow0 = true;
            this.blShowRow1 = true;
            this.blShowRow2 = true;
            this.blShowRow3 = false;
            this.blShowRow4 = true;
            this.blShowRow5 = true;
            this.blShowRow6 = true;
            this.blShowRow7 = true;
            this.blShowRow8 = true;

            // if (this.isInit) {
              this.blShowDataTipoDoc = true;
              this.blShowLabelTipoDoc = true;

              this.blShowDataNroDoc = true;
              this.blShowLabelNroDoc = true;
            // } else {
              this.blShowDataTipoDoc = true;
              this.blShowComboTipoDoc = true;

              this.blShowDataNroDoc = true;
              this.blShowInputNroDoc = true;
            // }

            this.blShowDataRSocial = true;
            this.blShowInputRSocial = true;

            this.blShowDataPaisOrigen1 = true;
            this.blShowLabelPaisOrigen1 = false;
            this.blShowComboPaisOrigen1 = true;

            this.blShowDataPaisResidencia = true;
            this.blShowLabelPaisResidencia = true;


            this.blShowDataDireccion = true;
            this.blShowInputDireccion = true;

            this.blShowDataTelefono = true;
            this.blShowInputTelefono = true;
            this.agregarPersonaForm.controls.nuPaisOrigen.setValue('');
            this.agregarPersonaForm.controls.nuDepartamento.setValue('');
            this.agregarPersonaForm.controls.nuProvincia.setValue('');
            this.agregarPersonaForm.controls.nuDistrito.setValue('');
            this.agregarPersonaForm.controls.nuGenero.setValue('');
          }

          // if (this.nuIdTipoDocumento == 1 || this.nuIdTipoDocumento == 2) {
            this.blShowDataDepto = true;
            this.blShowComboDepto = true;

            this.blShowDataProv = true;
            this.blShowComboProv = true;

            this.blShowDataDist = true;
            this.blShowComboDist = true;
          // }


      }

    }

  obtenerDepartamento(){
    let paramsUbigeoDepto: any = { 'nuIdTipo': 3, 'nuIdPadre': 168 };
    this.ubigeoService.getWithPost$(paramsUbigeoDepto).subscribe(
      resp=>{
        this.lstDepartamentos=resp.lstUbigeo;
        // console.log("este fue llamado")
        // console.log("departamento: "+this.objPersona.nuDepartamento)
        this.agregarPersonaForm.controls["nuDepartamento"].setValue('');
        this.agregarPersonaForm.controls["nuProvincia"].setValue('');
        this.agregarPersonaForm.controls["nuDistrito"].setValue('');
      },
      error=>{
        console.log("Error al recuperar los departamentos");
      }
    );
  }
  obtenerProvincia(value: any){
    let paramsUbigeoDepto: any = { 'nuIdTipo': 4, 'nuIdPadre': value };
    this.ubigeoService.getWithPost$(paramsUbigeoDepto).subscribe(
      resp=>{

        this.lstProvincias=resp.lstUbigeo;
        this.agregarPersonaForm.controls["nuProvincia"].setValue('');
        this.agregarPersonaForm.controls["nuDistrito"].setValue('');


           },
      error=>{
        console.log("Error al recuperar los provincia");
      }
    );
  }

  obtenerDistrito(value: any){
    let paramsUbigeoDepto: any = { 'nuIdTipo': 5, 'nuIdPadre': value };
    this.ubigeoService.getWithPost$(paramsUbigeoDepto).subscribe(
      resp=>{
        this.lstDistritos=resp.lstUbigeo;
        this.agregarPersonaForm.controls["nuDistrito"].setValue('');

      },
      error=>{
        console.log("Error al recuperar los distrito");
      }
    );
  }

  obtenerUbigeo(objPersona: any){
    console.log("obtenerUbigeo")
    if(objPersona.nuDepartamento!=0){
    let paramsUbigeoDepto: any = { 'nuIdTipo': 3, 'nuIdPadre': 168 };
    this.ubigeoService.getWithPost$(paramsUbigeoDepto).subscribe(
      resp=>{

        this.lstDepartamentos=resp.lstUbigeo;
        this.agregarPersonaForm.controls["nuDepartamento"].setValue(objPersona.nuDepartamento);
        if(objPersona.nuProvincia!=0){
        let paramsUbigeoProvincia: any = { 'nuIdTipo': 4, 'nuIdPadre': objPersona.nuDepartamento };
        this.ubigeoService.getWithPost$(paramsUbigeoProvincia).subscribe(
          resp=>{
            this.lstProvincias=resp.lstUbigeo;
            this.agregarPersonaForm.controls["nuDepartamento"].setValue(objPersona.nuDepartamento);
            this.agregarPersonaForm.controls["nuProvincia"].setValue(objPersona.nuProvincia);
            if(objPersona.nuDistrito!=0){
              let paramsUbigeoDistrito: any = { 'nuIdTipo': 5, 'nuIdPadre': objPersona.nuProvincia };
              this.ubigeoService.getWithPost$(paramsUbigeoDistrito).subscribe(
                resp=>{
                  this.lstDistritos=resp.lstUbigeo;
                  this.agregarPersonaForm.controls["nuDistrito"].setValue(objPersona.nuDistrito);
                },
                error=>{
                  console.log("Error al recuperar los distrito");
                }
              );
            }else{
              this.obtenerDistrito(objPersona.nuProvincia);
            }
          },
          error=>{
            console.log("Error al recuperar los provincia");
          }
        );
        }else{
          this.obtenerProvincia(objPersona.nuDepartamento);
        }

      },
      error=>{
        console.log("Error al recuperar los distrito");
      }
    );
  }else{
    this.obtenerDepartamento();
  }
  }


  setDefaultUbigeo(objPersona: any) {
    console.log('setDefaultUbigeo');
    if (this.nuIdTipoDocumento == 1 || this.nuIdTipoDocumento == 2) {
      let dataInd = this.objPide.objUbigeoInd;

      console.log('dataInd: ' + JSON.stringify(dataInd));

      // Mostrar controles Ubigeo
      this.blShowDataDepto = true;
      this.blShowComboDepto = true;
      this.blShowDataProv = true;
      this.blShowComboProv = true;
      this.blShowDataDist = true;
      this.blShowComboDist = true;

      this.obtenerUbigeo(objPersona);

    }
  }


    setDataPersona2() {

    console.log('setDataPersona2');
    this.nuIdTipoDocumento = this.isInit ? this.globalService.dataUsuarioSel.nuIdTipoDocumento : this.agregarPersonaForm.get('nuTipoDocumento').value;
    this.objPersona.lstArchivoRepresentante=[];

    this.objPersona.lstArchivoRepresentante=this.lstArchivoRepresentanteTmp;
    this.lstArchivoRepresentanteTmp=[];

    if (this.isInit) {
      if (this.globalService.dataUsuarioSel.nuIdTipoOrigen == 1) {// NACIONAL
            if (this.nuIdTipoDocumento == 1) { //DNI

          this.objPersona.nuIdTipoOrigen = +this.globalService.dataUsuarioSel.nuIdTipoOrigen; // NACIONAL
          this.objPersona.nuIdTipoPersona = 1; // NATURAL
          this.objPersona.nuIdPais = 168;
          this.objPersona.nuIdPaisOri = 168;
          this.objPersona.nuIdTipoDocumento = +this.nuIdTipoDocumento;
          this.objPersona.vcDocIdentidad=this.globalService.dataUsuarioSel.vcDocIdentidad;
          this.objPersona.vcIdTipoDocumento='DNI';


          if (!this.blErrorPide) { // pide ok o default
            let data = this.objPide.lstResultReniec[0];
            this.objPersona.vcNombres = data.vcReniecNombres;
            this.objPersona.vcApPaterno = data.vcReniecApPaterno;
            this.objPersona.vcApMaterno = data.vcReniecApMaterno;
            this.objPersona.vcDireccion = data.vcReniecDireccion;
          } else {
            this.objPersona.vcNombres = this.agregarPersonaForm.get('vcNombres').value;
            this.objPersona.vcApPaterno = this.agregarPersonaForm.get('vcPrimerApellido').value;
            this.objPersona.vcApMaterno = this.agregarPersonaForm.get('vcSegundoApellido').value;
            this.objPersona.nuDepartamento=this.agregarPersonaForm.get('nuDepartamento').value;
            this.objPersona.nuProvincia=this.agregarPersonaForm.get('nuProvincia').value;
            this.objPersona.nuDistrito=this.agregarPersonaForm.get('nuDistrito').value;
            this.objPersona.vcDireccion = this.agregarPersonaForm.get('vcDireccion').value;
          }

          this.objPersona.nuGenero = +this.agregarPersonaForm.get('nuGenero').value;
          this.objPersona.vcTelefono = this.agregarPersonaForm.get('vcTelefono').value;
          this.objPersona.nuFlagTituRepre = +this.agregarPersonaForm.get('nuFlagTituRepre').value;
          this.objPersona.vcNroExpediente = this.agregarPersonaForm.get('vcNroExpediente').value;
          this.objPersona.vcNroSolicitud  = this.agregarPersonaForm.get('vcPartidaRegistral').value;

        } else if (this.nuIdTipoDocumento == 2) { //RUC
          this.objPersona.nuIdTipoOrigen = +this.globalService.dataUsuarioSel.nuIdTipoOrigen;
          this.objPersona.nuIdTipoPersona = 2; // Juridica
          this.objPersona.nuIdPais = 168;
          this.objPersona.nuIdPaisOri = 168;
          this.objPersona.nuIdTipoDocumento = +this.nuIdTipoDocumento;
          this.objPersona.vcDocIdentidad=this.globalService.dataUsuarioSel.vcDocIdentidad;
          this.objPersona.vcIdTipoDocumento='RUC';

          this.objPersona.vcNroExpediente = this.agregarPersonaForm.get('vcNroExpediente').value;
          this.objPersona.vcNroSolicitud  = this.agregarPersonaForm.get('vcPartidaRegistral').value;

          if (this.isInit) {
            this.objPersona.vcIdTipoDocumento = this.globalService.dataUsuarioSel.vcIdTipoDocumento;
            this.objPersona.vcDocIdentidad = this.globalService.dataUsuarioSel.vcDocIdentidad;
            this.objPersona.nuFlagSolicitante = 1;
            this.objPersona.vcCorreo = this.globalService.dataUsuarioSel.vcCorreo;
          } else {
            this.objPersona.vcIdTipoDocumento = this.lstTipoDocumento.filter((e) => e.nuIdTipoDocumento == this.nuIdTipoDocumento)[0].vcDescripcion;
            this.objPersona.vcDocIdentidad = this.agregarPersonaForm.get('vcNroDocumento').value;
            this.objPersona.vcCorreo = '';
            this.objPersona.nuFlagSolicitante = 0;
          }

          if (!this.blErrorPide) { // pide ok o default
            let data = this.objPide.objDatosRuc;
            this.objPersona.vcRazonSocial = data.vcRazonSocial;
            this.objPersona.vcDireccion = data.vcDireccion;
            this.agregarPersonaForm.controls.vcDireccion.setValue(data.vcDireccion);
          } else {
            this.objPersona.vcRazonSocial = this.agregarPersonaForm.get('vcRsocial').value;
            this.objPersona.nuDepartamento=this.agregarPersonaForm.get('nuDepartamento').value;
            this.objPersona.nuProvincia=this.agregarPersonaForm.get('nuProvincia').value;
            this.objPersona.nuDistrito=this.agregarPersonaForm.get('nuDistrito').value;
            this.objPersona.vcDireccion = this.agregarPersonaForm.get('vcDireccion').value;
          }
          this.objPersona.nuFlagTituRepre = +this.agregarPersonaForm.get('nuFlagTituRepre').value;

        }
      } else if (this.globalService.dataUsuarioSel.nuIdTipoOrigen == 2) { // EXTRANJERO
        this.objPersona.nuIdTipoOrigen = +this.globalService.dataUsuarioSel.nuIdTipoOrigen;
        this.objPersona.nuIdTipoPersona = +this.agregarPersonaForm.get('nuTipoPersoneria').value;
        this.objPersona.nuIdPais = 168;
        this.objPersona.nuIdPaisOri = this.agregarPersonaForm.get('nuPaisOrigen').value;
        this.objPersona.vcPais = this.objPersona.nuIdPais > 0 ? this.lstPaises.filter((e) => e.nuIdUbigeo == this.objPersona.nuIdPais)[0].vcDescripcion : '';
        this.objPersona.nuIdTipoDocumento = +this.nuIdTipoDocumento;

        if (this.isInit) {
          this.objPersona.vcIdTipoDocumento = this.globalService.dataUsuarioSel.vcIdTipoDocumento;
          this.objPersona.nuFlagSolicitante = 1;
          this.objPersona.vcCorreo = this.globalService.dataUsuarioSel.vcCorreo;
        } else {
          this.objPersona.vcIdTipoDocumento = this.lstTipoDocumento.filter((e) => e.nuIdTipoDocumento == this.nuIdTipoDocumento)[0].vcDescripcion;
          this.objPersona.vcCorreo = '';
          this.objPersona.nuFlagSolicitante = 0;
        }

        this.objPersona.vcDocIdentidad = this.agregarPersonaForm.get('vcNroDocumento').value;
        this.objPersona.vcNombres = this.agregarPersonaForm.get('vcNombres').value;
        this.objPersona.vcApPaterno = this.agregarPersonaForm.get('vcPrimerApellido').value;
        this.objPersona.vcApMaterno = this.agregarPersonaForm.get('vcSegundoApellido').value;
        this.objPersona.vcDireccion = this.agregarPersonaForm.get('vcDireccion').value;
        this.objPersona.nuGenero = +this.agregarPersonaForm.get('nuGenero').value;
        this.objPersona.vcTelefono = this.agregarPersonaForm.get('vcTelefono').value;
        this.objPersona.nuFlagTituRepre = +this.agregarPersonaForm.get('nuFlagTituRepre').value;

        this.objPersona.nuDepartamento = +this.agregarPersonaForm.get('nuDepartamento').value;
        this.objPersona.nuProvincia = +this.agregarPersonaForm.get('nuProvincia').value;
        this.objPersona.nuDistrito = +this.agregarPersonaForm.get('nuDistrito').value;
        this.objPersona.vcDepartamento = this.objPersona.nuDepartamento > 0 ? this.lstDepartamentos.filter((e) => e.nuIdUbigeo == this.objPersona.nuDepartamento)[0].vcDescripcion : '';
        this.objPersona.vcProvincia = this.objPersona.nuProvincia > 0 ? this.lstProvincias.filter((e) => e.nuIdUbigeo == this.objPersona.nuProvincia)[0].vcDescripcion : '';
        this.objPersona.vcDistrito = this.objPersona.nuDistrito > 0 ? this.lstDistritos.filter((e) => e.nuIdUbigeo == this.objPersona.nuDistrito)[0].vcDescripcion : '';

        this.objPersona.vcNroExpediente = this.agregarPersonaForm.get('vcNroExpediente').value;
        this.objPersona.vcNroSolicitud  = this.agregarPersonaForm.get('vcPartidaRegistral').value;
      }
    } else {

      if (this.globalService.dataUsuarioSel.nuIdTipoOrigen == 1) {// NACIONAL
        if (this.nuIdTipoDocumento == 1) { //DNI

      this.objPersona.nuIdTipoOrigen = +this.globalService.dataUsuarioSel.nuIdTipoOrigen; // NACIONAL
      this.objPersona.nuIdTipoPersona = 1; // NATURAL
      this.objPersona.nuIdPais = 168;
      this.objPersona.nuIdPaisOri = 168;
      this.objPersona.nuIdTipoDocumento = +this.nuIdTipoDocumento;
      this.objPersona.vcDocIdentidad=this.agregarPersonaForm.get('vcNroDocumento').value;
      this.objPersona.vcIdTipoDocumento='DNI';


      if (!this.blErrorPide) { // pide ok o default
        let data = this.objPide.lstResultReniec[0];
        this.objPersona.vcNombres = data.vcReniecNombres;
        this.objPersona.vcApPaterno = data.vcReniecApPaterno;
        this.objPersona.vcApMaterno = data.vcReniecApMaterno;
        this.objPersona.vcDireccion = data.vcReniecDireccion;
      } else {
        this.objPersona.vcNombres = this.agregarPersonaForm.get('vcNombres').value;
        this.objPersona.vcApPaterno = this.agregarPersonaForm.get('vcPrimerApellido').value;
        this.objPersona.vcApMaterno = this.agregarPersonaForm.get('vcSegundoApellido').value;
        this.objPersona.nuDepartamento=this.agregarPersonaForm.get('nuDepartamento').value;
        this.objPersona.nuProvincia=this.agregarPersonaForm.get('nuProvincia').value;
        this.objPersona.nuDistrito=this.agregarPersonaForm.get('nuDistrito').value;
        this.objPersona.vcDireccion = this.agregarPersonaForm.get('vcDireccion').value;
      }
      this.objPersona.nuGenero = +this.agregarPersonaForm.get('nuGenero').value;
      this.objPersona.vcTelefono = this.agregarPersonaForm.get('vcTelefono').value;
      this.objPersona.nuFlagTituRepre = +this.agregarPersonaForm.get('nuFlagTituRepre').value;

      this.objPersona.vcNroExpediente = this.agregarPersonaForm.get('vcNroExpediente').value;
      this.objPersona.vcNroSolicitud  = this.agregarPersonaForm.get('vcPartidaRegistral').value;

    } else if (this.nuIdTipoDocumento == 2) { //RUC
      this.objPersona.nuIdTipoOrigen = +this.globalService.dataUsuarioSel.nuIdTipoOrigen;
      this.objPersona.nuIdTipoPersona = 2; // Juridica
      this.objPersona.nuIdPais = 168;
      this.objPersona.nuIdPaisOri = 168;
      this.objPersona.nuIdTipoDocumento = +this.nuIdTipoDocumento;
      this.objPersona.vcDocIdentidad=this.globalService.dataUsuarioSel.vcDocIdentidad;
      this.objPersona.vcIdTipoDocumento='RUC';

      if (this.isInit) {
        this.objPersona.vcIdTipoDocumento = this.globalService.dataUsuarioSel.vcIdTipoDocumento;
        this.objPersona.vcDocIdentidad = this.globalService.dataUsuarioSel.vcDocIdentidad;
        this.objPersona.nuFlagSolicitante = 1;
        this.objPersona.vcCorreo = this.globalService.dataUsuarioSel.vcCorreo;
      } else {
        this.objPersona.vcIdTipoDocumento = this.lstTipoDocumento.filter((e) => e.nuIdTipoDocumento == this.nuIdTipoDocumento)[0].vcDescripcion;
        this.objPersona.vcDocIdentidad = this.agregarPersonaForm.get('vcNroDocumento').value;
        this.objPersona.vcCorreo = '';
        this.objPersona.nuFlagSolicitante = 0;
      }

      if (!this.blErrorPide) { // pide ok o default
        let data = this.objPide.objDatosRuc;
        this.objPersona.vcRazonSocial = data.vcRazonSocial;
        this.objPersona.vcDireccion = data.vcDireccion;
        this.agregarPersonaForm.controls.vcDireccion.setValue(data.vcDireccion);
      } else {
        this.objPersona.vcRazonSocial = this.agregarPersonaForm.get('vcRsocial').value;
        this.objPersona.nuDepartamento=this.agregarPersonaForm.get('nuDepartamento').value;
        this.objPersona.nuProvincia=this.agregarPersonaForm.get('nuProvincia').value;
        this.objPersona.nuDistrito=this.agregarPersonaForm.get('nuDistrito').value;
        this.objPersona.vcDireccion = this.agregarPersonaForm.get('vcDireccion').value;
      }
      this.objPersona.nuFlagTituRepre = +this.agregarPersonaForm.get('nuFlagTituRepre').value;

      this.objPersona.vcNroExpediente = this.agregarPersonaForm.get('vcNroExpediente').value;
      this.objPersona.vcNroSolicitud  = this.agregarPersonaForm.get('vcPartidaRegistral').value;

    }
  } else if (this.globalService.dataUsuarioSel.nuIdTipoOrigen == 2) { // EXTRANJERO
    this.objPersona.nuIdTipoOrigen = +this.globalService.dataUsuarioSel.nuIdTipoOrigen;
    this.objPersona.nuIdTipoPersona = +this.agregarPersonaForm.get('nuTipoPersoneria').value;
    this.objPersona.nuIdPais = 168;
    this.objPersona.nuIdPaisOri = this.agregarPersonaForm.get('nuPaisOrigen').value;
    this.objPersona.vcPais = this.objPersona.nuIdPais > 0 ? this.lstPaises.filter((e) => e.nuIdUbigeo == this.objPersona.nuIdPais)[0].vcDescripcion : '';
    this.objPersona.nuIdTipoDocumento = +this.nuIdTipoDocumento;

    if (this.isInit) {
      this.objPersona.vcIdTipoDocumento = this.globalService.dataUsuarioSel.vcIdTipoDocumento;
      this.objPersona.nuFlagSolicitante = 1;
      this.objPersona.vcCorreo = this.globalService.dataUsuarioSel.vcCorreo;
    } else {
      this.objPersona.vcIdTipoDocumento = this.lstTipoDocumento.filter((e) => e.nuIdTipoDocumento == this.nuIdTipoDocumento)[0].vcDescripcion;
      this.objPersona.vcCorreo = '';
      this.objPersona.nuFlagSolicitante = 0;
    }

    this.objPersona.vcDocIdentidad = this.agregarPersonaForm.get('vcNroDocumento').value;
    this.objPersona.vcNombres = this.agregarPersonaForm.get('vcNombres').value;
    this.objPersona.vcApPaterno = this.agregarPersonaForm.get('vcPrimerApellido').value;
    this.objPersona.vcApMaterno = this.agregarPersonaForm.get('vcSegundoApellido').value;
    this.objPersona.vcDireccion = this.agregarPersonaForm.get('vcDireccion').value;
    this.objPersona.nuGenero = +this.agregarPersonaForm.get('nuGenero').value;
    this.objPersona.vcTelefono = this.agregarPersonaForm.get('vcTelefono').value;
    this.objPersona.nuFlagTituRepre = +this.agregarPersonaForm.get('nuFlagTituRepre').value;

    this.objPersona.nuDepartamento = +this.agregarPersonaForm.get('nuDepartamento').value;
    this.objPersona.nuProvincia = +this.agregarPersonaForm.get('nuProvincia').value;
    this.objPersona.nuDistrito = +this.agregarPersonaForm.get('nuDistrito').value;
    this.objPersona.vcDepartamento = this.objPersona.nuDepartamento > 0 ? this.lstDepartamentos.filter((e) => e.nuIdUbigeo == this.objPersona.nuDepartamento)[0].vcDescripcion : '';
    this.objPersona.vcProvincia = this.objPersona.nuProvincia > 0 ? this.lstProvincias.filter((e) => e.nuIdUbigeo == this.objPersona.nuProvincia)[0].vcDescripcion : '';
    this.objPersona.vcDistrito = this.objPersona.nuDistrito > 0 ? this.lstDistritos.filter((e) => e.nuIdUbigeo == this.objPersona.nuDistrito)[0].vcDescripcion : '';

    this.objPersona.vcNroExpediente = this.agregarPersonaForm.get('vcNroExpediente').value;
    this.objPersona.vcNroSolicitud  = this.agregarPersonaForm.get('vcPartidaRegistral').value;
  }

    }
  }

  //TODO: modificar para coincidir con todos los casos
  setDataPersonaDefault() {
    console.log('setDataPersonaDefault');

    this.objPersona = {};
    console.log('this.globalService.dataUsuarioSel.vcIdTipoDocumento;: ' + this.globalService.dataUsuarioSel.vcIdTipoDocumento);
    this.objPersona.vcIdTipoDocumento = this.globalService.dataUsuarioSel.vcIdTipoDocumento;
    this.objPersona.vcDocIdentidad = this.globalService.dataUsuarioSel.vcDocIdentidad;

    // RUC
    if (this.globalService.dataUsuarioSel.nuIdTipoDocumento == 2) {
      this.objPersona.vcRazonSocial = this.globalService.dataUsuarioSel.vcNombreCompleto;
    }


    this.agregarPersonaForm.patchValue({
      nuTipoDocumento: this.globalService.dataUsuarioSel.nuIdTipoDocumento
    });
  }

  //TODO: evaluar si el seteo se realizar en la petición al pide
  agregarPersona() {

    if(!this.dovalidaRepitePersona(this.objPersona)){

    console.log("agregar persona");
    this.setDataPersona2();
    console.log("inicial? = "+this.isInit);
    if(this.isInit){
      this.objPersona.nuFlagSolicitante=1;
    }
    console.log("objPersona: "+JSON.stringify(this.objPersona));
    this.lstPersona.push(this.objPersona);
    this.lstPersona = this.lstPersona.sort((a, b) => b.nuFlagSolicitante - a.nuFlagSolicitante);
    this.isInit = false;
    this.validarFormulario();
    this.modalRef.hide();
    // console.log('letPersona: ' + JSON.stringify(this.lstPersona));
  }else{
    this.toastr.error("El documento ya fue agregado.", "Error");
    // console.log("Persona ya agregada");
  }
  }

  dovalidaRepitePersona(objPersonaTmp : any){
    let blFlag=false;
    for (let objPersona of this.lstPersona){
      if(objPersona.vcDocIdentidad==objPersonaTmp.vcDocIdentidad){
        blFlag=true;
      }
    }

    return blFlag;
  }

  eliminarPersona(row: any) {
    this.lstPersona.splice(row, 1);
    // console.log('this.lstPersona.length: ' + this.lstPersona.length);
    if (row == 0) {
      this.objPersona = {};
      this.blErrorPide = false;
      this.lstDepartamentos = [];
      this.lstProvincias = [];
      this.lstDistritos = [];
      this.agregarPersonaForm.reset();
      this.resetShowDataForm();
      this.isInit = true;
      this.personaInicial();
      this.validarFormulario();
    }
  }

  cargarArchivoRepresentante(event : any){
    // console.log(event.target.files);
    if (event.target.files.length > 0) {
      // this.spinner = true;
      Array.from(event.target.files).forEach((file: any) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {

              this.agregaDocumento(reader.result, file);

        }
      });
    }
    event.target.value = '';

  }

  agregaDocumento(data: any, file : any) {
    console.log('agregaDocumento');
    let regex = /(?:\.([^.]+))?$/;
    let extension: any = "."+(regex.exec(file.name)[1]).toLowerCase();

    console.log('extension: '+extension);

    if(this.validaExtension(this.objConfigArchRepresentante.vcExtensiones.split(", "), extension)){
      if(file.size> 0 && file.size<=this.objConfigArchRepresentante.nuTamanio){
        if(file.name.length<101){
    let objArchivo : any ={
      vcFileBase64: data,
      vcNomOriginal : file.name,
      nuLong : file.size,
      nuIdTipoArchivo:2
    }

    this.lstArchivoRepresentanteTmp.push(objArchivo);

  }else{
    this.toastr.error("El nombre es demasiado largo, el nombre de su archivo debe contener máximo 100 caracteres.", "Error");
    this._input_archivo_representante.nativeElement.value="";
  }
  }else{
    this.toastr.error("El tamaño máximo del archivo debe ser "+this.objConfigArchRepresentante.nuTamanio+" Bytes", "Error");
    this._input_archivo_representante.nativeElement.value="";
  }
  }else{
    this.toastr.error("Solo puede agregar archivos con la(s) siguiente(s) extension(es): "+this.objConfigArchRepresentante.vcExtensiones, "Error");
    this._input_archivo_representante.nativeElement.value="";
  }
  }

  validaExtension(arrayExtensiones: any, vcExtension: any){
    let blFlag=false;
    for(let i=0; i<arrayExtensiones.length; i++){
      if(arrayExtensiones[i]==vcExtension){
        blFlag=true;
      }
    }
    return blFlag;
  }

  eliminarArchivo(row: any) {
    this.lstArchivoRepresentanteTmp.splice(row, 1);
    this.validarFormulario();
  }

  consultaUbigeo(data: any) {
    this.ubigeoService.getWithPost$(data).subscribe(
      resp => {
        if (this.paramsUbigeo.nuIdTipo == 2) { // paises
          this.lstPaises = resp.lstUbigeo;
        } else if (this.paramsUbigeo.nuIdTipo == 3) { // departamentos
          this.lstDepartamentos = resp.lstUbigeo;
        } else if (this.paramsUbigeo.nuIdTipo == 4) { // provincias
          this.lstProvincias = resp.lstUbigeo;

            // this.agregarPersonaForm.patchValue({ nuProvincia: this.objPersona.nuProvincia });
        } else if (this.paramsUbigeo.nuIdTipo == 5) { // distritos
          this.lstDistritos = resp.lstUbigeo;

            // this.agregarPersonaForm.patchValue({ nuDistrito: this.objPersona.nuDistrito });
        }
      },
      error => {
        this._spinner.hide();
        console.log('error');
      }
    );
  }

  modalAgregarPersona(template: any) {
    if (this.lstPersona.length > 0) {
      this.objPersona = {};
      this.blErrorPide = false;
      this.isInit = false;
      this.lstDepartamentos = [];
      this.lstProvincias = [];
      this.lstDistritos = [];
      this.agregarPersonaForm.reset();
      // this.agregarPersonaForm.patchValue({ nuTipoDocumento: 1 });
    }

    let objClass = { class: 'modal-lg' };
    this.openModal(template, objClass);
  }

  openModal(template: TemplateRef<any>, objClass: any) {
    this.modalRef = this.modalService.show(template, objClass);
  }

  atras() {
    console.log('navegacionAtras');
    this.propagar.emit(4);
  }

  siguiente() {

    if (this.isInvalid) return;

    this.propagar.emit(6);

    this.globalService.agregarDatosPersonales(this.lstPersona);
    this.globalService.obtenerData();
  }



}
