import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/global.service';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-asesoria-virtual',
  templateUrl: './asesoria-virtual.component.html',
  styleUrls: ['./asesoria-virtual.component.css']
})
export class AsesoriaVirtualComponent implements OnInit {

  @Output() propagar = new EventEmitter<any>();
  @Output() validEvent = new EventEmitter<any>();

  blcargarDatos: boolean = true;
  objConfiguracion: any = {};

  asesoriaForm = this.formBuilder.group({
    blAsesoria: ['',],
    txtNroAsesoria: [''],
  });

  regx : any=/^[a-zA-Z0-9._\/-]+$/


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    console.log('AsesoriaVirtualComponent');
    if (this.blcargarDatos) {
      this.cargarDatos();
    }
  }

  doValidacionCampoAsesoria(event: any) {
    let flag = false;

        let regx = /^[^<>*@#$&%+{}'°¬!/"()´.,;-_$]*$/;
        let result = regx.test(event.key);
        if (result) {
          flag = true;
        }

    return flag;
  }

  cargarDatos() {
    // console.log(this.globalService.lstConfiguracion && (Object.keys(this.globalService.lstConfiguracion).length === 0));
    let blData = this.globalService.lstConfiguracion && (Object.keys(this.globalService.lstConfiguracion).length === 0)
    if (!blData) {
      let filter = this.globalService.lstConfiguracion.filter(e => e.vcCodConfiguracion.includes(CONSTANTES.pages.COD_P_002));
      this.objConfiguracion = filter[0];
      this.bindEventsForm();

      this.blcargarDatos = false;
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  bindEventsForm() {
    let _txtNroAsesoria = this.asesoriaForm.get('txtNroAsesoria');
    _txtNroAsesoria.disable();

    this.asesoriaForm.valueChanges.subscribe(
      value => this.validEvent.emit(this.asesoriaForm.invalid)
    );

    this.asesoriaForm.get('blAsesoria').valueChanges.subscribe(value => {
      // let _txtNroAsesoria = this.asesoriaForm.get('txtNroAsesoria');
      if (value) {
        _txtNroAsesoria.enable();
        _txtNroAsesoria.setValidators([Validators.required]);
      } else {
        _txtNroAsesoria.disable();
      }

      _txtNroAsesoria.updateValueAndValidity();
    });
  }

  atras() {
    console.log('navegacionAtras');
    this.propagar.emit(0);
    this.router.navigate(['/inicio']);
  }

  siguiente() {

    if (this.asesoriaForm.invalid) return;

    this.propagar.emit(2);

    let objAsesoria: any = {};
    objAsesoria.nuFlagAsesoria = this.asesoriaForm.get('blAsesoria').value ? 1 : 0;
    objAsesoria.vcNroAsesoria = this.asesoriaForm.get('txtNroAsesoria').value;

    this.globalService.agregarAsesoria(objAsesoria);
    this.globalService.obtenerData();
  }

}
