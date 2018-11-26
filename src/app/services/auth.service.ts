import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

const apiUrl = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient, private router: Router) {}

    private token: string;
    private email: string;
    private isAuthenticated = false;
    private tokenTimer: any;
    private authStatusListener = new Subject<boolean>();

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};   
        this.http.post('http://localhost:3000/api/auth/signup', authData)
        .subscribe(response => {
            console.log(response);
            this.router.navigate(['/login']);
        }, error => {
            this.authStatusListener.next(false);
        }
        );
    }

    login(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};
        this.http.post<{ token: string, email: string, expiresIn: number }>(apiUrl + "/auth/login", authData)
        .subscribe(response => {
            const token = response.token;
            const email = response.email;
            this.token = token;
            this.email = email;
            if (token) {
                const expiresInDuration = response.expiresIn;
                this.setAuthDuration(expiresInDuration);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                this.saveAuthData(token, expirationDate);
                this.router.navigate(['/']);
            }
        }, error => {
            this.authStatusListener.next(false);
        });
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthDuration(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthDuration(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(tpken: string, expirationDate: Date) {
        localStorage.setItem('token', this.token);
        localStorage.setItem('email', this.email);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }
}
