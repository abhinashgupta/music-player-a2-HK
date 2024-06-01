import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;

  constructor(private router: Router) {}

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getToken() {
    return this.accessToken;
  }

  isTokenExpired(): boolean {
    if (!this.accessToken) {
      return true;
    }

    const tokenPayload = JSON.parse(atob(this.accessToken.split('.')[1]));
    const expirationTime = tokenPayload.exp * 1000; 
    const currentTime = Date.now();
    return currentTime > expirationTime;
  }

  alertIfTokenExpired() {
    if (this.isTokenExpired()) {
      alert('Your session has expired. Please take the token from console.');
    }
  }
}
