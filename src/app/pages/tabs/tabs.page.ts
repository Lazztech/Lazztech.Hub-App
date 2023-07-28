import { Component } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

  environment = environment;

  private activeTab?: HTMLElement;
  public selectedTabName: string;

  constructor() {}

  isMobile() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 992;
  }
  
  /**
   * ionTabsDidChange workaround to get page lifecycle hooks working as expected 
   * https://github.com/ionic-team/ionic-framework/issues/16834#issuecomment-631676434
   * @param tabsRef 
   */
  tabChange(tabsRef: IonTabs) {
    this.selectedTabName = tabsRef.getSelected();
    this.activeTab = tabsRef.outlet.activatedView.element;
  }

  ionViewWillLeave() {
    this.propagateToActiveTab('ionViewWillLeave');
  }
  
  ionViewDidLeave() {
    this.propagateToActiveTab('ionViewDidLeave');
  }
  
  ionViewWillEnter() {
    this.propagateToActiveTab('ionViewWillEnter');
  }
  
  ionViewDidEnter() {
    this.propagateToActiveTab('ionViewDidEnter');
  }
  
  private propagateToActiveTab(eventName: string) {    
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }

}
