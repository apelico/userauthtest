import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from '../app/pages/home-page/home-page.component';
import { LoginPageComponent } from '../app/pages/login-page/login-page.component';
import { ProfilePageComponent } from '../app/pages/profile-page/profile-page.component';
import { MessagePageComponent } from '../app/pages/message-page/message-page.component';

const routes: Routes = [
  { path: 'profile', component: ProfilePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'messages', component: MessagePageComponent },
  { path: '', component: HomePageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
