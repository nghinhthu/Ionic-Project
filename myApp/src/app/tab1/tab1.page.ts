import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'
import { AlertController } from '@ionic/angular'
import { Router } from '@angular/router'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  userName: string = "";
  password: string = "";
  cPassword: string = "";

  ngOninit() {

  }

  constructor(
    public afAuth: AngularFireAuth, 
    public alert: AlertController,
    public router: Router) {}

  async register(){
    const { userName, password, cPassword} = this
    if(this.password !== this.cPassword){
      this.showAlert("Error", "Password do not match")
      return console.log("Password do not match")
    }
    try{
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(userName + '@abc.com', password)
      console.log(res)
      this.showAlert("Success!", "Welcome Aboard!")
      this.router.navigate(['/tab3'])
    }
    catch(error){
      console.dir(error)
      this.showAlert("Error", error.message)
    }
  }

  async showAlert(header: string, message: string){
    const alert = await this.alert.create({
      header, 
      message,
      buttons: ["Ok"]
    })

    await alert.present()
  }
}
