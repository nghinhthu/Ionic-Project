import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
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
  mainuser: AngularFirestoreDocument
	sub
	posts
	userName: string
	profilePic: string

  constructor(
    public afStore: AngularFirestore,
    public user: UserService,
    public router: Router) {

    // const posts = afStore.doc(`users/${user.getUID()}`)
    // this.userPosts = posts.valueChanges()
    this.mainuser = afStore.doc(`users/${user.getUID()}`)
		this.sub = this.mainuser.valueChanges().subscribe(event => {
			this.posts = event.posts
			this.userName = event.userName
			this.profilePic = event.profilePic
		})
  }

  ngOnDestroy() {
		this.sub.unsubscribe()
  }
  
  goTo(postID: string){
    this.router.navigate(['/tabs/post/'+postID])
  }

  ngOnInit() {
  }

}
