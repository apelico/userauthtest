import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { CookieService } from 'ngx-cookie-service';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: '', options: {} };

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PostComponentComponent } from './components/post-component/post-component.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterComponentComponent } from './components/register-component/register-component.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { MessagePageComponent } from './pages/message-page/message-page.component';
import { MessageWindowComponent } from './components/message-window/message-window.component';
import { MessageSnippetComponent } from './components/message-snippet/message-snippet.component';
import { MessageComponent } from './components/message/message.component';
import { TestPageComponent } from './pages/test-page/test-page.component';
import { DesignTwoComponent } from './pages/design-two/design-two.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    PostComponentComponent,
    LoginPageComponent,
    RegisterComponentComponent,
    ProfilePageComponent,
    MessagePageComponent,
    MessageWindowComponent,
    MessageSnippetComponent,
    MessageComponent,
    TestPageComponent,
    DesignTwoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AutosizeModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
