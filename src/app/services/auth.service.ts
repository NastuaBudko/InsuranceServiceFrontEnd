import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../models/user.model';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient)
  public loggedIn = signal(false);
  private router = inject(Router)

  get AuthToken(): string | null {
    return localStorage.getItem('token');
  }

  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  clearAuthToken(): void {
    localStorage.removeItem('token');
  }

  register(userData: IUser) {
    const url = 'https://insurance-service-backend.onrender.com/auth/register'
    return this.httpClient.post(url, userData).pipe(
      tap((data: any) => {
        this.setAuthToken(data.token);
        this.loggedIn.set(true);
      }),
      catchError((error: Error) => {
        console.log(error)
        return throwError(() => new Error('Unable to register'))
      })
    )
  }

  login(data: { email: string, password: string }) {
    const url = 'https://insurance-service-backend.onrender.com/auth/login'
    return this.httpClient.post(url, data).pipe(
      tap((data: any) => {
        this.setAuthToken(data.token);
        this.loggedIn.set(true);
      }), 
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error.message))
      })
      
    )
  }

  getMe() {
    const token = localStorage.getItem('token')
    const url = 'https://insurance-service-backend.onrender.com/auth/me'

    if (!token) {
      console.error('No token found. User is not authenticated.');
      throw new Error('User not authenticated.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<IUser>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        return throwError(() => new Error(error.error.message))
      })
    )
  }

  logout() {
    this.clearAuthToken();
    this.loggedIn.set(false);
    this.router.navigate(['/']);
  }

  get loginStatus() {
    return this.loggedIn
  }
}
