import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  @ViewChild('tabs', {static: true}) tabs: IonTabs;

  constructor(public auth: AuthService) {}
  
  ngOnInit(){
    this.tabs.select('feed')
  }
}
