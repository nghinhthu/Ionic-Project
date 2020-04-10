import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { UserService } from "../user.service";
import { firestore } from "firebase/app";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";

import { AngularFireFunctions } from "@angular/fire/functions";
import { HTTP } from "@ionic-native/http/ngx";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { Http, HttpModule } from "@angular/http";
import { Platform, LoadingController } from "@ionic/angular";
import { finalize } from "rxjs/operators";
import { from, Observable } from "rxjs";
import "firebase/firestore";
// import { PostService } from "../post.service";

@Component({
  selector: "app-feed",
  templateUrl: "./feed.page.html",
  styleUrls: ["./feed.page.scss"]
})
export class FeedPage implements OnInit {

  posts: Observable<any[]>; //collection 'posts'
  users: Observable<any[]>; //collection 'users'

  post

  postid: string;
  // post

  heartType: string = "heart-outline";
  heartColor: string = "black";
  sub;

  userss;
  joined;
  joined2;

  constructor(
    public router: Router,
    private afAuth: AngularFireAuth,
    private aff: AngularFireFunctions,
    private http: HttpClient,
    private nativeHTTP: HTTP,
    private plt: Platform,
    private loadingCtrl: LoadingController,
    private afStore: AngularFirestore,
    private route: ActivatedRoute,
    private user: UserService
  ) // private post: PostService
  {
    let loadedPosts = {};
    this.posts = this.afStore.collection("posts", ref => ref.orderBy("date", "desc"))
      .valueChanges({ idField: "postID" });
    this.post = this.afStore.collection("posts", ref => ref.orderBy("date", "desc"))
      .valueChanges({ idField: "postID" });
    this.users = this.afStore.collection("users")
      .valueChanges({ idField: "postID" });

      // this.post.get()
      // .then((docSnaps) => {
      //   docSnaps.forEach((doc) => {
      //     loadedPosts[doc.id] = doc.data();
      //     this.afStore.collection('users').child(doc.data().uid).get().then((userDoc) => {
      //       loadedPosts[doc.id].userName = userDoc.data().name;
      //     });
      //   })
      // });
  }

  getPostID(postID: string) {
    this.postid = postID;
    console.log("aaaaa " + this.postid);
    return this.postid;
  }

  ngOnInit() {
    // const getFeed = this.aff.httpsCallable('getFeed');
    // getFeed({}).subscribe(data => {
    //   console.log('babababa '+data);
    // });
  }

  // ngOnDestroy() {
  // 	this.sub.unsubscribe()
  // }

  goTo(postID: string) {
    this.router.navigate(["/tabs/post/" + postID]);
  }

  chat() {
    console.log('chat')
    this.router.navigate(["/tabs/chat"]);
  }

  logOut() {
    this.router.navigate(["/login"]);
    this.afAuth.auth.signOut().then(
      function () {
        console.log("log out");
      },
      function (error) {
        console.log("err");
      }
    );
  }
}
