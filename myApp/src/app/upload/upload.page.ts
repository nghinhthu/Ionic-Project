import { Component, OnInit, ViewChild, Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { database } from "firebase/app";
import { AngularFirestore } from "@angular/fire/firestore";
import { UserService } from "../user.service";
import { firestore } from "firebase/app";
import { AlertController, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Camera, CameraOptions, MediaType } from "@ionic-native/camera/ngx";
import { File, FileEntry } from "@ionic-native/file/ngx";
import { timestamp, finalize } from 'rxjs/operators';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import {
  MediaCapture,
  MediaFile,
  CaptureError
} from '@ionic-native/media-capture/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AngularFireStorage } from '@angular/fire/storage';

import { Observable } from 'rxjs/Observable'
import { PostService } from '../post.service'
import { AngularFireAuth } from '@angular/fire/auth';

const MEDIA_FOLDER_NAME = 'my_media';

@Component({
  selector: "app-upload",
  templateUrl: "./upload.page.html",
  styleUrls: ["./upload.page.scss"]
})

// @Injectable({
//   providedIn: 'root'
// })

export class UploadPage implements OnInit {

  photos: any = [];
  files = [];
  uploadProgress = 0;

  // imageURL: string;
  // desc: string = " ";
  // profilePic: string

  busy: boolean = false;

  // scaleCrop: string = "-/scale_crop/200x200";

  // effects = {
  //   effect1: "",
  //   effect2: "-/exposure/50/-/saturation/50/-/warmth/-30/",
  //   effect3: "-/filter/vevera/150/",
  //   effect4: "-/filter/carris/150/",
  //   effect5: "-/filter/misiara/150/"
  // };
  // activeEffect: string = this.effects.effect1;


  content: string
  image: string
  title: string
  userid: string;

  saving = 'Create Post'

  uploadPercent: Observable<number>
  downloadURL: Observable<string>

  typeFile: string

  mainuser
  sub
  displayName

  @ViewChild("fileButton", { static: false }) fileButton;

  constructor(
    public camera: Camera,
    public file: File,
    public http: Http,
    public afStore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public user: UserService,
    private alertContraller: AlertController,
    private router: Router,
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    private media: Media,
    private streamingMedia: StreamingMedia,
    private photoViewer: PhotoViewer,
    private actionSheetController: ActionSheetController,
    private plt: Platform,
    private toastCtrl: ToastController,
    private storage: AngularFireStorage,
    private postService: PostService
  ) {
    this.userid = this.afAuth.auth.currentUser.uid;
    this.mainuser = afStore.doc(`users/${user.getUID()}`)
    // this.posts = this.postService.getPosts()  

    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.displayName = event.displayName
    })

  }

  ngOnInit() {
    // this.plt.ready().then(() => {
    //   let path = this.file.dataDirectory;
    //   this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
    //     () => {
    //       this.loadFiles();
    //     },
    //     err => {  
    //       this.file.createDir(path, MEDIA_FOLDER_NAME, false);
    //     }
    //   );
    // });
  }
  createPost() {

    this.busy = true;

    const image = this.image;
    const title = this.title;
    const content = this.content;
    const typeFile = this.typeFile
    let id = this.afStore.createId()

    this.afStore.doc(`users/${this.user.getUID()}`).update({
      posts: firestore.FieldValue.arrayUnion(id), //["image1", "image2"]
    });

    // profilePic = this.afStore.collection(`users/${this.user.getUID()}/${image}`)
    // console.log(profilePic + 'profilePic')

    this.afStore.doc(`posts/${id}`).set({
      title,
      content,
      author: this.displayName,
      likes: [],
      published: firestore.FieldValue.serverTimestamp(),
      image,
      userID: this.userid,
      typeFile
      // data = new firestore.FieldValue.serverTimestamp()
    });

    this.busy = false;
    this.image = "";
    this.title = "";
    this.content = "";
    this.typeFile = ""


    this.saving = 'Post Created!'
    setTimeout(() => (this.saving = 'Create Post'), 3000)
    // this.router.navigate(['/feed'])
  }

  uploadImage(event) {
    const file = event.target.files[0]
    const path = `posts/${file.name}`
    
    // } else {


    if (file.type.split('/')[0] == 'image') {
      this.typeFile = 'image'
      const task = this.storage.upload(path, file);
      const ref = this.storage.ref(path);
      this.uploadPercent = task.percentageChanges();
      console.log('Image uploaded!', file.accessToken);
      task.snapshotChanges().pipe(finalize(() => {
        this.downloadURL = ref.getDownloadURL()
        this.downloadURL.subscribe(url => (this.image = url));
      })
      )
        .subscribe();
    }
    else if (file.type.split('/')[0] == 'video') {
      this.typeFile = 'video'
      const task = this.storage.upload(path, file);
      const ref = this.storage.ref(path);
      this.uploadPercent = task.percentageChanges();
      console.log('Image uploaded!', file.accessToken);
      task.snapshotChanges().pipe(finalize(() => {
        this.downloadURL = ref.getDownloadURL()
        this.downloadURL.subscribe(url => (this.image = url));
      })
      )
        .subscribe();
    }

    else if (file.type.split('/')[0] !== 'image' || file.type.split('/')[0] !== 'video') {
      return alert('only image files')
    }




    // const task = this.storage.upload(path, file);
    // const ref = this.storage.ref(path);
    // this.uploadPercent = task.percentageChanges();
    // console.log('Image uploaded!', file.accessToken);
    // task.snapshotChanges().pipe(finalize(() => {
    //   this.downloadURL = ref.getDownloadURL()
    //   this.downloadURL.subscribe(url => (this.image = url));
    // })
    // )
    //   .subscribe();
    // }
  }


  loadFiles() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        this.files = res;
      },
      err => console.log('error loading files: ', err)
    );
  }
  async selectMedia() {
    const actionSheet = await this.actionSheetController.create({
      header: 'What would you like to add?',
      buttons: [
        {
          text: 'Capture Image',
          handler: () => {
            this.captureImage();
          }
        },
        {
          text: 'Record Video',
          handler: () => {
            this.recordVideo();
          }
        },
        {
          text: 'Record Audio',
          handler: () => {
            this.recordAudio();
          }
        },
        {
          text: 'Load multiple',
          handler: () => {
            this.pickImages();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
  pickImages() {
    this.imagePicker.getPictures({}).then(
      results => {
        for (var i = 0; i < results.length; i++) {
          this.copyFileToLocalDir(results[i]);
        }
      }
    );

    // If you get problems on Android, try to ask for Permission first
    // this.imagePicker.requestReadPermission().then(result => {
    //   console.log('requestReadPermission: ', result);
    //   this.selectMultiple();
    // });
  }
  captureImage() {
    this.mediaCapture.captureImage().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }
  recordAudio() {
    this.mediaCapture.captureAudio().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }
  recordVideo() {
    this.mediaCapture.captureVideo().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
        }
      },
      (err: CaptureError) => console.error(err)
    );
  }
  copyFileToLocalDir(fullPath) {
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }

    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;

    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;

    this.file.copyFile(copyFrom, name, copyTo, newName).then(
      success => {
        this.loadFiles();
      },
      error => {
        console.log('error: ', error);
      }
    );
  }
  openFile(f: FileEntry) {
    if (f.name.indexOf('.wav') > -1) {
      // We need to remove file:/// from the path for the audio plugin to work
      const path = f.nativeURL.replace(/^file:\/\//, '');
      const audioFile: MediaObject = this.media.create(path);
      audioFile.play();
    } else if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {
      // E.g: Use the Streaming Media plugin to play a video
      this.streamingMedia.playVideo(f.nativeURL);
    } else if (f.name.indexOf('.jpg') > -1) {
      // E.g: Use the Photoviewer to present an Image
      this.photoViewer.show(f.nativeURL, 'MY awesome image');
    }
  }
  deleteFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    this.file.removeFile(path, f.name).then(() => {
      this.loadFiles();
    }, err => console.log('error remove: ', err));
  }

  async uploadFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    const type = this.getMimeType(f.name.split('.').pop());
    const buffer = await this.file.readAsArrayBuffer(path, f.name);
    const fileBlob = new Blob([buffer], type);

    const randomId = Math.random()
      .toString(36)
      .substring(2, 8);

    const uploadTask = this.storage.upload(
      `files/${new Date().getTime()}_${randomId}`,
      fileBlob
    );

    uploadTask.percentageChanges().subscribe(change => {
      this.uploadProgress = change;
    });

    uploadTask.then(async res => {
      const toast = await this.toastCtrl.create({
        duration: 3000,
        message: 'File upload finished!'
      });
      toast.present();
    });
  }

  getMimeType(fileExt) {
    if (fileExt == 'wav') return { type: 'audio/wav' };
    else if (fileExt == 'jpg') return { type: 'image/jpg' };
    else if (fileExt == 'mp4') return { type: 'video/mp4' };
    else if (fileExt == 'MOV') return { type: 'video/quicktime' };
  }

  // async createPost() {
  //   this.busy = true;

  //   const image = this.imageURL;
  //   const desc = this.desc;

  //   this.afStore.doc(`users/${this.user.getUID()}`).update({
  //     posts: firestore.FieldValue.arrayUnion(image), //["image1", "image2"]
  //   });

  //   // profilePic = this.afStore.collection(`users/${this.user.getUID()}/${image}`)
  //   // console.log(profilePic + 'profilePic')

  //   this.afStore.doc(`posts/${image}`).set({
  //     desc,
  //     author: this.user.getEmail(),
  //     likes: [],
  //     date: firestore.FieldValue.serverTimestamp(),
  //     // data = new firestore.FieldValue.serverTimestamp()
  //   });

  //   this.busy = false;
  //   this.imageURL = "";
  //   this.desc = "";

  //   const alert = await this.alertContraller.create({
  //     header: "Done",
  //     message: "Your post was create!",
  //     buttons: ["Cool!"]
  //   });

  //   await alert.present();

  //   this.router.navigate(["/tabs/feed"]);
  // }

  // setSelected(effect: string) {
  //   this.activeEffect = this.effects[effect];
  // }

  // uploadFileOld() {
  //   this.fileButton.nativeElement.click();
  // }

  // fileChanged(event) {
  //   this.busy = true;
  //   const files = event.target.files;
  //   console.log(files);

  //   const data = new FormData();
  //   data.append("file", files[0]);
  //   data.append("UPLOADCARE_STORE", "1");
  //   data.append("UPLOADCARE_PUB_KEY", "c08c0a1ac4eac178fdee");

  //   this.http
  //     .post("https://upload.uploadcare.com/base/", data)
  //     .subscribe(event => {
  //       console.log(event);
  //       this.imageURL = event.json().file;
  //       this.busy = false;
  //     });
  // }
}
