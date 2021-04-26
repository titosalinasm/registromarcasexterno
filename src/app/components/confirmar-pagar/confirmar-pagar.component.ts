import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NODATA } from 'dns';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/global.service';
import { PagoService } from 'src/app/services/data-pago.service';
import { RegistrarSolicitudService } from 'src/app/services/registrar-solicitud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirmar-pagar',
  templateUrl: './confirmar-pagar.component.html',
  styleUrls: ['./confirmar-pagar.component.css']
})
export class ConfirmarPagarComponent implements OnInit {

  // templateConfirmacionRegistro
  @ViewChild('templateConfirmacionRegistro') _templateConfirmacionRegistro: TemplateRef<any>;
  @ViewChild('templatePrioridadExtranjera') _templatePrioridadExtranjera: TemplateRef<any>;
  @ViewChild('templateClasificacionSigno') _templateClasificacionSigno: TemplateRef<any>;
  @ViewChild('templeteDatosPersonales') _templeteDatosPersonales: TemplateRef<any>;
  

  @Output() propagar = new EventEmitter<any>();
  @Output() validEvent = new EventEmitter<any>();

  modalRef: BsModalRef;
  isInvalid: boolean = true;
  blcargarDatos: boolean = true;
  objRegistroMarcas: any = {};
  blBtnPagar: boolean = true;
  nuMedioPago: number; // 1:pagalo.pe, 2:tarjeta de credito

  lstPagos: any[] = [];

  objData: any = {};
  vcCodExpediente: string;
  blShowRegistroPago: boolean = true;

  objPrioridadExtranjera: any = {};
  objClasificacionSigno: any = {};
  objDatosPersona : any={};

  pagoForm = this.formBuilder.group({
    dtFechaOperacion: ['', [Validators.required]],
    vcNroOperacion: ['', [Validators.required]]
  });

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private _spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private pagoService: PagoService,
    private enviarSolicitudService: RegistrarSolicitudService,
    private toastr : ToastrService,
  ) { }

  ngOnInit(): void {
    console.log('ConfirmarPagarComponent');
  }

  cargarDatos() {
    // if (this.blcargarDatos) {
    this.objData = this.globalService.obtenerData();
    // card 1: asesoria virtual
    this.objRegistroMarcas.vcFlagAsesoria = this.objData.objAsesoria.nuFlagAsesoria == 1 ? 'SI' : 'NO';
    this.objRegistroMarcas.blShowNroAsesoria = this.objData.objAsesoria.nuFlagAsesoria == 1 ? true : false;
    this.objRegistroMarcas.vcNroAsesoria = this.objData.objAsesoria.vcNroAsesoria;

    // card 2: datos signo
    let lstTipoSolicitud: any[] = this.globalService.listaGeneral.lstTipoSolicitud;
    let lstTipoPresentacion: any[] = this.globalService.listaGeneral.lstTipoPresentacion;
    this.objRegistroMarcas.vcTipoSolicitud = lstTipoSolicitud.filter((e) => e.nuIdTipoSolicitud == this.objData.objDatosSigno.nuIdTipoSolicitud)[0].vcDesTipoSolicitud;
    this.objRegistroMarcas.vcInteresReal = this.objData.objDatosSigno.nuFlagInteresReal == 1 ? 'SI (expediente: ' + this.objData.objDatosSigno.vcNroExpediente + ')' : 'NO';
    this.objRegistroMarcas.vcDerechoPreferente = this.objData.objDatosSigno.nuFlaDerechoPreferente == 1 ? 'SI (certificado: ' + this.objData.objDatosSigno.vcNroCertificado + ')' : 'NO';
    this.objRegistroMarcas.vcTipoSigno = lstTipoPresentacion.filter((e) => e.nuIdTipoPresentacion == this.objData.objDatosSigno.nuIdTipoSigno)[0].vcDesPresentacion;
    this.objRegistroMarcas.vcDenominacion = this.objData.objDatosSigno.vcDenominacion;
    this.objRegistroMarcas.objArchivoSigno = this.objData.objDatosSigno.lstArchivosSigno[0];

    // card 3: clasificacion signo
    this.objRegistroMarcas.lstClasesSelccionadas = this.objData.lstClases;
    // this.objRegistroMarcas.lstClasesSelccionadas = this.clasesFormat(objData.lstClases);

    // card 4: prioridad extranjera
    this.objRegistroMarcas.lstPrioridadExtranjera = this.objData.objPrioridadExtr.nuFlagPrioridadExtr == 1 ? this.objData.objPrioridadExtr.lstPrioridad : [];

    // card 5: datos personales
    this.objRegistroMarcas.lstDatosPersonales = this.objData.lstPersona;

    // card 6: pago
    // let objPago: any = {
    //   vcTotalClasePrincipal: 'S/ 534.99',
    //   vcTotalClasesAdicionales: 'S/ 1066.60',
    //   vcTotalPagar: 'S/ 1601.59'
    // };
    this.objRegistroMarcas.objPago = this.objData.objPago;

    console.log('objRegistroMarcas 1: ' + JSON.stringify(this.objRegistroMarcas));

    // this.blcargarDatos = false;
    // }
  }

  // clasesFormat(lista: any) {
  //   let arr: any[] = [];
  //   let aux = 0;
  //   let vcClase: string = '';
  //   lista.forEach(e => {
  //     if (aux == e.nuIdClase) {



  //       let obj = {
  //         nuIdClase: e.nuIdClase,
  //         vcClase: e.vcClase
  //       };
  //     } else {
  //       let obj = {
  //         nuIdClase: e.nuIdClase,
  //         vcClase: e.vcClase
  //       };
  //     }

  //     aux = e.nuIdClase;
  //   });

  //   return arr;
  // }

  editarCard(op: number) {
    this.propagar.emit(op);
  }

  toggleBtnPagar() {
    this.blBtnPagar = !this.blBtnPagar;
  }

  cambiarMedioPago(e) {
    console.log(e.target.value);
    this.nuMedioPago = e.target.value;
  }

  agregarPago() {
    console.log('agregarPago');
    this._spinner.show();

    let objPagoForm = this.pagoForm.value;
    let params: any = {
      vcUsuario: this.globalService.vcCodUsuarioSel,
      objPago: {
        nuIdTipoPago: 1,
        vcCodigoBanco: 'B06',
        vcNroOperacion: objPagoForm.vcNroOperacion,
        dtFechaOperacion: this.convertirFecha(objPagoForm.dtFechaOperacion),
      }
    };

    console.log('params: ' + JSON.stringify(params));
    this.pagoService.getWithPost$(params).subscribe(
      resp => {
        console.log('data pago: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
          this.lstPagos.push(resp.objPago);
          this.pagoForm.reset();
          this.validarFormulario();
          this.toastr.success('El pago se agrego correctamente.', 'Alertar');
        } else {
          this.toastr.error('No pudimos validar su pago o el pago ya fue usado.', 'Error');
          console.log('error pago');
        }
        this._spinner.hide();
      },
      error => {
        this._spinner.hide();
        this.toastr.error('Lo sentimos tuvimos un problema con el pago ingresado.', 'Error');
      }
    );
  }

  eliminarPago(row: any) {
    this.lstPagos.splice(row, 1);
    this.validarFormulario();
  }

  validarFormulario() {
    let cantidad = this.objRegistroMarcas.objPago.nuSumCantClases;
    let total = this.objRegistroMarcas.objPago.sumaTotalClases;

    let suma = 0;
    this.lstPagos.forEach(e => {
      suma += e.nuMonto;
    });

    this.isInvalid = (this.lstPagos.length == cantidad && suma == total) ? false : true;
    this.validEvent.emit(this.isInvalid);
  }

  registrarSolicitud() {
    console.log('registrarSolicitud');
    this._spinner.show();
    this.globalService.agregarPago(this.lstPagos);
    this.globalService.obtenerData();

    this.enviarSolicitudService.getWithPost$(this.objData).subscribe(
      resp => {
        console.log('resp: ' + JSON.stringify(resp));
        this.vcCodExpediente = resp.nuExpediente + '-' + resp.nuAnio + '/' + resp.vcArea;
        let objClass = {
          backdrop: true,
          ignoreBackdropClick: true,
          class: 'modal-lg'
        };
        this.openModal(this._templateConfirmacionRegistro, objClass);
        this._spinner.hide();
        // this.spinnerEvent.emit(false);
      },
      error => {
        this._spinner.hide();
        console.log('error general');
        // this.spinnerEvent.emit(false);
        // this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
      },
    );
  }

  modalPrioridadExtranjera(item: any) {
    this.objPrioridadExtranjera = item;
    let objClass = {
      class: 'modal-lg'
    };
    this.openModal(this._templatePrioridadExtranjera, objClass);
  }

  modalClasificacionSigno(item: any) {
    this.objClasificacionSigno = item;
    let objClass = {
      class: 'modal-lg'
    };
    this.openModal(this._templateClasificacionSigno, objClass);
  }
  modalDatosPersonales(item : any){
    this.objDatosPersona = item;
    console.log(this.objDatosPersona);
    let objClass = {
      class: 'modal-lg'
    };
    this.openModal(this._templeteDatosPersonales, objClass);
  }

  atras() {
    console.log('navegacionAtras');
    this.propagar.emit(5);
  }

  finalizar() {
    this.modalRef.hide();
    this.router.navigate(['/inicio']);
  }

  /**/

  openModal(template: TemplateRef<any>, objClass: any) {
    this.modalRef = this.modalService.show(template, objClass);
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  convertirFecha(date: any) {
    const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const mes = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const ano = date.getFullYear();
    return ano + '-' + mes + '-' + dia;
  }

  descargarArchivo(base64: any, vcNombreOriginal) {

    const source = base64;
    const link = document.createElement("a");
    link.href = source;
    link.download =vcNombreOriginal;
    link.click();



  }

}
