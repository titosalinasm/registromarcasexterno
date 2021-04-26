import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/global.service';
import { TitulosNizaService } from 'src/app/services/titulos-niza.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { element } from 'protractor';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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

  //
  objResumenPago: any = {};
  valorClasePrincipal: number = 0;
  valorClaseAdicional: number = 0;
  sumaTotalClases: number = 0;

  constructor(
    private globalService: GlobalService,
    private _spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private titulosNizaService: TitulosNizaService,
  ) { }

  ngOnInit() {
    console.log('ClasificacionSignoComponent');

  }

  cargarDatos() {
    console.log('cargarDatos');
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
    // this.titulosNizaService.getWithPost$(param).subscribe(
    this.titulosNizaService.getWithPost$(params).subscribe(
      resp => {
        // this.selectsNiza = response;
        // console.log('data: ' + response);
        // this.lstTitulosNiza = resp.body;
        // console.log('data: ' + JSON.stringify(resp));
        this.lstTitulosNiza = resp.lstClase;
        // console.log(this.lstTitulosNiza.length);
        // this.spinner = false;
        this._spinner.hide();
        // this.spinnerMsg = '';
        // this.sharedService.setIsSpinner(false);
      },
      error => {
        // if (error.status === 401 || error.status === 403) {
        //   this.generalSerice.obtenerToken().then(value => {
        //     this.showToast('Advertencia', CONSTANTES.msg_error.no_autorizado, 'info');
        //     this.router.navigate(['/inicio']);
        //   });
        // }
        // console.log('error: ' + JSON.stringify(<any>error));
        // console.log('error: ' + error.message);
        // this.spinner = false;
        // this.spinnerMsg = '';
        this._spinner.hide();
        // this.spinnerMsg = 'La consulta puede tardar aprox. 60 segundos.';
        // this.sharedService.setIsSpinner(false);
        // this.showToast('Error', 'Hubo un error al intentar acceder a nuestros servicios: ' + error.message, 'danger');
        // this.showToast('Error', CONSTANTES.msg_error.msg, 'danger');
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
    // let rpta = true;
    if (!this.lstClasesNizaSeleccionadas.includes(itemClase)) {
      // console.log('itemClase: ' + JSON.stringify(itemClase));
      // let cont = 1;
      // this.lstClasesNizaSeleccionadas.forEach(e => {
      //   if (e.nuIdClase == itemClase.nuIdClase) {
      //     cont++;
      //   }
      // });
      // itemClase.cant = cont;
      this.lstClasesNizaSeleccionadas.push(itemClase);
      this.lstClasesNizaSeleccionadas = this.lstClasesNizaSeleccionadas.sort((a, b) => a.nuIdClase - b.nuIdClase);
      console.log('lstClasesNizaSeleccionadas: ' + JSON.stringify(this.lstClasesNizaSeleccionadas));
      this.lstClasesNizaSeleccionadasFilter = this.lstClasesNizaSeleccionadas.slice(0, 5);

      if (blShow) {
        if (itemClase.vc_sugerencia != null)
          // this.showToast('Sugerencia', 'Los usuarios que buscaron esta clase también buscaron: ' + itemClase.vc_sugerencia, 'warning');
          // this.showToast('Sugerencia:', itemClase.vc_sugerencia, 'info');
          console.log('mostrar sugerencia');
        // if (itemClase.vc_economica != null)
        //   this.showToast('Sugerencia económica: ', itemClase.vc_economica, 'warning');
      }
      this.calcularImportes();
      this.validarFormulario();
    } else {
      console.log('la clase ya fue agregada');
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
    // let cantidad = this.lstClasesNizaSeleccionadas.length;
    let objArancelPrincipal = this.objConfiguracion.clValor1.lstAranceles.filter(e => e.nuId == 1)[0];
    // console.log('objArancelPrincipal: ' + JSON.stringify(objArancelPrincipal));
    let objArancelAdicional = this.objConfiguracion.clValor1.lstAranceles.filter(e => e.nuId == 2)[0];
    if (cantidad > 1) {
      this.objResumenPago.valorClasePrincipal = objArancelPrincipal.nuCosto * 1;
      this.objResumenPago.valorClaseAdicional = objArancelAdicional.nuCosto * (cantidad - 1);
      this.objResumenPago.nuSumCantClases = cantidad;
      this.objResumenPago.sumaTotalClases = this.objResumenPago.valorClasePrincipal + this.objResumenPago.valorClaseAdicional;

      // this.valorClasePrincipal = objArancelPrincipal.nuCosto * 1;
      // this.valorClaseAdicional = objArancelAdicional.nuCosto * (cantidad - 1);
      // this.sumaTotalClases = this.valorClasePrincipal + this.valorClaseAdicional;
    } else {
      this.objResumenPago.valorClasePrincipal = objArancelPrincipal.nuCosto * 1;
      this.objResumenPago.valorClaseAdicional = 0;
      this.objResumenPago.nuSumCantClases = cantidad;
      this.objResumenPago.sumaTotalClases = this.objResumenPago.valorClasePrincipal + this.objResumenPago.valorClaseAdicional;

      // this.valorClasePrincipal = objArancelPrincipal.nuCosto * 1;
      // this.valorClaseAdicional = 0;
      // this.objResumenPago.cantidad = cantidad;
      // this.sumaTotalClases = this.valorClasePrincipal + this.valorClaseAdicional;
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
