import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service'


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  userName: string = "";
  password: string = "";
  cPassword: string = "";
  gender = [
    { text: 'Male', disabled: false, checked: true},
    { text: 'Female', disabled: false, checked: false}
  ]
  genderChoose : string = "Male"
  profilePicDefault : string = "fcf0068f-da61-49a8-a814-95869c68c87c"

  constructor(
    public afAuth: AngularFireAuth,
    public afStore: AngularFirestore,
    public alert: AlertController,
    public router: Router,
    public user: UserService) { }

  ngOninit() {

  }

  getGender(genderID){
    console.log('gender '+genderID)
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
    const { userName, password, cPassword, gender } = this
    if (password !== cPassword) {
      this.showAlert("Error", "Password do not match")
      return console.log("Password do not match")
    }
    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(userName + '@gmail.com', password)
      const gender = this.genderChoose
      const profilePicDefault = this.profilePicDefault

      this.afStore.doc(`users/${res.user.uid}`).set({
        userName,
        gender
      })

      this.user.setUser({
        userName,
        uid: res.user.uid
        // gender: this.gender.val
      })

      this.showAlert('Success!', 'You are registered!')
      this.router.navigate(['/tabs'])
      // console.log(res)
      // this.showAlert("Success!", "Welcome Aboard!")
      // this.router.navigate(['/tabs'])
    }
    catch (error) {
      console.dir(error)
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
          // if(err){
          console.dir(err)
          this.showAlert("Error", err)
          // console.log(err.code)
          window.alert(err)
          // }
        })
    }
  }
}
