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

  users: Observable<any[]>;
  
  constructor(
    private user: UserService,
    private afStore: AngularFirestore,
    public router: Router
  ) {
    this.users = afStore.collection('users').valueChanges({ idField: 'userID' });
    console.log('USER ' + this.users);
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