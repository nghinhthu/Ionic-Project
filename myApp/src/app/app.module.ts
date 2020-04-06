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
import { AngularFirestoreModule } from '@angular/fire/firestore'

import { HttpModule } from '@angular/http'
import { UserService } from './user.service';
import { AuthService } from './auth.service'
import { LoadingComponent } from './loading/loading.component';
import { ShareModule } from './share.module';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
// import {  } from '@angular/fire'
import { HttpClientModule} from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx'

import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

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
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    File,
    UserService,
    AuthService,
    { provide: FunctionsRegionToken, useValue: 'us-central1' },
    HTTP
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
