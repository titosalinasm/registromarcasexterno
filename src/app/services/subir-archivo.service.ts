
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { END_POINTS } from '../utils/end-points';
import { END_POINTS } from '../utils/endpoints';
import { DataService } from '../utils/data.service';
import { IResponse } from '../utils/response';
import { environment } from 'src/environments/environment';
// import { EnvService } from '../env.service';

@Injectable()
export class SubirArchivoService extends DataService<IResponse> {
    constructor(
        protected httpClient: HttpClient
    ) {
        super(httpClient, environment.apiURL.registroURL + END_POINTS.registro.subir_archivo);
    }
}
