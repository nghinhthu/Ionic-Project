import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {AngularFirestore} from "@angular/fire/firestore";
import { UserService } from "../user.service";
import { firestore, auth } from "firebase/app";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";

import { AngularFireFunctions } from "@angular/fire/functions";
import { HTTP } from "@ionic-native/http/ngx";
import { HttpClient } from "@angular/common/http";
import { Http, HttpModule } from "@angular/http";
import { Platform, LoadingController, AlertController } from "@ionic/angular";
import { Observable } from "rxjs";
import "firebase/firestore";
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
// import { PostService } from "../post.service";
import { FCM } from '@ionic-native/fcm/ngx';
import { PostService } from '../post.service';
import { LoaderService } from '../services/loader.service';
@Component({
  selector: "app-feed",
  templateUrl: "./feed.page.html",
  styleUrls: ["./feed.page.scss"]
})
export class FeedPage implements OnInit {

  posts: Observable<any[]>; //collection 'posts'
  users: Observable<any[]>; //collection 'users'

  username
  author

  post

  postid: string;
  // post

  heartType: string = "heart-outline";
  heartColor: string = "black";
  sub;

  comments
  scheduled = []
  pushes: any = [];
  typeFile: string
  modalController: any;

  constructor(
    public router: Router,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController,
    private fcm: FCM,

    private postService: PostService,
    private ionLoader: LoaderService
  ) 
  {
    // this.plt.ready().then(() => {
    //   this.localNotifications.on('click').subscribe(res => {
    //     console.log('click: ', res)
    //     let msg = res.data ? res.data.mydata : '';
    //     this.showAlert(res.title, res.text, msg)
    //   });

    //   this.localNotifications.on('trigger').subscribe(res => {
    //     console.log('trigger: ', res)
    //     let msg = res.data ? res.data.mydata : '';
    //     this.showAlert(res.title, res.text, msg)
    //   });
    // })
    // // fcm
    // this.plt.ready()
    //   .then(() => {
    //     this.fcm.onNotification().subscribe(data => {
    //       if (data.wasTapped) {
    //         console.log("Received in background");
    //       } else {
    //         console.log("Received in foreground");
    //       };
    //     });

    //     this.fcm.onTokenRefresh().subscribe(token => {
    //       // Register your new token in your back-end if you want
    //       // backend.registerToken(token);
    //     });
    //   })
  }

  async presentModal(){
    const modal = await this.modalController.create({
      component: FeedPage,
      componentProps: {isModal: true}
    })

    await modal.present()

    if(!window.history.state.modal){
      const modalState = { modal: true}
      history.pushState(modalState, null)
    }
  }

  

  subscribeToTopic() {
    this.fcm.subscribeToTopic('enappd');
  }
  getToken() {
    this.fcm.getToken().then(token => {
    });
  }
  unsubscribeFromTopic() {
    this.fcm.unsubscribeFromTopic('enappd');
  }

  schedule() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Notification',
      text: 'Chichay Notifications',
      data: { mydata: 'My hidden message this is' },
      trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
      // foreground: true
    })
  }

  recurring() {
    this.localNotifications.schedule({
      id: 22,
      title: 'Recurring',
      text: 'Chichay Recurring Notifications',
      data: { mydata: 'My hidden message this is' },
      trigger: { every: ELocalNotificationTriggerUnit.MINUTE },
      // foreground: true
    })
  }

  repeating() {
    this.localNotifications.schedule({
      id: 42,
      title: 'Good morning',
      text: 'Code something epic today',
      data: { mydata: 'My hidden message this is' },
      trigger: { every: { hour: 11, minute: 49 } },
      // foreground: true
    })
  }

  getAll() {
    this.localNotifications.getAll().then(res => {
      this.scheduled = res;
    })
  }

  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present)
  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Are you log out.',
      buttons: [{
        text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
      },
      {
        text: 'Ok',
        handler: () => {
          this.logOut();
        }
      }
    ]
    });

    await alert.present();
  }

  
  getPostID(postID: string) {
    this.postid = postID;
    return this.postid;
  }


  showLoader() {
    this.ionLoader.showLoader();

    setTimeout(() => {
      this.hideLoader();
    }, 2000);
  }

  hideLoader() {
    this.ionLoader.hideLoader();
  }

  ngOnInit() {
    this.posts = this.afStore.collection("posts", ref => ref.orderBy("published", "desc"))
      .valueChanges({ idField: "postID" });
  }

  delete(id: string) {
    this.postService.delete(id)
  }

  goTo(postID: string) {
    this.router.navigate(["/tabs/post/" + postID]);
  }

  goToUser(userID: string) {
    this.router.navigate(["/tabs/user/" + userID]);
  }

  chat() {
    this.router.navigate(["/tabs/chat"]);
  }

  async logOut() {
    await this.afAuth.auth.signOut().then(
      function () {
        var res = document.cookie;
        var multiple = res.split(";");
        for(var i = 0; i < multiple.length; i++) {
           var key = multiple[i].split("=");
           document.cookie = key[0]+" =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
        }
      
      },
      
      function (error) {
        console.log("log out err");
      }
    );
    window.location.reload()
    this.showLoader(); 
    this.router.navigate(["/login"]);
  }
   
}
