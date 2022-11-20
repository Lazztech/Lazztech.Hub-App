import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Storage } from '@ionic/storage';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';
import { NGXLogger } from 'ngx-logger';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  loading = false;
  returnUrl: string;
  myForm: FormGroup;

  get resetPin() {
    return this.myForm.get('resetPin');
  }

  get newPassword() {
    return this.myForm.get('newPassword');
  }

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private storage: Storage,
    private fb: FormBuilder,
    private logger: NGXLogger,
    private navController: NavController,
    private readonly route: ActivatedRoute,
    ) {
      this.returnUrl = this.route?.snapshot?.queryParams['returnUrl'];
    }

  ngOnInit() {
    this.myForm = this.fb.group({
      resetPin: ['', [
        Validators.required
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    });
  }

  async resetPassword() {
    this.loading = true;

    const formValue = this.myForm.value;

    const email = await this.storage.get('resetEmail');
    if (email) {
      const result = await this.authService.resetPassword(
        email,
        formValue.newPassword,
        formValue.resetPin
      );
      if (result) {
        this.loading = false;
        await this.alertService.presentToast('Succeeded.');
        await this.navController.navigateRoot('/landing', {
          queryParams: {
            returnUrl: this.returnUrl,
          },
        });
      } else {
        this.loading = false;
        this.alertService.presentToast('Password reset failed.');
      }
    } else {
      this.loading = false;
      this.logger.error('Something went wrong.');
    }
  }

  tryAgain() {
    this.navController.navigateForward('/reset-pin', {
      queryParams: {
        returnUrl: this.returnUrl,
      },
    });
  }

}
