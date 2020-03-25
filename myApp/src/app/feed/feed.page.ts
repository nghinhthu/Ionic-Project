import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFireFunctions } from '@angular/fire/functions';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  constructor(public router: Router, private afAuth: AngularFireAuth, private aff: AngularFireFunctions) {

  }

    ngOnInit() {
      const getFeed = this.aff.httpsCallable('getFeed')
      getFeed({}).subscribe(data => {
        console.log(data)
      })
    }
  logOut() {
    // this.afAuth.getInstance().signOut();
    this.router.navigate(['/login'])
    this.afAuth.auth.signOut().then(function () {
      // this.router.navigate(['/tab1'])
      console.log("log out")
      // Sign-out successful.
    }, function (error) {
      console.log("err")
      // An error happened.
    });
  }
}
