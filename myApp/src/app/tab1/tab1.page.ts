import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service'
import { LoaderService } from '../services/loader.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  userName: string = "";
  password: string = "";
  cPassword: string = "";
  displayName: string = "";
  account;
  follow
  adminCode: string = ""
  checkAccount: boolean = false
  gender = [
    { text: 'Admin', disabled: false, checked: true , Code:"gangsteronly"},
    { text: 'User', disabled: false, checked: false }
  ]
  genderChoose
  profilePicDefault: string = "fcf0068f-da61-49a8-a814-95869c68c87c"

  constructor(
    public afAuth: AngularFireAuth,
    public afStore: AngularFirestore,
    public alert: AlertController,
    public router: Router,
    public user: UserService,
    private ionLoader: LoaderService) { }


  ngOninit() {

  }

  showLoader() {
    this.ionLoader.showLoader();

    setTimeout(() => {
      this.hideLoader();
    }, 4000);
  }

  hideLoader() {
    this.ionLoader.hideLoader();
  }
  getGender(genderID) {
    if(genderID == "User"){
      this.checkAccount = false
    }
    else{
      this.checkAccount = true
    }
    
    this.genderChoose = genderID
    return this.genderChoose
  }

  async presentAlert(title: string, content: string) {
    const alert = await this.alert.create({
      header: title,
      message: content,
      buttons: ['OK']
    })
  }

  async register() {
    const { userName, password, cPassword,  displayName, genderChoose, adminCode } = this
    if (password !== cPassword) {
      this.showAlert("Error", "Password do not match")
      return console.log("Password do not match")
      
    }
    if(genderChoose == "Admin"){
      if(adminCode !== this.gender[0].Code){
        this.showAlert("Error", "Admin Code do not match")
        return console.log("Admin Code do not match")
      }
    }
    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(userName + '@gmail.com', password)
      
      const auth = await this.afAuth.auth.currentUser.sendEmailVerification().then(function () {
        // Email sent.
      }).catch(function (error) {
        // An error happened.
      });

      this.user.setUser({
        userName,
        uid: res.user.uid,
        displayName
      })
      
      this.afStore.doc(`users/${res.user.uid}`).set({
        userName,
        displayName: displayName,
        account: genderChoose,
        profilePic: this.profilePicDefault,
        follower: [],
        following: []
      })
    
      this.showAlert('Success!', 'You are registered!')
      this.showLoader()
      this.router.navigate(['/tabs'])
      this.userName = ""
      this.password = ""
    }
    catch (error) {
      this.showAlert("Error", error.message)
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

  resetPassword() {
    if (this.userName != "") {
      this.afAuth.auth.sendPasswordResetEmail(this.userName + '@gmail.com').then(function () {
        window.alert('Email has been sent to you. Please check your email and verify !')
      })
        .catch(function (err) {
          console.dir(err)
          console.dir(err)
          this.showAlert("Error", err)
          window.alert(err)
        })
    }
  }
}
