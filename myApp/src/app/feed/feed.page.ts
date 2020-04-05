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
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import { Platform, LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import 'firebase/firestore';

@Component({
  selector: "app-feed",
  templateUrl: "./feed.page.html",
  styleUrls: ["./feed.page.scss"]
})
export class FeedPage implements OnInit {

  posts: Observable<any[]>; //collection 'posts'

  postid: string;
  post
  postReference: AngularFirestoreDocument

  heartType: string = "heart-outline"
  heartColor: string = "black"
  sub

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
  ) {
    this.posts = afStore.collection('posts').valueChanges({idField: 'postID'})
    this.post = this.afStore.collection('posts', ref => ref.orderBy('date', 'desc')).valueChanges({idField: 'postID'})
    // this.post = this.posts
    console.log('POST '+this.post)
  }

  getPostID(postID: string){
    this.postid = postID
    console.log('aaaaa '+this.postid)
    return this.postid
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
  
  toggleHeart(postID: string){
    // this.heartType = this.heartType == "heart" ? "heart-empty" : "heart"
    console.log('ahihi '+postID)
    this.postReference = this.afStore.doc(`posts/${postID}`)
    this.sub = this.postReference.valueChanges().subscribe(val=> {
      this.post = val
      this.heartType = val.likes.includes(this.user.getUID()) ? 'heart' : 'heart-outline'
      this.heartColor = val.likes.includes(this.user.getUID()) ? 'danger' : 'dark'
    })
    if(this.heartType == 'heart-outline'){
      this.postReference.update({
        likes: firestore.FieldValue.arrayUnion(this.user.getUID())
      })
    }
    else{
      this.postReference.update({
        likes: firestore.FieldValue.arrayRemove(this.user.getUID())
      })
    }
  }

  goTo(postID: string){
    this.router.navigate(['/tabs/post/'+postID])
  }

  logOut() {
    // this.afAuth.getInstance().signOut();
    this.router.navigate(["/login"]);
    this.afAuth.auth.signOut().then(
      function() {
        // this.router.navigate(['/tab1'])
        console.log("log out");
        // Sign-out successful.
      },
      function(error) {
        console.log("err");
        // An error happened.
      }
    );
  }

  // async getDataa() {
  //   try {
  //     const url = 'https://us-central1-ionic-project-e1801.cloudfunctions.net/getFeed';
  //     const params = {};
  //     const headers = {};

  //     const response = await this.nativeHTTP.get(url, params, headers);

  //     console.log(response.status);
  //     console.log(JSON.parse(response.data)); // JSON data returned by server
  //     console.log(response.headers);

  //   } catch (error) {
  //     console.error(error.status);
  //     console.error(error.error); // Error message as string
  //     console.error(error.headers);
  //   }
  // }

  // async getData(){
  //   let loading = await this.loadingCtrl.create();
  //   await loading.present();

  //   this.http.get('https://us-central1-ionic-project-e1801.cloudfunctions.net/getFeed').pipe(
  //     finalize(() => loading.dismiss())
  //   )

  //   .subscribe(data => {
  //     this.data =  data ['results'];
  //     console.log(data)
  //   },err => {
  //     console.log('JS Call Error: ', err)
  //   });
  // }

  // async getDataNative(){
  //   let loading = await this.loadingCtrl.create();
  //   await loading.present();

  //   let nativeCall = this.nativeHTTP.get('https://us-central1-ionic-project-e1801.cloudfunctions.net/getFeed', {}, {
  //     'Content-Type': 'application/json'
  //   });

  //   from(nativeCall).pipe(
  //     finalize(() => loading.dismiss())
  //   )

  //   .subscribe(data => {
  //     console.log('nativeDATA: ', data)
  //     this.data =  JSON.parse(data.data).results;
  //     // this.data = parsed;
  //   },err => {
  //     console.log('JS Call Error: ', err)
  //   });
  // }

  // async getDataEveryWhere(){
  //   this.plt.is('cordova') ? this.getDataNative() : this.getData();
  // }
}
