import { Component } from '@angular/core';
import { TabsCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  public selectedTab = 'home';
  public buttons = [
    {
      title: 'Home',
      value: 'home',
      icon: 'home',
    },
    {
      title: 'Search',
      value: 'search',
      icon: 'search',
    },
    {
      title: 'Account',
      value: 'account',
      icon: 'person',
    },
  ];

  constructor() {}

  public onTabsWillChange(evt: any) {
    this.selectedTab = evt.tab;
  }
}
