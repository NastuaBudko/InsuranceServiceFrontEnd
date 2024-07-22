import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { IInsurance, IInsuranceForServer } from '../models/insurance.model';

@Injectable({
  providedIn: 'root'
})
export class InsurancesService {

  private httpClient = inject(HttpClient)

  loadInsurances() {
    return this.fetchInsurances(
      'http://localhost:5555/insurances',
      'Something went wrong loading insurances. Please try again later'
    )
  }

  fetchInsurances(url: string, errorMessage: string) {
    return this.httpClient.get<IInsuranceForServer[]>(url)
      .pipe(
        catchError((error) => {
          console.log(error)
          return throwError(() => new Error(errorMessage))
        }))
  }

  addInsurance(insuranceData: IInsurance) {
    const url = 'http://localhost:5555/insurances';
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. User is not authenticated.');
      return throwError(() => new Error('User not authenticated.'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const dataToSend = {
      ...insuranceData,
      branch: insuranceData.branch._id,
      insuranceType: insuranceData.insuranceType._id
    };
    console.log(insuranceData)
    return this.httpClient.post<IInsurance>(url, dataToSend, { headers }).pipe(
      catchError((error: Error) => {
        return throwError(() => new Error('Unable to create a new insurance'))
      })
    );
  }


  removeInsurance(insurance: IInsuranceForServer) {
    const url = `http://localhost:5555/insurances/${insurance._id}`;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User is not authenticated.');
      return throwError(() => new Error('User not authenticated.'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.delete(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error(error.error.message))
      })
    );
  }

  getInsurance(id: string) {
    const url = `http://localhost:5555/insurances/${id}`;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User is not authenticated.');
      return throwError(() => new Error('User not authenticated.'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<IInsuranceForServer>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error(error.error.message))
      })
    );
  }

}

