import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileSearchPageRoutingModule } from './profile-search-routing.module';

import { ProfileSearchPage } from './profile-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileSearchPageRoutingModule
  ],
  declarations: [ProfileSearchPage]
})
export class ProfileSearchPageModule {}
