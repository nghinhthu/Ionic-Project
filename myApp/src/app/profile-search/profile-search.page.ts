import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';

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
  posts
  displayName: string
  account: string
  profilePic: string
  avatar
  postCount: number = 0
  postRef: Observable<any[]>;
  userReference: AngularFirestoreDocument
  userReference1: AngularFirestoreDocument
  users
  users1
  heartType: string = "heart-outline"
  heartColor: string = "black"
  follower: number = 0
  following: number = 0
  public show:boolean = false;
  public buttonName:any = 'Show';


  myID
  myfollowing: number = 0

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public afStore: AngularFirestore,
    private user: UserService
  ) {

    //id cua nguoi duoc tim kiem
    this.userID = this.route.snapshot.paramMap.get('id')
    this.myID = this.user.getUID()
    // console.log('aaaaaahsdhf '+this.userID)

    this.mainuser = afStore.doc(`users/${this.userID}`)
    this.mainuser1 = afStore.doc(`users/${this.myID}`)
    // this.posts = this.postService.getPosts()  

    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.posts = event.posts
      this.displayName = event.displayName
      this.account = event.account
      this.profilePic = event.profilePic
      this.follower = event.follower.length
      this.following = event.following.length
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
    })

    // this.sub1 = this.userReference1.valueChanges().subscribe(data => {
    //   this.users1 = data
    //   this.heartType = data.following.includes(this.myID) ? 'heart' : 'heart-outline'
    //   this.heartColor = data.following.includes(this.myID) ? 'danger' : 'dark'
    // })
  }

  goTo(postID: string) {
    this.router.navigate(['/tabs/post/' + postID])
  }

  checkAccount(){
    if(this.account == 'Admin'){
      return true
    }
  }

  followerFunction(){
    if (this.heartType == 'heart-outline') {
      this.userReference.update({
        follower: firestore.FieldValue.arrayUnion(this.user.getUID()),
      })
      this.userReference1.update({
        following: firestore.FieldValue.arrayUnion(this.userID)
      })
      
    }
    else {
      this.userReference.update({
        follower: firestore.FieldValue.arrayRemove(this.user.getUID()),
      })
      this.userReference1.update({
        following: firestore.FieldValue.arrayRemove(this.userID)
      })
    }
  }
  toggle() {
    this.show = !this.show;
  }
  toggle1() {
    this.show == this.show;
  }
}
