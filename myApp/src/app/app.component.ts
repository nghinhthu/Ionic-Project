import { Component, ViewChild } from '@angular/core';

import { Platform, ModalController, AlertController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Tab2PageModule } from './tab2/tab2.module'
import { PlatformLocation } from '@angular/common';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet

  rootPage: any = Tab2PageModule;
  splash = true;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private location: PlatformLocation,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router
  ) 
  {
    this.initializeApp();

    this.location.onPopState(async () => {
      console.log('On Pop')
      const modal = await this.modalController.getTop()
      if (modal) {
        modal.dismiss()
      }
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
    
      this.statusBar.styleDefault();

      this.statusBar.backgroundColorByHexString('#75c1f9');
      this.splashScreen.hide();

      this.platform.backButton.subscribeWithPriority(0, async () => {
        if (this.routerOutlet && this.routerOutlet.canGoBack()) {
          this.routerOutlet.pop()
        }
        else if (this.router.url === '/feed') {
          const alert = await this.alertController.create({
            header: "Close App",
            message: "Do you really want to close the app?",
            buttons: [
              {
                text: "Cancle",
                role: "cancle"
              },
              {
                text: "Close App",
                handler: () => {
                  navigator["app"].exitApp()
                }
              }
            ]
          })
          await alert.present()
        }
      })
    });
  }
  
  ngOnInit() {
    this.ionViewDidLoad();
  }
  ionViewDidLoad() {
    setTimeout(() => (this.splash = false), 4000);
  }
}
