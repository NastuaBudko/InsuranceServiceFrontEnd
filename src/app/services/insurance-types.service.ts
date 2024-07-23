import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { IType } from '../models/insurance-type.model';

@Injectable({
    providedIn: 'root'
})
export class InsuranceTypesService {

    private httpClient = inject(HttpClient)

getAllTypes() {
  const url = 'https://insurance-service-backend.onrender.com/insurance-types'
  return this.httpClient.get<IType[]>(url).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error)
      return throwError(() => new Error(error.error.message))
    }))

}
}