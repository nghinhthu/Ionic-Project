import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router'
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

  postss: Observable<any[]>; //collection 'posts'
  users: Observable<any[]>; //collection 'users'
  postID
  follower: number = 0
  following: number = 0
  listFollower = []

  public show:boolean = false;
  public buttonName:any = 'Show';

  constructor(
    public afStore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public user: UserService,
    public router: Router,
    public postService: PostService,
    private route: ActivatedRoute
    
  ) {

    // this.postID = this.route.snapshot.paramMap.get('postID')

    this.users = this.afStore.collection("users")
      .valueChanges({ idField: "userID" })

    // profile cu
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
      this.follower = event.follower.length
      this.following = event.following.length
      this.listFollower = event.follower
        console.log('follower '+this.listFollower[0])
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
  toggle() {
    this.show = !this.show;
  }
  toggle1() {
    this.show == this.show;
  }
}
