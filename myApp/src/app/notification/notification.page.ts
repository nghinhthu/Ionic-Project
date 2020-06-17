import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router'
import { Route } from '@angular/compiler/src/core';
import { PostService } from '../post.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  listFollower = []
  userID: string
  mainuser: AngularFirestoreDocument
  youridFollow
  sub
  users; //collection 'users'
  nameFollow = []
  ahihi


  constructor(public afStore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public user: UserService,
    public router: Router,
    public postService: PostService,
    private route: ActivatedRoute) { 

      this.youridFollow = this.user.getUID() //Id nguoi dang nhap

      this.users = this.afStore.collection("users")
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          console.log('data '+data)
          return { id, data };
        }))
      );
      
      console.log('sấdfasdf '+this.users)

      this.mainuser = afStore.doc(`users/${this.youridFollow}`) //cai nay mng lay o dau a

      this.sub = this.mainuser.valueChanges().subscribe(event => {
       
        this.listFollower = event.follower
        console.log('folloew '+this.listFollower)
      })

      this.afStore.collection('users').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          console.log('data '+data)
          return { id, data };
        }))
      );
      
  
    }
    // getNameFollow(postID: string) {
    //  this.
    // }
  ngOnInit() {
   
  }

}
