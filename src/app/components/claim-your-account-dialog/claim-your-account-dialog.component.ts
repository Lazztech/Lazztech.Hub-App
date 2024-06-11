import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-claim-your-account-dialog',
  templateUrl: './claim-your-account-dialog.component.html',
  styleUrls: ['./claim-your-account-dialog.component.css']
})
export class ClaimYourAccountDialogComponent implements OnInit {
  completedInitialAccountSetup: boolean;

  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
  ) {}

  async ngOnInit() {
    this.completedInitialAccountSetup = await this.authService.completedInitialAccountSetup();
  }

  goToSettingsPage() {
    this.navCtrl.navigateForward('settings');
  }

}
