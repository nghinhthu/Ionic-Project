import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  text: string
  chatRef: any
  uid: string

  constructor(
    public afAuth: AngularFireAuth,
    public afStore: AngularFirestore,
    private user: UserService
  ) {
    this.uid = this.user.getUID()
    this.chatRef = this.afStore.collection('chats').valueChanges()
   }

   send(){
     if( this.text != ''){
       this.afStore.collection('chats').add({
          userName: this.afAuth.auth.currentUser.displayName,
          Message: this.text,
          UserID: this.afAuth.auth.currentUser.uid
       })
       this.text = ''
     }
   }

  ngOnInit() {
  }

}
