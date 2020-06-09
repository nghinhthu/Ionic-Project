import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Router } from '@angular/router'
import { Route } from '@angular/compiler/src/core';
import { PostService } from '../post.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { ActionSheetController } from '@ionic/angular';

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
  displayName: string
  account: string
  profilePic: string
  avatar
  postCount: number = 0

  // postRef: Observable<any>;
  postRef: Observable<any[]>;

  userID: string

  constructor(
    public afStore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public user: UserService,
    public router: Router,
    public postService: PostService
    
  ) {
    this.userID = this.afAuth.auth.currentUser.uid;
    // const posts = afStore.doc(`users/${user.getUID()}`)
    // this.userPosts = posts.valueChanges()
    this.mainuser = afStore.doc(`users/${user.getUID()}`)
    // this.posts = this.postService.getPosts()  

    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.posts = event.posts
      this.displayName = event.displayName
      this.account = event.account
      this.profilePic = event.profilePic
      
    })

    this.afStore.collection('posts', ref => ref.where('userID', '==', this.userID)).snapshotChanges()
      .subscribe(data => {
        this.postCount = data.length;
      })
    this.postRef = this.afStore.collection('posts', ref => ref.where('userID', '==', this.userID).orderBy('published', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, data };
      }))
    );
    // this.postRef = this.afStore.collection("posts", ref => ref.orderBy("published", "desc"))
    //   .valueChanges({ idField: "postID" });
    //   console.log('postRef '+this.postRef)
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  goTo(postID: string) {
    this.router.navigate(['/tabs/post/' + postID])
  }

  checkAccount(){
    if(this.account == 'Admin'){
      return true
    }
  }

  

  ngOnInit() {
    // console.log("postRef ",this.postRef)
  }

}
