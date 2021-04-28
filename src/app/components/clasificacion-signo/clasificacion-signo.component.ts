import {  Component, OnInit, TemplateRef, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/global.service';
import { TitulosNizaService } from 'src/app/services/titulos-niza.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { element } from 'protractor';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clasificacion-signo',
  templateUrl: './clasificacion-signo.component.html',
  styleUrls: ['./clasificacion-signo.component.css']
})
export class ClasificacionSignoComponent implements OnInit {

  @Output() propagar = new EventEmitter<any>();
  @Output() validEvent = new EventEmitter<any>();

  claseNizaForm = this.formBuilder.group({
    descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
  });
  vcNroClaseEditadaView : any='';

  @ViewChild('templateEditarClase') templateEditarClase: TemplateRef<any>;
  modalRef: BsModalRef;
  blcargarDatos: boolean = true;
  isInvalid: boolean = true;
  objConfiguracion: any = {};
  lstTitulosNiza: any;
  lstClasesNizaSearch: any[] = [];
  lstClasesNizaSearchFilter: any[] = [];
  lstClasesNizaSeleccionadas: any[] = [];
  lstClasesNizaSeleccionadasFilter: any[] = [];

  vcImporteClaseNizaPrincipal: string;
  vcImporteClaseNizaAdicional: string;
  nuSumCantClases: number = 0;


  rowEditado : number;

  //
  objResumenPago: any = {};
  valorClasePrincipal: number = 0;
  valorClaseAdicional: number = 0;
  sumaTotalClases: number = 0;

  nuIdTipoSolicitud : number;

  formClaseEditada = this.formBuilder.group({
    vcClaseEditada: ['', [Validators.required]],
  });



  constructor(
    private globalService: GlobalService,
    private _spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private titulosNizaService: TitulosNizaService,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    console.log('ClasificacionSignoComponent');

  }

  doEditarClase(item : any, row : any){
    console.log(JSON.stringify(item));
    this.rowEditado=row;
    this.vcNroClaseEditadaView=item.nuIdClase;
    this.formClaseEditada.controls.vcClaseEditada.setValue(item.vcProductosServicios);
    let objClass = { class: 'modal-lg' };
    this.openModal(this.templateEditarClase, objClass);
  }

  doGuardarEditado(){
    this.lstClasesNizaSeleccionadasFilter[this.rowEditado].vcProductosServicios=this.formClaseEditada.value.vcClaseEditada;

    console.log(JSON.stringify(this.lstClasesNizaSeleccionadasFilter));

    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>, objClass: any) {
    this.modalRef = this.modalService.show(template, objClass);
  }



  cargarDatos() {
    console.log('cargarDatos');
    this.nuIdTipoSolicitud=this.globalService.nuIdTipoSolicitud;
    if (this.blcargarDatos) {
      let filter = this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_ARANCEL));
      this.objConfiguracion = filter[0];
      console.log('configuracion: ' + JSON.stringify(this.objConfiguracion));
      this.cargarTitulosNiza();

      this.vcImporteClaseNizaPrincipal = 'S/ ' + (this.objConfiguracion.clValor1.lstAranceles.filter(e => e.nuId == 1)[0].nuCosto).toFixed(2);
      this.vcImporteClaseNizaAdicional = 'S/ ' + (this.objConfiguracion.clValor1.lstAranceles.filter(e => e.nuId == 2)[0].nuCosto).toFixed(2);

      this.blcargarDatos = false;
    }
  }

  cargarTitulosNiza() {
    // console.log('local data: ' + sessionStorage.getItem('access_token'));
    // if (!sessionStorage.getItem('access_token'))
    //   this.obtenerToken();
    // return; // Renovar token

    // console.log('cargarTitulosNiza');
    this._spinner.show();
    // this.spinner = true;
    // this.spinnerMsg = '';
    // this.spinnerMsg = 'La consulta puede tardar aprox. 60 segundos.';
    // this.sharedService.setIsSpinner(true);

    let params = {
      vcParaBusq: '',
    }
    this.titulosNizaService.getWithPost$(params).subscribe(
      resp => {
        this.lstTitulosNiza = resp.lstClase;
        this._spinner.hide();
      },
      error => {
        this._spinner.hide();
      },
    );
  }

  buscarDescripcionNiza() {
    this._spinner.show();
    let objClaseNiza = this.claseNizaForm.value;
    let params = {
      vcParaBusq: objClaseNiza.descripcion,
    }
    this.titulosNizaService.getWithPost$(params).subscribe(
      resp => {
        // console.log('data: ' + JSON.stringify(resp));
        this.lstClasesNizaSearch = resp.lstClase;
        if (this.lstClasesNizaSearch != null)
          this.lstClasesNizaSearchFilter = this.lstClasesNizaSearch.slice(0, 5);
        this._spinner.hide();
      },
      error => {
        this._spinner.hide();
      }
    );
  }

  agregarClaseNiza(itemClase: any, blShow: boolean) {
    if(this.globalService.nuIdTipoSolicitud!=1){
      console.log(JSON.stringify(this.lstClasesNizaSeleccionadas.length));
    if(this.lstClasesNizaSeleccionadas.length==0){
    if (!this.lstClasesNizaSeleccionadas.includes(itemClase)) {

      this.lstClasesNizaSeleccionadas.push(itemClase);
      this.lstClasesNizaSeleccionadas = this.lstClasesNizaSeleccionadas.sort((a, b) => a.nuIdClase - b.nuIdClase);
      console.log('lstClasesNizaSeleccionadas: ' + JSON.stringify(this.lstClasesNizaSeleccionadas));
      this.lstClasesNizaSeleccionadasFilter = this.lstClasesNizaSeleccionadas.slice(0, 5);

      if (blShow) {
        if (itemClase.vc_sugerencia != null)
          console.log('mostrar sugerencia');
      }
      this.calcularImportes();
      this.validarFormulario();
    } else {
      // console.log('la clase ya fue agregada');
      this.toastr.error('La clase ya fue agregada', 'Error');
    }
  }else{
    this.toastr.error('Solo puedes agregar 1 clase para tu tipo de solicitud', 'Error');
  }
  }else{
    if (!this.lstClasesNizaSeleccionadas.includes(itemClase)) {

      this.lstClasesNizaSeleccionadas.push(itemClase);
      this.lstClasesNizaSeleccionadas = this.lstClasesNizaSeleccionadas.sort((a, b) => a.nuIdClase - b.nuIdClase);
      console.log('lstClasesNizaSeleccionadas: ' + JSON.stringify(this.lstClasesNizaSeleccionadas));
      this.lstClasesNizaSeleccionadasFilter = this.lstClasesNizaSeleccionadas.slice(0, 5);

      if (blShow) {
        if (itemClase.vc_sugerencia != null)
          console.log('mostrar sugerencia');
      }
      this.calcularImportes();
      this.validarFormulario();
    } else {
      // console.log('la clase ya fue agregada');
      this.toastr.error('La clase ya fue agregada', 'Error');
    }
  }
  }

  validarFormulario() {
    if (this.lstClasesNizaSeleccionadas.length > 0) this.isInvalid = false;
    else this.isInvalid = true;
    this.validEvent.emit(this.isInvalid);
  }

  eliminarClaseNiza(itemClase: any) {
    this.lstClasesNizaSeleccionadas.forEach((element, index) => {
      if (element === itemClase) {
        this.lstClasesNizaSeleccionadas.splice(index, 1);
        this.lstClasesNizaSeleccionadasFilter = this.lstClasesNizaSeleccionadas.slice(0, 5);
        this.calcularImportes();
        this.validarFormulario();
      }
    });
  }

  calcularImportes() {
    this.objResumenPago = {};
    let arr = [...new Set(this.lstClasesNizaSeleccionadas.map(e => e.nuIdClase))];
    console.log('arr: ' + arr);
    this.nuSumCantClases = arr.length;
    let cantidad = arr.length;
    let objArancelPrincipal = this.objConfiguracion.clValor1.lstAranceles.filter(e => e.nuId == 1)[0];
    let objArancelAdicional = this.objConfiguracion.clValor1.lstAranceles.filter(e => e.nuId == 2)[0];
    if (cantidad > 1) {
      this.objResumenPago.valorClasePrincipal = objArancelPrincipal.nuCosto * 1;
      this.objResumenPago.valorClaseAdicional = objArancelAdicional.nuCosto * (cantidad - 1);
      this.objResumenPago.nuSumCantClases = cantidad;
      this.objResumenPago.sumaTotalClases = this.objResumenPago.valorClasePrincipal + this.objResumenPago.valorClaseAdicional;

    } else {
      this.objResumenPago.valorClasePrincipal = objArancelPrincipal.nuCosto * 1;
      this.objResumenPago.valorClaseAdicional = 0;
      this.objResumenPago.nuSumCantClases = cantidad;
      this.objResumenPago.sumaTotalClases = this.objResumenPago.valorClasePrincipal + this.objResumenPago.valorClaseAdicional;
    }
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.lstClasesNizaSearchFilter = this.lstClasesNizaSearch.slice(startItem, endItem);
  }

  pageChangedClaseNizaSeleccionadas(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.lstClasesNizaSeleccionadasFilter = this.lstClasesNizaSeleccionadas.slice(startItem, endItem);
  }

  atras() {
    console.log('navegacionAtras');
    this.propagar.emit(2);
  }

  siguiente() {

    if (this.isInvalid) return;

    console.log('siguiente');

    if(this.globalService.nuIdTipoSolicitud==3)
    this.propagar.emit(5);
    else
    this.propagar.emit(4);

    // let objClasificacion: any = {};
    let lstClases: any[] = [];
    this.lstClasesNizaSeleccionadas.forEach(function (v, i) {
      // console.log(i, v);
      let objClase: any = {};
      objClase.nuIdClase = v.nuIdClase;
      objClase.vcClase = v.vcProductosServicios;
      lstClases.push(objClase);
    });

    // objClasificacion.lstClases = lstClases;
    this.globalService.agregarClasificacionSigno(lstClases);
    this.globalService.agregarObjPago(this.objResumenPago);
    this.globalService.obtenerData();
  }

}
