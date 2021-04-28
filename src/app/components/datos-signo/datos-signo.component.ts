import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubirArchivoService } from 'src/app/services/subir-archivo.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidaExpedienteService } from 'src/app/services/valida-expediente.service';
import { ValidaCertificadoService } from 'src/app/services/valida-certificado.service';
import { copyFileSync } from 'node:fs';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DataConfigResolverService } from 'src/app/services/data-config-resolve.service';
@Component({
  selector: 'app-datos-signo',
  templateUrl: './datos-signo.component.html',
  styleUrls: ['./datos-signo.component.css']
})
export class DatosSignoComponent implements OnInit {

  @Output() propagar = new EventEmitter<any>();
  @Output() validEvent = new EventEmitter<any>();

  @ViewChild('input_archivo_dato_signo') _input_archivo_dato_signo: ElementRef;

  blcargarDatos: boolean = true;
  isInvalid: boolean = true;
  blShowMasSolicitud: boolean = false;
  lblMasSolicitud: string = 'ver más';
  blShowMasTipoSigno: boolean = false;
  lblMasTipoSigno: string = 'ver más';

  objConfiguracion: any = {};
  objArchivo: any = {};

  lstTipoSolicitud: any[];
  lstTipoSigno: any[] = [];

  nuIdTipoSolicitud: number;
  nuIdTipoSigno: number;
  objTipoSignoSeleccionado: any = {};

  // variables
  lstArchivo = [];
  lstArchivoDocumentos : any[];

  objConfigArchSigno : any;
  objConfigRequisitos: any;


  imgURL: any;

  btnValidExpediente : boolean=false;
  btnValidCertificado : boolean=false;

  btnValidoExpediente : boolean=false;
  btnValidoCertificado : boolean=false;


  lblValidExpediente : boolean=false;
  lblValidCertificado : boolean=false;

  vcDocPrimerUso : string;
  vcDocReglamento : string;
  vcDocEstatuto : string;
  vcDocLista : string;

  blReqCerLema : boolean= false;
  blReqNroExpeLema : boolean= false;
  blReqNroClaseLema : boolean= false;
  blReqNroExpeNombComercial : boolean= false;
  blReqFechaNombreComercial: boolean= false;


  datosSignoForm = this.formBuilder.group({
    blInteresReal: ['', ],
    vcNroExpediente: ['',],
    blDerechoPreferente: ['',],
    vcNroCertificado: ['',],
    vcDenominacion: ['',],
    blReinvindicaColor: ['',],

    vcCertificadoLema: ['P00299285',],
    vcNroExpedienteLema: ['874892-2021',],
    nuClaseLema: ['',],
    vcNroExpedienteNombreComercial:['',],
    vcFechaPrimerUsoNombreComercial: ['',],
  });

  minDate: Date;
  maxDate: Date;

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private _spinner: NgxSpinnerService,
    private subirArchivoService: SubirArchivoService,
    private toastr: ToastrService,
    private _validaExpedienteService: ValidaExpedienteService,
    private _validaCertificadoService : ValidaCertificadoService,
    private localeService: BsLocaleService,
  ) {
    this.localeService.use('es');
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 61);
    this.maxDate.setDate(this.maxDate.getDate()-1);
   }

  ngOnInit() {
    console.log('DatosSignoComponent');
    // this.cargarDatos();
    // this.bindEventsForm();
  }

  doEliminarDocRequisiro(nuTipoArchivo){
    switch(nuTipoArchivo){
      case 5:
      this.vcDocPrimerUso= null;
      break;
      case 6:
        this.vcDocReglamento= null;
      break;
      case 7:
        this.vcDocEstatuto= null;
      break;
      case 8:
        this.vcDocLista= null;
      break;
      default:
      break;
  }
    console.log("ANTES : "+JSON.stringify(this.lstArchivoDocumentos));
    this.lstArchivoDocumentos=this.lstArchivoDocumentos.filter(e => e.nuIdTipoArchivo!=nuTipoArchivo);
  console.log("DESPUES: "+JSON.stringify(this.lstArchivoDocumentos));
  }


  doEliminarExpediente(){
    this.btnValidoExpediente=false;
    this.datosSignoForm.get('vcNroExpediente').setValue('');
    this.validarFormulario();
  }

  doValidarExpediente(){
    this._spinner.show();
    let param={
      vcParametro:this.datosSignoForm.value.vcNroExpediente
    }
    this._validaExpedienteService.getWithPost$(param).subscribe(
      resp=>{
        this._spinner.hide();
        if(resp.nuValor>0)
        this.btnValidoExpediente=true;
        else
        this.toastr.error('Número de expediente inválido', 'Error');

        this.validarFormulario();

        // console.log(JSON.stringify(resp))
      },
      error=>{
        this._spinner.hide();
        this.validarFormulario();
      }
    );
  }
  doEliminarNroExpedienteNombreComercial(){
    this.blReqNroExpeNombComercial=false;
    this.datosSignoForm.get('vcNroExpedienteNombreComercial').setValue('');
    this.validarFormulario();
    }

  doValidarExpedienteNombreComercial(){
    this._spinner.show();
    let param={
      vcParametro:this.datosSignoForm.value.vcNroExpedienteNombreComercial
    }
    this._validaExpedienteService.getWithPost$(param).subscribe(
      resp=>{
        this._spinner.hide();
        if(resp.nuValor>0)
        this.blReqNroExpeNombComercial=true;
        else
        this.toastr.error('Número de expediente inválido', 'Error');

        this.validarFormulario();

        // console.log(JSON.stringify(resp))
      },
      error=>{
        this._spinner.hide();
        this.validarFormulario();
      }
    );
  }

  doEliminarNroExpedienteLema(){
    this.blReqNroExpeLema=false;
    this.datosSignoForm.get('vcNroExpedienteNombreComercial').setValue('');
    this.validarFormulario();
    }

  doValidarExpedienteLema(){
    this._spinner.show();
    let param={
      vcParametro:this.datosSignoForm.value.vcNroExpedienteLema
    }
    this._validaExpedienteService.getWithPost$(param).subscribe(
      resp=>{
        this._spinner.hide();
        if(resp.nuValor>0)
        this.blReqNroExpeLema=true;
        else
        this.toastr.error('Número de expediente inválido', 'Error');

        this.validarFormulario();

        // console.log(JSON.stringify(resp))
      },
      error=>{
        this._spinner.hide();
        this.validarFormulario();
      }
    );
  }

  doEliminarCertificadoLema(){
  this.blReqCerLema=false;
  this.datosSignoForm.get('vcCertificadoLema').setValue('');
  this.validarFormulario();
  }
  doValidarCertificadoLema(){
    this._spinner.show();
    let param={
      vcParametro:this.datosSignoForm.value.vcCertificadoLema
    }
    console.log(JSON.stringify(param));
    this._validaCertificadoService.getWithPost$(param).subscribe(
      resp=>{
        this._spinner.hide();
        if(resp.nuValor>0)
        this.blReqCerLema=true;
        else
        this.toastr.error('Número de certificado inválido', 'Error');

        this.validarFormulario();

        // console.log(JSON.stringify(resp))
      },
      error=>{
        this._spinner.hide();
        this.validarFormulario();
      }
    );
  }
  doEliminarCertificado(){
    this.btnValidoCertificado=false;
    this.datosSignoForm.controls.vcNroCertificado.setValue('');
    this.validarFormulario();
  }
  doValidarCertificado(){
    this._spinner.show();
    let param={
      vcParametro:this.datosSignoForm.value.vcNroCertificado
    }
    this._validaCertificadoService.getWithPost$(param).subscribe(
      resp=>{
        this._spinner.hide();
        if(resp.nuValor>0)
        this.btnValidoCertificado=true;
        else
        this.toastr.error('Número de certificado inválido', 'Error');

        this.validarFormulario();

        // console.log(JSON.stringify(resp))
      },
      error=>{
        this._spinner.hide();

        this.validarFormulario();
      }
    );
  }

  cargarDatos() {
    console.log('cargarDatos');
    this.bindEventsForm();
    this.validarFormulario();
    if (this.blcargarDatos) {
      let filter = this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_P_003));
      this.objConfiguracion = filter[0];
      this.objConfigArchSigno=this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_CONF_ARCHIVO))[0].clValor1.objConfigArchSigno;
      this.objConfigRequisitos=this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_CONF_ARCHIVO))[0].clValor1.objConfigRequisitos;

      // console.log("configuracion: archivos: "+JSON.stringify(this.objConfigArchSigno))
      // let arrarExtensiones=this.objConfigArchSigno.vcExtensiones.split("/");
      // console.log("Cantidad de extensiones: "+arrarExtensiones.length);



      this.lstTipoSolicitud = this.globalService.listaGeneral.lstTipoSolicitud;
      this.seleccionarTipoSolicitudByRow(0);

      this.blcargarDatos = false;
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



  bindEventsForm() {
    this.datosSignoForm.controls.vcNroExpediente.disable();
    this.datosSignoForm.controls.vcNroCertificado.disable();
    // this.validEvent.emit(this.blInValidForm);
    this.datosSignoForm.valueChanges.subscribe(
      value => {
        this.validarFormulario();
        // this.validEvent.emit(this.isInvalid);
        console.log("hay Cambios"+this.isInvalid)
      }
    );
  }




  toggleVerMasSolicitud() {
    this.blShowMasSolicitud = !this.blShowMasSolicitud;
    this.lblMasSolicitud = 'ver más';
    this.lblMasSolicitud = this.blShowMasSolicitud ? 'ver menos' : 'ver más';
  }

  toggleVerMasTipoSigno() {
    this.blShowMasTipoSigno = !this.blShowMasTipoSigno;
    this.lblMasTipoSigno = 'ver más';
    this.lblMasTipoSigno = this.blShowMasTipoSigno ? 'ver menos' : 'ver más';
  }

  seleccionarTipoSolicitudByRow(index: number) {
    let item = this.lstTipoSolicitud[index];
    console.log('item 0: ' + item);
    this.seleccionarTipoSolicitud(item);

  }

  seleccionarTipoSolicitud(item: any) {
    console.log('seleccionarTipoSolicitud: ' + JSON.stringify(item));
    this.lstTipoSigno = this.globalService.listaGeneral.lstTipoPresentacion.filter(e => e.nuIdTipoSolicitud === item.nuIdTipoSolicitud);

    this.lstTipoSolicitud.forEach((element, index, data) => {
      element.blSeleccionado = false;
    });
    // TODO: por defecto seleccionar la primera opción
    item.blSeleccionado = !item.blSeleccionado;

    this.nuIdTipoSolicitud = item.nuIdTipoSolicitud;

    this.vcDocPrimerUso=null;
    this.vcDocReglamento=null;
    this.vcDocEstatuto=null;
    this.vcDocLista =null;
    this.lstArchivoDocumentos=[];
    this.datosSignoForm.controls.blInteresReal.setValue(false);
    this.datosSignoForm.controls.blDerechoPreferente.setValue(false);
    this.btnValidCertificado=false;
    this.lblValidCertificado=false;
    this.btnValidExpediente=false;
    this.lblValidExpediente=false;

    this.blReqCerLema=false;
    this.blReqNroExpeLema=false;
    this.datosSignoForm.controls.nuClaseLema.setValue(null);
    this.datosSignoForm.controls.vcFechaPrimerUsoNombreComercial.setValue(null);
    this.blReqNroExpeNombComercial=false;

    this.datosSignoForm.controls.vcCertificadoLema.setValue(null);
    this.datosSignoForm.controls.vcNroExpedienteLema.setValue(null);
    this.datosSignoForm.controls.vcDenominacion.setValue(null);


    this.bindEventsForm();

    this.seleccionarTipoSignoByRow(0);
  }

  seleccionarTipoSignoByRow(index: number) {
    let item = this.lstTipoSigno[index];
    console.log('item 0: ' + item);
    this.seleccionarTipoSigno(item);

  }

  seleccionarTipoSigno(item: any) {
    console.log("seleccionarTipoSigno");

    this.objTipoSignoSeleccionado = item;
    console.log('this.objTipoSignoSeleccionado: ' + JSON.stringify(this.objTipoSignoSeleccionado));
    this.lstTipoSigno.forEach((element, index, data) => {
      element.blSeleccionado = false;
    });
    // TODO: por defecto seleccionar la primera opción
    item.blSeleccionado = !item.blSeleccionado;
    this.nuIdTipoSigno = item.nuIdTipoPresentacion;

    this.validarFormulario();
  }

  showItem(row: number, flag: number) {
    let condition = flag == 1 ? !this.blShowMasSolicitud : !this.blShowMasTipoSigno;
    if (condition) {
      if (row <= 2) return true;
      return false;
    } else return true;
  }

  cargarArchivoDatoRequisito(event : any, nuTipoArchivo){
    // console.log(event.target.files);
    if (event.target.files.length > 0) {
      // this.spinner = true;
      Array.from(event.target.files).forEach((file: any) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
              // this.previsualizarImagen(file);
              this.agregaDocumentoRequisito(reader.result, file, nuTipoArchivo);

        }
      });
    }
    event.target.value = '';
  }




  agregaDocumentoRequisito(data: any, file : any, nuTipoArchivo: any) {
    console.log('agregaDocumentoRequisito');
    let regex = /(?:\.([^.]+))?$/;
    let extension: any = "."+(regex.exec(file.name)[1]).toLowerCase();

    console.log('extension: '+extension);

    if(this.validaExtension(this.objConfigRequisitos.vcExtensiones.split(", "), extension)){
      if(file.size> 0 && file.size<=this.objConfigRequisitos.nuTamanio){
        if(file.name.length<101){
    // this._input_archivo_dato_signo.nativeElement.value="";

    let objArchivo : any ={
      vcFileBase64: data,
      vcNomOriginal : file.name,
      nuLong : file.size,
      nuIdTipoArchivo: nuTipoArchivo,
    }

    switch(nuTipoArchivo){
        case 5:
        this.vcDocPrimerUso= file.name;
        break;
        case 6:
          this.vcDocReglamento= file.name;
        break;
        case 7:
          this.vcDocEstatuto= file.name;
        break;
        case 8:
          this.vcDocLista= file.name;
        break;
        default:
        break;
    }

    this.lstArchivoDocumentos.push(objArchivo);
  }else{
    this.toastr.error("El nombre es demasiado largo, el nombre de su archivo debe contener máximo 100 caracteres.", "Error");
    this._input_archivo_dato_signo.nativeElement.value="";
  }
  }else{
    this.toastr.error("El tamaño máximo del archivo debe ser "+this.objConfigArchSigno.nuTamanio+" Bytes", "Error");
    this._input_archivo_dato_signo.nativeElement.value="";
  }
  }else{
    this.toastr.error("Solo puede agregar archivos con la(s) siguiente(s) extension(es): "+this.objConfigArchSigno.vcExtensiones, "Error");
    this._input_archivo_dato_signo.nativeElement.value="";
  }

    this.validarFormulario();

  }

  cargarArchivoDatoSigno(event : any){
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

    if(this.validaExtension(this.objConfigArchSigno.vcExtensiones.split(", "), extension)){
      if(file.size> 0 && file.size<=this.objConfigArchSigno.nuTamanio){
        if(file.name.length<101){
    this._input_archivo_dato_signo.nativeElement.value="";

    let objArchivo : any ={
      vcFileBase64: data,
      vcNomOriginal : file.name,
      nuLong : file.size,
      nuIdTipoArchivo: 1,
    }

    this.lstArchivo.push(objArchivo);
  }else{
    this.toastr.error("El nombre es demasiado largo, el nombre de su archivo debe contener máximo 100 caracteres.", "Error");
    this._input_archivo_dato_signo.nativeElement.value="";
  }
  }else{
    this.toastr.error("El tamaño máximo del archivo debe ser "+this.objConfigArchSigno.nuTamanio+" Bytes", "Error");
    this._input_archivo_dato_signo.nativeElement.value="";
  }
  }else{
    this.toastr.error("Solo puede agregar archivos con la(s) siguiente(s) extension(es): "+this.objConfigArchSigno.vcExtensiones, "Error");
    this._input_archivo_dato_signo.nativeElement.value="";
  }

    this.validarFormulario();

  }



  previsualizarImagen(file: any): any {
    if (file.length === 0)
      return;

    var reader = new FileReader();
    var imgUrl: any;
    // this.imagePath = files;
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      // imgUrl = reader.result;
      this.objArchivo.objFile = reader.result;
      this.imgURL = reader.result;
    }
  }

  eliminarImagen(row: any) {
    this.lstArchivo.splice(row, 1);
    this.validarFormulario();
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

  valueChangeNroExpediente(){
    if(this.datosSignoForm.controls.blDerechoPreferente.value){
      this.datosSignoForm.controls.vcNroCertificado.disable();
      this.btnValidCertificado=false;
      this.lblValidCertificado=false;
    }else{
      this.datosSignoForm.controls.vcNroCertificado.enable();
      this.btnValidCertificado=true;
    }
    this.btnValidoCertificado=false;
    this.datosSignoForm.get("vcNroCertificado").setValue('');
    this.validarFormulario();
  }

  valueChangeInteresReal(){

    if(this.datosSignoForm.controls.blInteresReal.value){
      this.datosSignoForm.controls.vcNroExpediente.disable();
      this.btnValidExpediente=false;
      this.lblValidExpediente=false;

    }else{

      this.datosSignoForm.controls.vcNroExpediente.enable();
      this.btnValidExpediente=true;
    }
    this.btnValidoExpediente=false;
    this.datosSignoForm.get("vcNroExpediente").setValue('');
    this.validarFormulario();
  }

  doValidaSubP11(){
    console.log(this.datosSignoForm.value.vcDenominacion)
    if(this.datosSignoForm.value.vcDenominacion==null || this.datosSignoForm.value.vcDenominacion==''){
      this.isInvalid=true;

    }else{
      // this.isInvalid=false;
      this.validasolicitud();

      if(this.datosSignoForm.value.blInteresReal){
        if(this.btnValidoExpediente){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }

      if(this.datosSignoForm.value.blDerechoPreferente){
        if(this.btnValidoCertificado){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }
    }
  }

  doValidaSubP12(){
    if(this.lstArchivo.length<1){
      this.isInvalid=true;
    }else{
      // this.isInvalid=false;
      this.validasolicitud();

      if(this.datosSignoForm.value.blInteresReal){
        if(this.btnValidoExpediente){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }

      if(this.datosSignoForm.value.blDerechoPreferente){
        if(this.btnValidoCertificado){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }
    }
  }

  doValidaSubP13(){
    if(this.lstArchivo.length<1  || this.datosSignoForm.value.vcDenominacion==null || this.datosSignoForm.value.vcDenominacion==''){
      this.isInvalid=true;
    }else{
      // this.isInvalid=false;
      this.validasolicitud();

      if(this.datosSignoForm.value.blInteresReal){
        if(this.btnValidoExpediente){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }

      if(this.datosSignoForm.value.blDerechoPreferente){
        if(this.btnValidoCertificado){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }
    }
  }

  doValidaP1(){
    switch(this.objTipoSignoSeleccionado.nuIdTipoPresentacion){
      case 1:
      this.doValidaSubP11();
      break;
      case 2:
      this.doValidaSubP12();
      break;
      case 3:
      this.doValidaSubP13();
      break;
      case 4:
      this.doValidaSubP13();
      break;
      case 5:
      this.doValidaSubP13();
      break;
      case 6:
      this.doValidaSubP13();
      break;
      case 7:
      this.doValidaSubP13();
      break;
      case 8:
      this.doValidaSubP13();
      break;
      case 9:
      this.doValidaSubP13();
      break;
      case 10:
      this.doValidaSubP13();
      break;
      default:

      break;
    }
  }

    doValidaP2(){
    switch(this.objTipoSignoSeleccionado.nuIdTipoPresentacion){
      case 1:
      this.doValidaSubP21();
      break;
      case 2:
      break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        break;
      case 9:
        break;
      case 10:
      break;
      default:

      break;
    }
  }

  doValidaSubP21(){
    // console.log(this.datosSignoForm.value.vcDenominacion)
    if(this.datosSignoForm.value.vcDenominacion==null || this.datosSignoForm.value.vcDenominacion==''){
      this.isInvalid=true;

    }else{
      // this.isInvalid=false;
      this.validasolicitud();

      if(this.blReqCerLema && this.blReqNroExpeLema){
        this.isInvalid=false;
      }else{
      this.isInvalid=true;
      }


      if(this.datosSignoForm.value.blInteresReal){
        if(this.btnValidoExpediente){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }

      if(this.datosSignoForm.value.blDerechoPreferente){
        if(this.btnValidoCertificado){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }
    }
  }

  doValidaP3(){
    switch(this.objTipoSignoSeleccionado.nuIdTipoPresentacion){
      case 1:
      this.doValidaSubP31();
      break;
      case 2:
      this.doValidaSubP32();
      break;
      case 3:
      this.doValidaSubP33();
        break;
      case 4:
        this.doValidaSubP33();
        break;
      case 5:
        this.doValidaSubP33();
        break;
      case 6:
        this.doValidaSubP33();
        break;
      case 7:
        this.doValidaSubP33();
        break;
      case 8:
        this.doValidaSubP33();
        break;
      case 9:
        this.doValidaSubP33();
        break;
      case 10:
        this.doValidaSubP33();
      break;
      default:

      break;
    }
  }

  doValidaSubP31(){
    // console.log(this.datosSignoForm.value.vcDenominacion)
    if(this.datosSignoForm.value.vcDenominacion==null || this.datosSignoForm.value.vcDenominacion=='' || this.datosSignoForm.value.vcFechaPrimerUsoNombreComercial==null){
      this.isInvalid=true;

    }else{
      // this.isInvalid=false;
      this.validasolicitud();

      if(this.datosSignoForm.value.blInteresReal){
        if(this.btnValidoExpediente){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }

      if(this.datosSignoForm.value.blDerechoPreferente){
        if(this.btnValidoCertificado){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }
    }
  }

  doValidaSubP32(){
    if(this.lstArchivo.length<1 || this.datosSignoForm.value.vcFechaPrimerUsoNombreComercial==null){
      this.isInvalid=true;
    }else{
      // this.isInvalid=false;
      this.validasolicitud();

      if(this.datosSignoForm.value.blInteresReal){
        if(this.btnValidoExpediente){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }

      if(this.datosSignoForm.value.blDerechoPreferente){
        if(this.btnValidoCertificado){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }
    }
  }

  doValidaSubP33(){
    if(this.lstArchivo.length<1  || this.datosSignoForm.value.vcDenominacion==null || this.datosSignoForm.value.vcDenominacion=='' || this.datosSignoForm.value.vcFechaPrimerUsoNombreComercial==null){
      this.isInvalid=true;
    }else{
      // this.isInvalid=false;
      this.validasolicitud();

      if(this.datosSignoForm.value.blInteresReal){
        if(this.btnValidoExpediente){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }

      if(this.datosSignoForm.value.blDerechoPreferente){
        if(this.btnValidoCertificado){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }
    }
  }

  validarFormulario() {
    console.log("validarFormulario");

    this.isInvalid=true;

    switch(this.nuIdTipoSolicitud){
      case 1:
      this.doValidaP1();
      break;
      case 2:
      this.doValidaP2();
      break;
      case 3:
      this.doValidaP3();
      break;
      case 4:
      this.doValidaP1();
      break;
      case 5:
      this.doValidaP1();
      break;
      default:

      break;
    }

    this.validEvent.emit(this.isInvalid);
  }

  validasolicitud(){
    if(this.datosSignoForm.get("blInteresReal").value){
      if(this.datosSignoForm.get("vcNroExpediente").value!=''){
        if(this.datosSignoForm.get("blDerechoPreferente").value){
          if(this.datosSignoForm.get("vcNroCertificado").value!=''){
            this.isInvalid=false;
          }else{
            this.isInvalid=true;
          }
        }else{
          if(this.datosSignoForm.get("blDerechoPreferente").value){
            if(this.datosSignoForm.get("vcNroCertificado").value!=''){
              this.isInvalid=false;
            }else{
              this.isInvalid=true;
            }
          }else{
            this.isInvalid=false;
          }
        }
      }else{
        this.isInvalid=true;
      }
    }else{
      if(this.datosSignoForm.get("blDerechoPreferente").value){
        if(this.datosSignoForm.get("vcNroCertificado").value!=''){
          this.isInvalid=false;
        }else{
          this.isInvalid=true;
        }
      }else{
        this.isInvalid=false;
      }
    }
  }
  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  doValidaLetrasNumeros(event: any) {
    let flag = false;
    if (/^[^<>*#$&%+{}'°¬!/"()´.,;-_$]*$/.test(event.key)) {
      flag = true;
    }
    return flag;

  }

  numeroClase(){
    let objForm = this.datosSignoForm.value;
   if (!(objForm.nuClaseLema>0 && objForm.nuClaseLema<=45)){
    this.datosSignoForm.controls.nuClaseLema.setValue(objForm.nuClaseLema.substring(0, objForm.nuClaseLema.length-1));
   }
  }




  atras() {
    console.log('navegacionAtras');
    this.propagar.emit(1);
  }

  siguiente() {

    if (this.isInvalid) return;

    if(this.nuIdTipoSolicitud==2){
    this.propagar.emit(5);
    }else{
      this.propagar.emit(3);
    }
    for(let i=0; i<this.lstArchivoDocumentos.length; i++){
    this.lstArchivo.push(this.lstArchivoDocumentos[i]);
    }


    let objDatosSigno: any = {};
    objDatosSigno.vcCertificadoLema=this.blReqCerLema?this.datosSignoForm.get('vcCertificadoLema').value:'';
    objDatosSigno.vcNroExpedienteLema=this.blReqNroExpeLema?this.datosSignoForm.get('vcNroExpedienteLema').value:'';
    objDatosSigno.nuClaseLema=this.nuIdTipoSolicitud==2?this.datosSignoForm.get('nuClaseLema').value:null;
    objDatosSigno.vcNroExpedienteNombreComercial=this.blReqNroExpeNombComercial?this.datosSignoForm.get('vcNroExpedienteNombreComercial').value:'';
    objDatosSigno.vcFechaPrimerUsoNombreComercial=this.nuIdTipoSolicitud==3?this.convertirFecha(this.datosSignoForm.get('vcFechaPrimerUsoNombreComercial').value):'';

    objDatosSigno.nuIdTipoSolicitud = this.nuIdTipoSolicitud;
    objDatosSigno.nuFlagInteresReal = this.datosSignoForm.get('blInteresReal').value ? 1 : 0;
    objDatosSigno.vcNroExpediente = this.datosSignoForm.get('vcNroExpediente').value;
    objDatosSigno.nuFlaDerechoPreferente = this.datosSignoForm.get('blDerechoPreferente').value ? 1 : 0;
    objDatosSigno.vcNroCertificado = this.datosSignoForm.get('vcNroCertificado').value;
    objDatosSigno.nuIdTipoSigno = this.nuIdTipoSigno;
    objDatosSigno.lstArchivosSigno = this.lstArchivo;
    objDatosSigno.vcDenominacion = this.datosSignoForm.get('vcDenominacion').value;
    objDatosSigno.nuFlagReinvindicaCol = this.datosSignoForm.get('blReinvindicaColor').value ? 1 : 0;
    // objDatosSigno.nuFlagReinvindicaCol = 1;

    console.log("objDatosSigno=> "+JSON.stringify(objDatosSigno))

    this.globalService.agregarDatosSigno(objDatosSigno);
    this.globalService.obtenerData();

    this.globalService.nuIdTipoSolicitud=this.nuIdTipoSolicitud;


  }


  convertirFecha(date: any) {
    const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const mes = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const ano = date.getFullYear();
    return ano + '-' + mes + '-' + dia;
  }

  editarCard(op: number) {
    this.propagar.emit(op);
  }

}
