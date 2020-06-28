import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {

  userID
  mainuser: AngularFirestoreDocument
  mainpost: AngularFirestoreDocument
  displayName: string
  account: string
  profilePic: string

  postID: string
  post

  sub
  subPost

  postTitle: string
  postContent: string
  postImage: string

  posts: any;

  saving = 'Update Post'

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afStore: AngularFirestore,
    private user: UserService,
    private toastCtrl: ToastController
  ) {
    this.postID = this.route.snapshot.paramMap.get('id')
    this.mainuser = afStore.doc(`users/${user.getUID()}`)
    this.mainpost = afStore.doc(`posts/${this.postID}`)
    this.userID = this.user.getUID()

    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.posts = event.posts
      this.displayName = event.displayName
      this.account = event.account
      this.profilePic = event.profilePic

    })

    this.subPost = this.mainpost.valueChanges().subscribe(e => {
      this.postTitle = e.title
      this.postContent = e.content
      this.postImage = e.image
    })
   }

  ngOnInit() {
  }

  async updatePost(){
    this.mainpost.update({
      title: this.postTitle,
      content: this.postContent
    })
    const toast = await this.toastCtrl.create({
      message: 'Your post was changed',
      duration: 2500
    });

    toast.present()
    this.router.navigateByUrl(`/tabs/post/${this.postID}`)
  }
  back(){
    this.router.navigateByUrl(`/tabs/post/${this.postID}`)
  }
}
