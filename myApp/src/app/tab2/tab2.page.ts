import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Router } from '@angular/router'
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore'
import { LoaderService } from '../services/loader.service';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  splash = true;
  tabBarElement: any;

  userName: string = "";
  displayName: string = ""
  password: string = ""

  chooseLogin: boolean

  constructor(public afAuth: AngularFireAuth,
    public afStore: AngularFirestore,
    public user: UserService,
    public router: Router,
    public alert: AlertController,
    private ionLoader: LoaderService,
    private localNotifications: LocalNotifications
  ) {

    this.tabBarElement = document.queryCommandEnabled('.tabbar');

  }

  ionViewDidLoad() {
    this.tabBarElement.style.display = 'none';
    setTimeout(() => {

      this.splash = false;
      this.tabBarElement.style.display = 'flex';
    }, 4000);
  }
  showLoader() {
    this.ionLoader.showLoader();

    setTimeout(() => {
      this.hideLoader();
    }, 2000);
  }

  hideLoader() {
    this.ionLoader.hideLoader();
  }
  ngOninit() {

  }
  async logIn() {
    const { userName, password } = this
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(userName + '@gmail.com', password)

      if (res.user) {
        this.user.setUser({
          userName,
          uid: res.user.uid,
          displayName: res.user.displayName
        })
        this.showLoader()
        this.router.navigate(['/tabs'])
        this.schedule()
      }
    }
    catch (err) {
      console.dir(err)
      if (err.code) {
        this.showAlert("Error", err)
        console.log("User not found")
      }
    }
  }



  async presentAlertMultipleButtons() {
    if (this.userName == "") {
      const alert = await this.alert.create({
        cssClass: 'my-custom-class',
        message: 'Username not entered.',
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
        ]
      });

      await alert.present();
    }
    if (this.userName != "") {
      this.afAuth.auth.sendPasswordResetEmail(this.userName + '@gmail.com').then(async function () {
        window.alert('Email has been sent to you. Please check your email and verify !')
      })
        .catch(function (err) {
          console.dir(err)
          if (err.code) {
            this.showAlert("Error", err)
            console.log(err.code)
            window.alert(err)
          }
        })
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })

    await alert.present()
  }
  async resetPassword() {
    if (this.userName == "") {
      const alert = await this.alert.create({
        header: "Error",
        message: "Please fill your email address !",
        buttons: ["Ok"]
      })
      await alert.present()
      // window.alert("Please fill your email address !")
    }
    if (this.userName != "") {
      const alert = await this.alert.create({
        header: "Successful",
        message: "Email has been sent to you. Please check your email and verify !",
        buttons: ["Ok"]
      })
      
      this.afAuth.auth.sendPasswordResetEmail(this.userName + '@gmail.com').then(async function () {
        await alert.present()
      })
        .catch((err) => {
          console.dir(err)
          if (err.code) {
            this.showAlert("Error", err)
          }
        })
    }
  }
  schedule() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Notification',
      text: this.userName + "@gmail.com logged in",
      data: { mydata: 'My hidden message this is' },
      trigger: { in: 1, unit: ELocalNotificationTriggerUnit.SECOND },
      // foreground: true
    })
  }
  async presentAlert() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
