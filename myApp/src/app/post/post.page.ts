import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { File } from "@ionic-native/file/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { PostService } from '../post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
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

  constructor(
    private route: ActivatedRoute, 
    private afStore: AngularFirestore,
    private user: UserService,
    private socialSharing: SocialSharing,
    private file: File,
    private postService: PostService
    ) { }

  ngOnInit() {

    this.postID = this.route.snapshot.paramMap.get('id')
    // this.post = this.afStore.doc(`posts/${this.postID}`).valueChanges()
    this.postReference = this.afStore.doc(`posts/${this.postID}`)

    // this.posts = this.postService.getPostData('id')
    // console.log('id '+this.posts)
    
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

  countLiked(){
    var like = this.post.likes.length
    if(like == 1){
      return like+' Like'
    }
    else if(like > 1){
      return like+' Likes'
    }
  }

  async resolveLocalFile(){
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/image`, 'logo.png', 
    this.file.cacheDirectory, `${new Date().getTime()}.jpg`)
  }

  removeTempFile(name){
    this.file.removeFile(this.file.cacheDirectory, name)
  }



  // async shareFacebook(){
  //   let file = await this.resolveLocalFile
  //   console.log('FILE '+ this.file)
  //   this.socialSharing.shareViaFacebook(null, file.nativeURL, this.url).then(() => {
      
  //   }).catch(e => {

  //   })
  // }
  

  share(){
    
  }
  

  sendShare(url) {
    this.socialSharing.share(null, null, null, url);
  }





} 
