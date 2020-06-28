import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.page.html',
  styleUrls: ['./profile-search.page.scss'],
})
export class ProfileSearchPage implements OnInit {

  userID: string
  mainuser: AngularFirestoreDocument
  mainuser1: AngularFirestoreDocument
  sub
  sub1
  notificationFollow
  posts
  displayName: string
  account: string
  profilePic: string
  avatar
  postCount: number = 0
  postRef: Observable<any[]>;
  userRef: Observable<any[]>;
  userReference: AngularFirestoreDocument
  userReference1: AngularFirestoreDocument
  users
  heartType: string = "heart-outline"
  heartColor: string = "black"
  follower: number = 0
  following: number = 0
  textFollow: string
  public show: boolean = false;
  listFollower = []

  userProfile: Observable<any[]>; //collection 'users'

  myID
  myfollowing: number = 0

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public afStore: AngularFirestore,
    private user: UserService,
    public actionSheetController: ActionSheetController,
    public alertCtrl: AlertController,
    public nav: NavController,
    public action: ActionSheetController,

  ) {


    this.userProfile = this.afStore.collection("users")
      .valueChanges({ idField: "userID" })
    this.userRef = this.afStore.collection("users")
      .valueChanges({ idField: "userID" })

    this.userID = this.route.snapshot.paramMap.get('id')
    this.myID = this.user.getUID()

    this.mainuser = afStore.doc(`users/${this.userID}`)
    this.mainuser1 = afStore.doc(`users/${this.myID}`)

    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.posts = event.posts
      this.displayName = event.displayName
      this.account = event.account
      this.profilePic = event.profilePic
      this.follower = event.follower.length
      this.following = event.following.length
      this.listFollower = event.follower
    })

    this.sub1 = this.mainuser1.valueChanges().subscribe(event => {
      this.myfollowing = event.following.length
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
  }

  ngOnInit() {
    this.userReference = this.afStore.doc(`users/${this.userID}`)
    this.userReference1 = this.afStore.doc(`users/${this.myID}`)

    this.sub = this.userReference.valueChanges().subscribe(val => {
      this.users = val
      this.heartType = val.follower.includes(this.user.getUID()) ? 'heart' : 'heart-outline'
      this.heartColor = val.follower.includes(this.user.getUID()) ? 'danger' : 'dark'
      this.textFollow = val.follower.includes(this.user.getUID()) ? 'Un Follow' : 'Follow'
    })
  }

  goTo(postID: string) {
    this.router.navigate(['/tabs/post/' + postID])
  }

  checkAccount() {
    if (this.account == 'Admin') {
      return true
    }
  }

  followerFunction() {
    if (this.heartType == 'heart-outline') {
      this.userReference.update({
        follower: firestore.FieldValue.arrayUnion(this.user.getUID())

      })
      this.userReference1.update({
        following: firestore.FieldValue.arrayUnion(this.userID)
      })

    }
    else {
      this.userReference.update({
        follower: firestore.FieldValue.arrayRemove(this.user.getUID())
      })
      this.userReference1.update({
        following: firestore.FieldValue.arrayRemove(this.userID)
      })
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.action.create({
      header: 'More Optons',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.followerFunction();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


  options() {
    this.presentActionSheet();
  }

  toggle() {
    this.show = !this.show;
  }
  toggle1() {
    this.show == this.show;
  }
  back() {
    this.router.navigate(['/tabs/search'])
  }

}
