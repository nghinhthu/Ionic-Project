import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Router } from '@angular/router'
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userPosts

  constructor(
    public afStore: AngularFirestore,
    public user: UserService,
    public router: Router) {

    const posts = afStore.doc(`users/${user.getUID()}`)
    this.userPosts = posts.valueChanges()
  }

  goTo(postID: string){
    this.router.navigate(['/tabs/post/'+postID])
  }

  ngOnInit() {
  }

}
