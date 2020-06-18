import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import firebaseConfig from './firebase'
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore'
import { AngularFireStorageModule } from '@angular/fire/storage';

import { HttpModule } from '@angular/http'
import { UserService } from './user.service';
import { PostService } from './post.service';
import { AuthService } from './auth.service'
import { LoadingComponent } from './loading/loading.component';
import { ShareModule } from './share.module';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
// import {  } from '@angular/fire'
import { HttpClientModule} from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx'

import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FCM } from '@ionic-native/fcm/ngx'

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { Deeplinks } from '@ionic-native/deeplinks'
import { PostPageModule } from './post/post.module';
// import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpModule,
    ShareModule,
    AngularFireFunctionsModule,
    HttpClientModule,
    // Ng2SearchPipeModule
    // AngularFirestore
    AngularFireStorageModule,
    PostPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    File,
    SocialSharing,
    UserService,
    PostService,
    AuthService,
    ImagePicker,
    MediaCapture,
    File,
    Media,
    StreamingMedia,
    PhotoViewer,
    { provide: FunctionsRegionToken, useValue: 'us-central1' },
    HTTP,
    LocalNotifications,
    FCM,
    InAppBrowser,
    AngularFirestore,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
