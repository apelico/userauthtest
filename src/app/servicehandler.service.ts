import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { UserRegisterObject } from './models/user-register-object';
import { UserObject } from './models/user-object';

import {  Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    responseType: 'text'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ServicehandlerService {
  userData: UserObject;
  isLoggedIn: boolean = false;
  posts: any[] = [{text:'This is a wonderful text'}];

  constructor(private http: HttpClient, private cookieService: CookieService) { }


  //User Authentication Services
  register(userRegisterObject: UserRegisterObject){
    var name = userRegisterObject.username;
    this.http.post('/api/register',userRegisterObject, httpOptions).subscribe(data => {
      console.log(data);
    });
  }

  login(loginInformation: any){
    return this.http.post('/api/login', {username: loginInformation['username'], password: loginInformation['password']}, httpOptions);
  }

  logout(){
    this.removeToken();
    this.userData = null;
    window.location.reload();
  }

  getAuthenticationData():Observable<any>{
    return this.http.get('/api/getAuthenticationData',this.getTokenHeader());
  }

  getToken(): string{
    if(this.cookieService.check('token')){
      return this.cookieService.get('token');
    }

    return null;
  }

  setToken(tokenValue: string){
    this.cookieService.set('token', tokenValue);
  }

  removeToken(){
    this.cookieService.delete('token');
  }

  getTokenHeader(){
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'text',
        Authorization: 'Bearer ' + this.getToken()
      })
    }
  }

  //User Services

  getUserData(username: string) {
    return this.http.post('/api/getUserData', {username: username}, httpOptions);
  }

  getPosts(){
    return this.posts;
    //return this.http.get('/api/getTodos', httpOptions);
  }

  createPost(post: any){
    this.posts.push(post);
    return this.http.post('/api/createPost',{post: post}, httpOptions);
  }

}
