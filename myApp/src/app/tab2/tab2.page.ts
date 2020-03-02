import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  userName: string = "";
  password: string = ""

  constructor(public afAuth: AngularFireAuth) { }

  ngOninit() {

  }

  async logIn() {
    const { userName, password } = this
    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(userName + "gmail.com", password)
    }
    catch (err) {
      console.dir(err)
      if(err.code === "auth/invalid-email"){
        console.log("User not found")
      }
    }
  }

}
