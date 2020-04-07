import { Component, OnInit, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import { database } from "firebase/app";
import { AngularFirestore } from "@angular/fire/firestore";
import { UserService } from "../user.service";
import { firestore } from "firebase/app";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
// import { Camera, CameraOptions, MediaType } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.page.html",
  styleUrls: ["./upload.page.scss"]
})
export class UploadPage implements OnInit {
  // photos: any = [];

  imageURL: string;
  desc: string = " ";

  busy: boolean = false;

  scaleCrop: string = "-/scale_crop/200x200";

  effects = {
    effect1: "",
    effect2: "-/exposure/50/-/saturation/50/-/warmth/-30/",
    effect3: "-/filter/vevera/150/",
    effect4: "-/filter/carris/150/",
    effect5: "-/filter/misiara/150/"
  };
  activeEffect: string = this.effects.effect1;

  @ViewChild("fileButton", { static: false }) fileButton;

  constructor(
    // public camera: Camera,
    // public file: File,
    public http: Http,
    public afStore: AngularFirestore,
    public user: UserService,
    private alertContraller: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  async createPost() {
    this.busy = true;

    const image = this.imageURL;
    const desc = this.desc;

    this.afStore.doc(`users/${this.user.getUID()}`).update({
      posts: firestore.FieldValue.arrayUnion(image), //["image1", "image2"]
    });

    this.afStore.doc(`posts/${image}`).set({
      desc,
      author: this.user.getUserName(),
      likes: [],
      date: firestore.FieldValue.serverTimestamp()
    });

    this.busy = false;
    this.imageURL = "";
    this.desc = "";

    const alert = await this.alertContraller.create({
      header: "Done",
      message: "Your post was create!",
      buttons: ["Cool!"]
    });

    await alert.present();

    this.router.navigate(["/tabs/feed"]);
  }

  setSelected(effect: string) {
    this.activeEffect = this.effects[effect];
  }

  uploadFile() {
    this.fileButton.nativeElement.click();
  }

  fileChanged(event) {
    this.busy = true;
    const files = event.target.files;
    console.log(files);

    const data = new FormData();
    data.append("file", files[0]);
    data.append("UPLOADCARE_STORE", "1");
    data.append("UPLOADCARE_PUB_KEY", "c08c0a1ac4eac178fdee");

    this.http
      .post("https://upload.uploadcare.com/base/", data)
      .subscribe(event => {
        console.log(event);
        this.imageURL = event.json().file;
        this.busy = false;
      });
  }
  // takePhoto(){
  //   var option: CameraOptions = {
  //     quality: 100,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG
  //   }
  //   this.camera.getPicture().then((imagedata) => {
  //     let fileName = imagedata.substring(imagedata.lastIndexOf('/')+1);
  //     let path = imagedata.substring(0,imagedata.lastIndexOf('/')+1);
  //     this.file.readAsDataURL(path,fileName).then((base64data) => {
  //       this.photos.push(base64data)
  //     })
  //   })
  // }
}
