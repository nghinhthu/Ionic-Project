import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { PostService } from '../post.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})

export class PostPage implements OnInit {

  userID
  authorId
  mainuser: AngularFirestoreDocument
  displayName: string
  account: string
  profilePic: string
  commentsRef
  inputComment: string = ""

  postID: string
  post

  postReference: AngularFirestoreDocument

  heartType: string = "heart-outline"
  heartColor: string = "black"
  sub

  posts: any;

  public show: boolean = false;
  public buttonName: any = 'Show';

  constructor(
    private route: ActivatedRoute,
    private afStore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private user: UserService,
    private postService: PostService,
    private router: Router,
    public alertCtrl: AlertController,
    public alert: AlertController,
    public action: ActionSheetController,
    public nav: NavController
  ) {
    
    this.mainuser = afStore.doc(`users/${user.getUID()}`)
    this.userID = this.user.getUID()

    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.posts = event.posts
      this.displayName = event.displayName
      this.account = event.account
      this.profilePic = event.profilePic

    })
    this.postID = this.route.snapshot.paramMap.get('id')
    this.commentsRef = this.afStore.collection('comments').doc(this.postID)
      .collection('comments', ref => ref.orderBy('published', 'desc')).valueChanges();
  }

  ngOnInit() {

    this.postReference = this.afStore.doc(`posts/${this.postID}`)

    this.sub = this.postReference.valueChanges().subscribe(val => {
      this.post = val
      this.heartType = val.likes.includes(this.user.getUID()) ? 'heart' : 'heart-outline'
      this.heartColor = val.likes.includes(this.user.getUID()) ? 'danger' : 'dark'
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  toggleHeart() {
    if (this.heartType == 'heart-outline') {
      this.postReference.update({
        likes: firestore.FieldValue.arrayUnion(this.user.getUID())
      })
    }
    else {
      this.postReference.update({
        likes: firestore.FieldValue.arrayRemove(this.user.getUID())
      })
    }
  }

  countLiked() {
    var like = this.post.likes.length
    if (like == 1) {
      return like + ' Like'
    }
    else if (like > 1) {
      return like + ' Likes'
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })

    await alert.present()
  }

  comment() {

    const comment = this.inputComment
    const author = this.displayName
    const profilePic = this.profilePic
    const userID = this.user.getUID()

    if (this.inputComment != "") {
      this.afStore.collection('comments').doc(this.postID).collection('comments').add({
        comment: comment,
        displayName: author,
        profilePic: profilePic,
        published: firebase.firestore.FieldValue.serverTimestamp(),
        userID: userID
      });
      this.inputComment = ""
    }
    else {
      this.showAlert("Error", "Please write your comment!")
    }

  }

  deletePost(postID) {
    this.postService.delete(this.postID)
    
  }
  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  async presentActionSheet() {
    const actionSheet = await this.action.create({
      header: 'More Optons',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.DeleteConfirm();
        }
      }, {
        text: 'Edit',
        icon: 'options',
        handler: () => {
          this.router.navigate([`/tabs/edit-post/${this.postID}`])
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
  async DeleteConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Delete!',
      message: "This action can't be undone",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',

          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.afStore.collection('posts').doc(this.postID).delete();
            this.afStore.collection('users').doc(this.user.getUID()).collection('posts').doc(this.postID).delete();
            this.nav.navigateForward(['/tabs/feed'])
          }
        }
      ]
    });

    await alert.present();
  }
  options() {
    this.presentActionSheet();
  }
  back(){
    this.router.navigate(['/tabs/feed']) 
  }
  goToUser(userID: string) {
    this.router.navigate(["/tabs/user/" + userID]);
  }
}
