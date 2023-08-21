import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage implements OnInit {

  loading = false;

  myForm: UntypedFormGroup;

  get email() {
    return this.myForm.get('email');
  }

  get password() {
    return this.myForm.get('password');
  }

  constructor(
    private modalController: ModalController,
    private profileService: ProfileService,
    private alertService: AlertService,
    private storage: Storage,
    private authService: AuthService,
    private navCtrl: NavController,
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async deleteAccount() {
    this.loading = true;

    const formValue = this.myForm.value;

    const result = await this.profileService.deleteAccount(formValue.email, formValue.password);
    if (result) {
      this.loading = false;
      this.alertService.presentToast('Deleted account.');
      this.modalController.dismiss();
      await this.authService.logout();
    } else {
      this.loading = false;
      this.alertService.presentRedToast('Failed to delete account.');
    }
  }

}
