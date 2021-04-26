import { Component, OnInit, TemplateRef, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/global.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubirArchivoService } from 'src/app/services/subir-archivo.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prioridad-extranjera',
  templateUrl: './prioridad-extranjera.component.html',
  styleUrls: ['./prioridad-extranjera.component.css']
})
export class PrioridadExtranjeraComponent implements OnInit {

  @Output() propagar = new EventEmitter<any>();
  @Output() validEvent = new EventEmitter<any>();
  @ViewChild('templateAgregarPrioridadChild') templateAgregarPrioridadChild: TemplateRef<any>;
  @ViewChild('input_archivo_prioridad') _input_archivo_prioridad: ElementRef;

  blcargarDatos: boolean = true;
  lstArchivo: any[] = [];

  modalRef: BsModalRef;
  blPrioridad: boolean = false;
  isInvalid: boolean = false;
  nuModo: number = 1; // 1: inserttar, 2:actualizar
  rowUpdate: number;
  lstPaises: any = [];
  lstTipoPrioridad: any = [];
  lstClases: any[] = [];

  nuFlagPrioridadExtr: boolean = false;
  nuFlagTodos: number;
  lstPrioridad: any[] = [];

  blShowClase: boolean = false;
  blDisableTipoPrioridad: boolean = false;
  blShowProductoServicio: boolean = false;

  objConfigArchPrioridad : any;

  agregarPrioridadForm = this.formBuilder.group({
    // nuFlagPrioridadExtr: ['', [Validators.required]],
    nuIdClase: ['', [Validators.required]],
    vcNroSolicitud: ['', [Validators.required]],
    vcFechaPrioridad: ['', [Validators.required]],
    nuPaisPrioridad: ['', [Validators.required]],
    nuIdTipoPrioridad: ['', [Validators.required]],
    vcProductosServicios: ['', [Validators.required]],
  });

  constructor(
    private globalService: GlobalService,
    private _spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private subirArchivoService: SubirArchivoService,
    private localeService: BsLocaleService,
    private toastr : ToastrService,
  ) {
    this.localeService.use('es');
  }

  ngOnInit() {
    console.log('PrioridadExtranjeraComponent');
  }

  cargarDatos() {
    if (this.blcargarDatos) {
      this.lstPaises = this.globalService.listaGeneral.lstPaises;
      // console.log('listaGeneral: ' + JSON.stringify(this.globalService.listaGeneral));
      this.lstTipoPrioridad = this.globalService.listaGeneral.lstTipoPrioridad;
      this.lstClases = this.globalService.obtenerData().lstClases;

      this.objConfigArchPrioridad=this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_CONF_ARCHIVO))[0].clValor1.objConfigArchPrioridad;
      console.log("configuracion: archivos: "+JSON.stringify(this.objConfigArchPrioridad))
      // console.log('lstClases: ' + JSON.stringify(this.lstClases));
      this.bindEventsForm();

      this.blcargarDatos = true;
    }
  }

  bindEventsForm() {
    // this.asesoriaForm.valueChanges.subscribe(
    //   value => this.validEvent.emit(this.isInvalid)
    // );

    // console.log(this.nuFlagPrioridadExtr);

    // this.agregarPrioridadForm.get('blAsesoria').valueChanges.subscribe(value => {
    //   // let _txtNroAsesoria = this.asesoriaForm.get('txtNroAsesoria');
    //   if (value) {
    //     _txtNroAsesoria.enable();
    //     _txtNroAsesoria.setValidators([Validators.required]);
    //   } else {
    //     _txtNroAsesoria.disable();
    //   }

    //   _txtNroAsesoria.updateValueAndValidity();
    // });

    let _nuIdClase = this.agregarPrioridadForm.get('nuIdClase');
    let _nuIdTipoPrioridad = this.agregarPrioridadForm.get('nuIdTipoPrioridad');
    let _vcProductosServicios = this.agregarPrioridadForm.get('vcProductosServicios');

    if (this.nuFlagTodos === 1) {
      _nuIdClase.disable();
      _nuIdTipoPrioridad.setValue(1);
      _nuIdTipoPrioridad.disable();
      _vcProductosServicios.disable();
      this.blShowClase = false;
      this.blShowProductoServicio = false;
    } else if (this.nuFlagTodos === 2) {
      _nuIdClase.enable();
      _vcProductosServicios.enable();
      _nuIdTipoPrioridad.enable();
      this.blShowClase = true;
      this.blShowProductoServicio = true;
    }

    // this.agregarPrioridadForm.get('blAsesoria').valueChanges.subscribe(value => {
    //   let _txtNroAsesoria = this.asesoriaForm.get('txtNroAsesoria');
    //   if (value) {
    //     _txtNroAsesoria.enable();
    //     _txtNroAsesoria.setValidators([Validators.required]);
    //   } else {
    //     _txtNroAsesoria.disable();
    //   }
    // });
  }
  modalAgregarPrioridad(template: any) {
    // this.blShowPersonaPide = false;
    // this.blShowInputPide = false;
    // this.agregarAutorForm.reset();
    // this.lstTipoDocumentos = this.objDataGenerica.lstTipoDocumentos;
    // this.agregarAutorForm.controls.nuTipoDocumento.setValue(1);

    let objClass = { class: 'modal-lg' };
    this.openModal(template, objClass);
  }

  openChild(template: any, op: number) {
    // this.blShowPersonaPide = false;
    // this.blShowInputPide = false;
    // this.agregarAutorForm.reset();
    // this.lstTipoDocumentos = this.objDataGenerica.lstTipoDocumentos;
    // this.agregarAutorForm.controls.nuTipoDocumento.setValue(1);
    this.agregarPrioridadForm.reset();
    this.nuFlagTodos = op;
    this.modalRef.hide();
    this.bindEventsForm();
    let objClass = { class: 'modal-lg' };
    this.openModal(template, objClass);
  }

  openModal(template: TemplateRef<any>, objClass: any) {
    this.modalRef = this.modalService.show(template, objClass);
  }

  checkValue(event: any) {
    this.blPrioridad = event.currentTarget.checked;
    // console.log(event.currentTarget.checked);
    this.validarFormulario();
  }

  validarFormulario() {
    if (this.blPrioridad) {
      if (this.lstPrioridad.length > 0) this.isInvalid = false;
      else this.isInvalid = true;
      // this.lstPrioridad.filter((e) => console.log(e));
    } else {
      this.isInvalid = false;
    }
    this.validEvent.emit(this.isInvalid);
  }

  agregarPrioridad() {
    console.log('agregarPrioridad');

    let objPrioridad: any = {};

    objPrioridad.nuFlagTodos = this.nuFlagTodos;
    objPrioridad.vcNombreClases = this.numeroTodos();
    objPrioridad.vcClases = this.nuFlagTodos === 1 ? this.lstClases.map((e) => e.nuIdClase).join(',') : this.agregarPrioridadForm.value.nuIdClase;
    // objPrioridad.vcClases = this.nuFlagTodos === 1 ? this.numeroTodos() : this.agregarPrioridadForm.value.nuIdClase;
    objPrioridad.vcNroSolicitud = this.agregarPrioridadForm.value.vcNroSolicitud;
    objPrioridad.dtFechaPrioridad = this.agregarPrioridadForm.value.vcFechaPrioridad;
    objPrioridad.vcFechaPrioridad = this.convertirFecha(this.agregarPrioridadForm.value.vcFechaPrioridad);
    objPrioridad.nuIdUbigeoPais = this.agregarPrioridadForm.value.nuPaisPrioridad;
    objPrioridad.vcIdUbigeoPais = this.lstPaises.filter((e) => e.nuIdUbigeoPais === this.agregarPrioridadForm.value.nuPaisPrioridad)[0].vcPais;
    objPrioridad.nuTipoPrioridad = this.agregarPrioridadForm.getRawValue().nuIdTipoPrioridad;
    objPrioridad.vcTipoPrioridad = this.lstTipoPrioridad.filter((e) => e.nuIdPrioridad === this.agregarPrioridadForm.getRawValue().nuIdTipoPrioridad)[0].vcDescripcion;
    objPrioridad.vcProductoServicio = this.agregarPrioridadForm.value.vcProductosServicios;
    objPrioridad.lstArchivoPrioridad = this.lstArchivo;
    console.log('objPrioridad: ' + JSON.stringify(objPrioridad));
    if (this.nuModo === 1) { // insertar
      this.lstPrioridad.push(objPrioridad);
      this.validarFormulario();
    } else if (this.nuModo === 2) { // actualizar
      // this.lstPrioridad.
      this.lstPrioridad[this.rowUpdate] = objPrioridad;
    }
    this.nuModo = 1;
    this.lstArchivo = [];
    this.modalRef.hide();
  }

  editarPrioridad(item: any, row: number) {
    this.rowUpdate = row;
    this.nuFlagTodos = item.nuFlagTodos;
    this.agregarPrioridadForm.controls.vcNroSolicitud.setValue(item.vcNroSolicitud);

    // var mydate = new Date(item.dtFechaPrioridad);
    // console.log(mydate.toDateString());

    this.agregarPrioridadForm.controls.vcFechaPrioridad.setValue(item.dtFechaPrioridad);
    this.agregarPrioridadForm.controls.nuPaisPrioridad.setValue(item.nuIdUbigeoPais);
    this.agregarPrioridadForm.controls.nuIdTipoPrioridad.setValue(item.nuTipoPrioridad);
    this.agregarPrioridadForm.controls.vcProductosServicios.setValue(item.nuTipoPrioridad);
    this.lstArchivo = item.lstArchivoPrioridad;
    this.nuModo = 2;

    let objClass = { class: 'modal-lg' };
    this.openModal(this.templateAgregarPrioridadChild, objClass);
  }

  eliminarPrioridad(index: number) {
    this.lstPrioridad.splice(index, 1);
    this.validarFormulario();
  }

  atras() {
    console.log('navegacionAtras');
    this.propagar.emit(3);
  }

  siguiente() {

    if (this.isInvalid) return;

    this.propagar.emit(5);
    console.log('siguiente');
    let objPrioridadExtranjera: any = {};
    objPrioridadExtranjera.nuFlagPrioridadExtr = this.nuFlagPrioridadExtr ? 1 : 0;

    // let lstPrioridad: any = [];
    // let objPrioridad: any = {};

    let lstArchivo: any = [];
    let objArchivoPrioridad: any = {};
    lstArchivo.push(objArchivoPrioridad);
    objPrioridadExtranjera.lstPrioridad = this.lstPrioridad;

    this.globalService.agregarPrioridadExtranjera(objPrioridadExtranjera);
    this.globalService.obtenerData();
  }

  // cargarArchivoPrioridad(event: any) {
  //   let objData: any = this.globalService.obtenerData();
  //   // let result = this.verificarTipoArchivo(event, objData.objObra.nuIdTipoObra);
  //   // if (result.length > 0) {
  //   if (true) {
  //     this.subirArchivo(event.target.files[0]);
  //     // this.subirArchivo(event.target.files[0]);
  //     // this.subirArchivo(event.target.files[0], objData.objObra.nuIdTipoObra);
  //     // this._input_archivo_prioridad.nativeElement.value = "";

  //   } else {
  //     this._input_archivo_prioridad.nativeElement.value = "";
  //     // this.toast.showToast('Error', 'Solo se permite la carga de los archivos ' + (this.obtenerExtensiones(objData.objObra.nuIdTipoObra) + '').replace(',', ", ") + '.', 'error');
  //   }
  // }


  cargarArchivoPrioridad(event : any){
    // console.log(event.target.files);
    if (event.target.files.length > 0) {
      // this.spinner = true;
      Array.from(event.target.files).forEach((file: any) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
              // this.previsualizarImagen(file);
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

    if(this.validaExtension(this.objConfigArchPrioridad.vcExtensiones.split(", "), extension)){
      if(file.size> 0 && file.size<=this.objConfigArchPrioridad.nuTamanio){
        if(file.name.length<101){

    let objArchivo : any ={
      vcFileBase64: data,
      vcNomOriginal : file.name,
      nuLong : file.size,
      nuIdTipoArchivo: 2
    }
    // objArchivo.vcImgUrl = file.target.result;
    this.lstArchivo.push(objArchivo);

  }else{
    this.toastr.error("El nombre es demasiado largo, el nombre de su archivo debe contener máximo 100 caracteres.", "Error");
    this._input_archivo_prioridad.nativeElement.value="";
  }
  }else{
    this.toastr.error("El tamaño máximo del archivo debe ser "+this.objConfigArchPrioridad.nuTamanio+" Bytes", "Error");
    this._input_archivo_prioridad.nativeElement.value="";
  }
  }else{
    this.toastr.error("Solo puede agregar archivos con la(s) siguiente(s) extension(es): "+this.objConfigArchPrioridad.vcExtensiones, "Error");
    this._input_archivo_prioridad.nativeElement.value="";
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

  subirArchivo(file: File) {
    // subirArchivo(file: File, nuTipo: number) {

    if (!this.validadNombreRepetido(file.name)) {
      if (this.lstArchivo.length < 12) {
        if (file.name.length < 103) {
          const formdata: FormData = new FormData();
          formdata.append('fileData', file);

          this._spinner.show();
          this.subirArchivoService.setFileWithPost$(formdata).subscribe(
            resp => {
              console.log('resp: ' + JSON.stringify(resp));

              let objArchivo: any = {};
              objArchivo = resp.objArchivo;
              objArchivo.nuIdTipoArchivo = 2;
              objArchivo.nuTamanio = (Number(objArchivo.nuLong) / 1024).toFixed(2) + " KB";
              this.lstArchivo.push(objArchivo);
              // console.log('lstArchivo: ' + JSON.stringify(this.lstArchivo));
              this._spinner.hide();
            },
            error => {
              this._spinner.hide();
              // this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
            }
          );
        } else {
          this._spinner.hide();
          // this.toast.showToast('Error', 'El nombre del archivo es demasiado largo.', 'error');
        }
      } else {
        this._spinner.hide();
        // this.toast.showToast('Error', 'Solo puede agregar 10 anexos como máximo.', 'error');
      }

    } else {
      this._spinner.hide();
      // this.toast.showToast('Error', 'Los archivos deben tener nombres diferentes.', 'error');
    }
  }

  validadNombreRepetido(vcNombreFile: string) {
    let blRepetido = false;
    for (let i = 0; i < this.lstArchivo.length; i++) {
      if (this.lstArchivo[i] != null) {
        if (this.lstArchivo[i].vcNomOriginal + '.' + this.lstArchivo[i].vcExtension == vcNombreFile) {
          blRepetido = true;
        }
      }
    }
    return blRepetido;
  }

  eliminarArchivoPrioridad(row: any) {
    this.lstArchivo.splice(row, 1);
  }

  /**/

  numeroTodos(): string {
    var rpta: string;
    if (this.nuFlagTodos === 1) {
      if (this.lstClases.length > 1) {
        let lstIdClases = this.lstClases.map((e) => e.nuIdClase);
        rpta = lstIdClases.join(', ');
        var index = rpta.lastIndexOf(',');
        rpta = "para las clases " + rpta.substr(0, index) + ' y ' + rpta.substr(index + 1);
      } else {
        rpta = "para la clase " + this.lstClases[0].nuIdClase;
      }
    } else {
      rpta = "para la clase " + this.agregarPrioridadForm.value.nuIdClase;
    }
    return rpta;
  }

  convertirFecha(date: any) {
    const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const mes = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const ano = date.getFullYear();
    return ano + '-' + mes + '-' + dia;
  }

}
