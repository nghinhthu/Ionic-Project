import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  // userPosts
  // mainuser: AngularFirestoreDocument
	// sub
	// posts
	// userName: string
	// profilePic: string

  // postID: string
  // post

  // postReference: AngularFirestoreDocument

  // heartType: string = "heart-empty"


  constructor(
    // private route: ActivatedRoute, 
    // private afStore: AngularFirestore,
    // private user: UserService,
    public router: Router,
    private afAuth: AngularFireAuth
  ) {
    // this.mainuser = afStore.doc(`users/${user.getUID()}`)
		// this.sub = this.mainuser.valueChanges().subscribe(event => {
		// 	this.posts = event.posts
		// 	this.userName = event.userName
		// 	this.profilePic = event.profilePic
		// })
   }

  ngOnInit() {
    // this.postID = this.route.snapshot.paramMap.get('id')
    // // this.post = this.afStore.doc(`posts/${this.postID}`).valueChanges()
    // this.postReference = this.afStore.doc(`posts/${this.postID}`)
    
    // this.sub = this.postReference.valueChanges().subscribe(val=> {
    //   this.post = val
    //   this.heartType = val.likes.includes(this.user.getUID()) ? 'heart' : 'heart-empty'
    // })
  }
  // toggleHeart(){
  //   // this.heartType = this.heartType == "heart" ? "heart-empty" : "heart"
  //   if(this.heartType == 'heart-empty'){
  //     this.postReference.update({
  //       likes: firestore.FieldValue.arrayUnion(this.user.getUID())
  //     })
  //   }
  //   else{
  //     this.postReference.update({
  //       likes: firestore.FieldValue.arrayRemove(this.user.getUID())
  //     })
  //   }
  // }

  // goTo(postID: string){
  //   this.router.navigate(['/tabs/post/'+postID])
  // }
  logOut(){
    // this.afAuth.getInstance().signOut();
    this.router.navigate(['/login'])
    this.afAuth.auth.signOut().then(function() {
      // this.router.navigate(['/tab1'])
      console.log("log out")
      // Sign-out successful.
    }, function(error) {
      console.log("err")
      // An error happened.
    });
  }
}
