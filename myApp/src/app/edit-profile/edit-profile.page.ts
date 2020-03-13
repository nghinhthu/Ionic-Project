import { Component, OnInit, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { UserService } from "../user.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"]
})
export class EditProfilePage implements OnInit {
  mainUser: AngularFirestoreDocument;
  sub;
  userName: string;
  profilePic: string;

  busy: boolean = false;

  password: string;
  newpassword: string;

  @ViewChild("fileBtn", { static: false }) fileBtn: {
    nativeElement: HTMLInputElement;
  };

  constructor(
    public http: Http,
    public afStore: AngularFirestore,
    public user: UserService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.mainUser = afStore.doc(`users/${user.getUID()}`);
    this.sub = this.mainUser.valueChanges().subscribe(event => {
      this.userName = event.userName;
      this.profilePic = event.profilePic;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  updateProfilePic() {
    this.fileBtn.nativeElement.click();
  }

  uploadPic(event) {
    const files = event.target.files;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("UPLOADCARE_STORE", "1");
    data.append("UPLOADCARE_PUB_KEY", "c08c0a1ac4eac178fdee");

    this.http
      .post("https://upload.uploadcare.com/base/", data)
      .subscribe(event => {
        const uuid = event.json().file;
        this.mainUser.update({
          profilePic: uuid
        });
      });
  }

  async presentAlert(title: string, content: string) {
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ["OK"]
    });
    await alert.present();
  }

  async updateDetails() {
    this.busy = true;

    if (!this.password) {
      this.busy = false
      return this.presentAlert("Error!", "You have to enter a password");
    }

    // try {
    //   await this.user.reAuth(this.user.getUserName(), this.password);
    // } catch (error) {
    //   this.busy = false
    //   return this.presentAlert("Error!", "Wrong password!");
    // }
    try {
			await this.user.reAuth(this.user.getUserName(), this.password)
		} catch(error) {
			this.busy = false
			return this.presentAlert('Error!', 'Wrong password!')
		}

    if (this.newpassword) {
      await this.user.updatePassword(this.newpassword);
    }

    if(this.userName !== this.user.getUserName()){
      await this.user.updateEmail(this.userName)
      this.mainUser.update({
        userName: this.userName
      })
    }

    this.password = ""
    this.newpassword = ""
    this.busy = false

    await this.presentAlert('Done!', 'Your profile was updated!')

    this.router.navigate(['/tabs/feed'])
  }
}
