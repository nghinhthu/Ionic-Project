import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { File } from "@ionic-native/file/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { PostService } from '../post.service';
import { Post } from '../post'
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular'
@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})

export class PostPage implements OnInit {

  postNew: Post
  userID
  authorId
  mainuser: AngularFirestoreDocument
  displayName: string
  account: string
  profilePic: string
  commentsRef
  inputComment: string = ""
  //like

  postID: string
  post

  postReference: AngularFirestoreDocument

  heartType: string = "heart-outline"
  heartColor: string = "black"
  sub

  text = 'Hom nay dui que'
  url = 'https://facebook.com/nghinhmatbu'
  posts: any;

  public show: boolean = false;
  public buttonName: any = 'Show';

  constructor(
    private route: ActivatedRoute,
    private afStore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private user: UserService,
    private socialSharing: SocialSharing,
    private file: File,
    private postService: PostService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    public alertCtrl: AlertController,
    public alert: AlertController,
    public action: ActionSheetController,
    public nav: NavController,
    public platform: Platform
  ) {

    // binh luan 
    this.mainuser = afStore.doc(`users/${user.getUID()}`)

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
    // this.heartType = this.heartType == "heart" ? "heart-empty" : "heart"
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

    console.log('postid ' + this.postID)
    const comment = this.inputComment
    const author = this.displayName
    const profilePic = this.profilePic

    if (this.inputComment != "") {
      this.afStore.collection('comments').doc(this.postID).collection('comments').add({
        comment: comment,
        displayName: author,
        profilePic: profilePic,
        published: firebase.firestore.FieldValue.serverTimestamp(),
      });
      this.inputComment = ""
    }
    else {
      this.showAlert("Error", "Please write your comment!")
    }

  }

  async resolveLocalFile() {
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/image`, 'logo.png',
      this.file.cacheDirectory, `${new Date().getTime()}.jpg`)
  }

  removeTempFile(name) {
    this.file.removeFile(this.file.cacheDirectory, name)
  }

  deletePost(postID) {
    this.postService.delete(this.postID)
    this.router.navigate(['/feed'])
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
          this.nav.navigateForward('/edit');
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
            this.mainuser.collection('posts').doc(this.postID).delete()
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
    this.router.navigate(['/feed']) 
  }
}
