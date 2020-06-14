import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { UserService } from "../user.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"]
})
export class SearchPage implements OnInit {
  // term
  items = [{ name: "archie" }, { name: "jake" }, { name: "richard" }];

  users: Observable<any[]>; //collection 'users'
  userss
  constructor(
    private user: UserService,
    private afStore: AngularFirestore,
    public router: Router
  ) {
    this.users = afStore.collection('users').valueChanges({ idField: 'userID' });
    this.userss = this.users
    console.log('USER ' + this.users);
    // this.userss = this.users
    // console.log('USER ' + this.users);
  }

  search(userID: string){
    if(this.user.getUID() == userID){
      this.router.navigate(['/tabs/profile'])
    }
    else{
      this.router.navigate(['/tabs/search/'+userID])
    }
  }
  ngOnInit() {}
}