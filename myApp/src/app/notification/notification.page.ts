import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router} from '@angular/router'
import { PostService } from '../post.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';


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
  users: Observable<any[]>;
  scheduled = []


  constructor(public afStore: AngularFirestore,
    public user: UserService,
    public router: Router,
    private localNotifications: LocalNotifications) { 

      this.users = this.afStore.collection("users")
      .valueChanges({ idField: "userID" })

      this.youridFollow = this.user.getUID() 

      this.mainuser = afStore.doc(`users/${this.youridFollow}`) 

      this.sub = this.mainuser.valueChanges().subscribe(event => {
       
        this.listFollower = event.follower
      })
  
    }
    goToUser(userID: string) {
      this.router.navigate(["/tabs/user/" + userID]);
    }
  ngOnInit() {
   
  }

  schedule() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Attention',
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

}
