import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  @ViewChild('tabs', {static: true}) tabs: IonTabs;

  constructor(public auth: AuthService,public router: Router,) {}
  
  ngOnInit(){
    this.tabs.select('feed')
  }
  upload(){
    this.router.navigate(['/tabs/upload']) 
  }
}
