import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { ExpeditedRegistrationGQL, LoginGQL, MeGQL, RegisterGQL, ResetPasswordGQL, SendPasswordResetEmailGQL, User } from 'src/graphql/graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  isLoggedIn$: Subject<boolean> = new Subject();
  token: any;

  constructor(
    private storage: Storage,
    private loginService: LoginGQL,
    private registerService: RegisterGQL,
    private sendPasswordResetEmailService: SendPasswordResetEmailGQL,
    private resetPasswordService: ResetPasswordGQL,
    private meService: MeGQL,
    private expeditedRegistrationService: ExpeditedRegistrationGQL,
    private logger: NGXLogger
  ) { }

  private setIsLoggedIn(value: boolean) {
    this.isLoggedIn = value;
    this.isLoggedIn$.next(value);
  }

  async login(email: string, password: string): Promise<boolean> {
    const result = await this.loginService.mutate({
      email,
      password
    }).toPromise();

    this.logger.log(result);
    this.token = result.data.login;

    if (this.token) {
      this.logger.log('Login successful.');
      await this.storage.set('token', this.token);
      this.setIsLoggedIn(true);
    } else {
      this.logger.log('Login failure');
    }

    return this.token;
  }

  async logout() {
    await this.storage.remove('token');
    this.setIsLoggedIn(false);
    delete this.token;
  }

  async expeditedRegistration() {
    const result = await this.expeditedRegistrationService.mutate().toPromise();
    this.token = result.data.expeditedRegistration.jwt;
    if (this.token) {
      this.logger.log('Login successful.');
      await this.storage.set('token', this.token);
      this.setIsLoggedIn(true);
    } else {
      this.logger.log('Login failure');
    }
    return result.data.expeditedRegistration;
  }

  async register(
    firstName: string, 
    lastName: string, 
    birthdate: string, 
    email: string, 
    password: string,
    phoneNumber: string,
  ): Promise<boolean> {
    const result = await this.registerService.mutate({
      firstName,
      lastName,
      birthdate,
      email,
      password,
      phoneNumber
    }).toPromise();

    this.logger.log(result);
    this.token = result.data.register;
    return this.token;
  }

  async sendReset(email: string): Promise<boolean> {
    const result = await this.sendPasswordResetEmailService.mutate({
      email
    }).toPromise();

    this.logger.log(result);
    return result.data.sendPasswordResetEmail;
  }

  async resetPassword(email: string, newPassword: string, resetPin: string): Promise<boolean> {
    const result = await this.resetPasswordService.mutate({
      email,
      newPassword,
      resetPin
    }).toPromise();

    this.logger.log(result);
    return result.data.resetPassword;
  }

  async user(): Promise<User> {
    const result = await this.meService.fetch().toPromise();
    this.logger.log(result);
    return result.data.me;
  }

  watchUser() {
    return this.meService.watch();
  }

  async verifyAccountExists(): Promise<boolean> {
    try {
      const me = await this.meService.fetch(null, {
        fetchPolicy: 'network-only'
      }).toPromise();

      if (me.errors) {
        // code: "INTERNAL_SERVER_ERROR"
        // FIXME: this may break on a different deployment platform
        if (me.errors[0].name === 'INTERNAL_SERVER_ERROR') {
          for (let index = 0; index < 3; index++) {
            this.logger.log(`verifyAccountExists returned INTERNAL_SERVER_ERROR retry ${index + 1}`);
            const accountExists = await this.verifyAccountExists();
            if (accountExists) {
              return true;
            }
          }
          this.logger.log('verifyAccountExists failed');
          return false;
        }
      } else if (me.data.me) {

        return true;
      } else {

        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async getToken(): Promise<string> {
    try {
      this.token = await this.storage.get('token');

      if (this.token != null) {
        this.setIsLoggedIn(true);
      } else {
        this.setIsLoggedIn(false);
      }

      return this.token;
    } catch (error) {
      this.token = null;
      this.setIsLoggedIn(false);
    }
  }
}
