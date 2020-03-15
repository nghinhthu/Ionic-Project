import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { UserService } from '../user.service';
import { firestore } from 'firebase/app'

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  postID: string
  post

  postReference: AngularFirestoreDocument

  heartType: string = "heart-outline"
  heartColor: string = "black"
  sub

  constructor(
    private route: ActivatedRoute, 
    private afStore: AngularFirestore,
    private user: UserService
    ) { }

  ngOnInit() {

    this.postID = this.route.snapshot.paramMap.get('id')
    // this.post = this.afStore.doc(`posts/${this.postID}`).valueChanges()
    this.postReference = this.afStore.doc(`posts/${this.postID}`)
    
    this.sub = this.postReference.valueChanges().subscribe(val=> {
      this.post = val
      this.heartType = val.likes.includes(this.user.getUID()) ? 'heart' : 'heart-outline'
      this.heartColor = val.likes.includes(this.user.getUID()) ? 'danger' : 'dark'
    })
  }

  ngOnDestroy() {
		this.sub.unsubscribe()
	}

  toggleHeart(){
    // this.heartType = this.heartType == "heart" ? "heart-empty" : "heart"
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
} 
