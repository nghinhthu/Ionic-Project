import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: TabsPage,
  //   children: [
  //     {
  //       path: 'tab1',
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: () =>
  //             import('../tab1/tab1.module').then(m => m.Tab1PageModule)
  //         }
  //       ]
  //     },
  //     {
  //       path: 'tab2',
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: () =>
  //             import('../tab2/tab2.module').then(m => m.Tab2PageModule)
  //         }
  //       ]
  //     },
  //     {
  //       path: 'tab3',
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: () =>
  //             import('../tab3/tab3.module').then(m => m.Tab3PageModule)
  //         }
  //       ]
  //     },
  //     {
  //       path: '',
  //       redirectTo: '/tabs/tab1',
  //       pathMatch: 'full'
  //     }
  //   ]
  // },
  // {
  //   path: '',
  //   redirectTo: '/tabs/tab1',
  //   pathMatch: 'full'
  // }

  // {
  //   path: '',
  //   component: TabsPage,
  //   children: [
  //     {path: 'feed', loadChildren: '../feed/feed.module#FeedPageModule'}
  //   ]
  // }

  {
    path: '',
    component: TabsPage,
    children: [
      {path: 'feed', loadChildren: '../feed/feed.module#FeedPageModule'},
      {path: 'upload', loadChildren: '../upload/upload.module#UploadPageModule'},
      {path: 'profile', loadChildren: '../profile/profile.module#ProfilePageModule'},
      {path: 'profile/:id', loadChildren: '../profile/profile.module#ProfilePageModule'},
      {path: 'post/:id', loadChildren: '../post/post.module#PostPageModule'},
      {path: 'edit-profile', loadChildren: '../edit-profile/edit-profile.module#EditProfilePageModule'},
      {path: 'chat', loadChildren: '../chat/chat.module#ChatPageModule'},
      {path: 'search', loadChildren: '../search/search.module#SearchPageModule'},
      {path: 'notification', loadChildren: '../notification/notification.module#NotificationPageModule'},
      {path: 'cloudlist', loadChildren: '../cloud-list/cloud-list.module#CloudListPageModule'},
      
      // {path: 'tab3',
      //  loadChildren: () => import ('../tab3/tab3.module').then(m => m.Tab3PageModule)},
    ]
  }

  //   ]}
];
      

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
  