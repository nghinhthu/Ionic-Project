import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  // {
  //   path: 'upload',
  //   loadChildren: () => import('./upload/upload.module').then( m => m.UploadPageModule)
  // },
  // {
  //   path: 'feed',
  //   loadChildren: () => import('./feed/feed.module').then( m => m.FeedPageModule)
  // }

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./tab2/tab2.module').then( m => m.Tab2PageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./tab1/tab1.module').then( m => m.Tab1PageModule)
  }

  // { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  // { path: 'login', loadChildren: './tab2/tab2.module#Tab2PageModule' },
  // { path: 'register', loadChildren: './tab1/tab1.module#Tab1PageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
