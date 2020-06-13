import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileSearchPage } from './profile-search.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileSearchPageRoutingModule {}
