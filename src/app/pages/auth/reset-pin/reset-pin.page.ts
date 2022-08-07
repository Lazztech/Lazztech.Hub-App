import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-reset-pin',
  templateUrl: './reset-pin.page.html',
  styleUrls: ['./reset-pin.page.scss'],
})
export class ResetPinPage implements OnInit {

  loading = false;

  myForm: FormGroup;

  get email() {
    return this.myForm.get('email');
  }

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private storage: Storage,
    private fb: FormBuilder,
    private navController: NavController,
    ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  async sendPin() {
    this.loading = true;

    const formValue = this.myForm.value;

    const result = await this.authService.sendReset(formValue.email);
    if (result) {
      await this.storage.set('resetEmail', formValue.email);
      this.loading = false;
      await this.alertService.presentToast('Email sent.');
      await this.navController.navigateForward('password-reset');
    } else {
      this.loading = false;
      this.alertService.presentRedToast('Email failed to send.');
    }
  }

}
