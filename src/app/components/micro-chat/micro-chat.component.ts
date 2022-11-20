import { Component, Input } from '@angular/core';
import { ActionSheetController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { MicroChatAddPage } from 'src/app/pages/micro-chat-add/micro-chat-add.page';
import { HubService } from 'src/app/services/hub/hub.service';
import { JoinUserHub } from 'src/graphql/graphql';

@Component({
  selector: 'app-micro-chat',
  templateUrl: './micro-chat.component.html',
  styleUrls: ['./micro-chat.component.scss'],
})
export class MicroChatComponent {

  @Input()
  hubId: any;

  @Input()
  userHub: JoinUserHub;

  constructor(
    private hubService: HubService,
    private actionSheetController: ActionSheetController,
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController,
    private logger: NGXLogger
  ) { }

  async addNewMicroChat() {
    const modal = await this.modalController.create({
      component: MicroChatAddPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { hubId: this.hubId }
    });
    return await modal.present();
  }

  async microChatActionSheet(microChatId: any) {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Albums',
      buttons: [
      {
        text: 'Send to hub members',
        // icon: 'close',
        handler: async () => {
          await this.hubService.sendMicroChat(this.hubId, microChatId);
          this.logger.log('Send microChat clicked');
          return true;
        }
      },
      {
        text: 'Delete',
        // icon: 'close',
        role: 'destructive',
        handler: () => {
          this.logger.log('Delete clicked');
          const result = confirm('Are you sure you want to delete the MicroChat?');
          if (result) {
            this.hubService.deleteMicroChat(this.hubId, microChatId);
          }
        }
      },
      {
        text: 'Cancel',
        // icon: 'close',
        role: 'cancel',
        handler: () => {
          this.logger.log('Cancel clicked');
        }
      }
    ]
    });
    await actionSheet.present();
  }

}
