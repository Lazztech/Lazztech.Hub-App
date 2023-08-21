import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Storage } from '@ionic/storage-angular';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { SavePassword } from 'capacitor-ios-autofill-save-password';
import { NGXLogger } from 'ngx-logger';
import { ExpeditedRegistration, ExpeditedRegistrationGQL, LoginGQL, MeGQL, RegisterGQL, ResetPasswordGQL, SendPasswordResetEmailGQL, User } from 'src/graphql/graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: any;

  constructor(
    private storage: Storage,
    private loginService: LoginGQL,
    private registerService: RegisterGQL,
    private sendPasswordResetEmailService: SendPasswordResetEmailGQL,
    private resetPasswordService: ResetPasswordGQL,
    private meService: MeGQL,
    private expeditedRegistrationService: ExpeditedRegistrationGQL,
    private logger: NGXLogger,
  ) { }

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
    } else {
      this.logger.log('Login failure');
    }

    return this.token;
  }

  async logout() {
    await this.storage.clear();
    // throws error on web where it's not implemented, so error must be caught
    await BackgroundGeolocation.removeGeofences().catch(err => undefined);
    document.location.reload();
  }

  async expeditedRegistration() {
    const result = await this.expeditedRegistrationService.mutate().toPromise();
    this.token = result.data.expeditedRegistration.jwt;
    if (this.token) {
      this.logger.log('Login successful.');
      await this.storage.set('token', this.token);
      await this.storage.set('expeditedRegistration', result.data.expeditedRegistration);
    } else {
      this.logger.log('Login failure');
    }
    return result.data.expeditedRegistration;
  }

  async getExpeditedRegistrationDetails(): Promise<ExpeditedRegistration> {
    return this.storage.get('expeditedRegistration');
  }

  async completedInitialAccountSetup(): Promise<boolean> {
    return !!!await this.storage.get('expeditedRegistration');
  }

  async setInitialAccountSetupTrue() {
    await this.storage.set('expeditedRegistration', undefined);
  }

  async iOSAutofillSavePassword(username: string, password: string) {
    if (Capacitor.getPlatform() === 'ios') {
      await SavePassword.promptDialog({
          username,
          password,
      });
    }
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

  async getToken(): Promise<string> {
    try {
      this.token = await this.storage.get('token');
      return this.token;
    } catch (error) {
      this.token = null;
    }
  }
}
