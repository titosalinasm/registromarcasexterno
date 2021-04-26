import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { take, map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { GlobalService } from '../global.service';
import { SpinnerService } from './spinner.service';
@Injectable({
    providedIn: 'root'
})
export class DataConfigResolverService implements Resolve<Observable<any>>{

    constructor(private configuracionService: ConfiguracionService, private globalService: GlobalService, private spinnerService: SpinnerService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('DataConfigResolverService');
        this.spinnerService.show();
        let params = {
            vcCodConfiguracion: '',
        }
        return this.configuracionService.getWithPost$(params).pipe(
            take(1),
            // map(data => data)
            map(data => {
                if (data.nuError === 0) {
                    this.globalService.lstConfiguracion = data.lstConfiguracion;
                } else {
                    console.log('Error toast');
                }
                this.spinnerService.hide();
                // console.log('DataConfigResolverService: ' + JSON.stringify(data));
            })
        );
    }
}