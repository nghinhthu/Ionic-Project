import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'
import { UserService } from '../user.service';
import { Router } from '@angular/router'
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore'


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  userName: string = "";
  displayName: string = ""
  password: string = ""

  chooseLogin: boolean

  constructor(public afAuth: AngularFireAuth, 
    public afStore: AngularFirestore,
    public user: UserService, 
    public router: Router,
    public alert: AlertController) { }

  ngOninit() {

  }

  

  async logIn() {
    const { userName, password } = this
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(userName + '@gmail.com', password)

      if(res.user){
        this.user.setUser({
          userName,
          uid: res.user.uid,
          displayName: res.user.displayName,
          // account: this.user.getAccount()
        })
        this.router.navigate(['/tabs'])
      }
    }
    catch (err) {
      console.dir(err)
      if(err.code){
        this.showAlert("Error", err)
        console.log("User not found")
      }
      // else if(err.code === "auth/user-not-found"){
      //   this.showAlert("Error", err)
      // }
      // else if(err.code === "auth/wrong-password"){
      //   this.showAlert("Error", err)
      // }
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
  async presentAlertMultipleButtons() {
    if(this.userName == ""){
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
    if(this.userName != ""){
      this.afAuth.auth.sendPasswordResetEmail(this.userName+'@gmail.com').then(function (){
        window.alert('Email has been sent to you. Please check your email and verify !')
      })
      .catch(function(err){
        console.dir(err)
      if(err.code){
        // this.showAlert("Error", err)
        console.log(err.code)
        window.alert(err)
      }
      })
  }
  }
  resetPassword(){
    if(this.userName == ""){
      window.alert("Please fill your email address !")
    }
    if(this.userName != ""){
      this.afAuth.auth.sendPasswordResetEmail(this.userName+'@gmail.com').then(function (){
        window.alert('Email has been sent to you. Please check your email and verify !')
      })
      .catch(function(err){
        console.dir(err)
      if(err.code){
        // this.showAlert("Error", err)
        console.log(err.code)
        window.alert(err)
      }
      })
    }
  }
}
