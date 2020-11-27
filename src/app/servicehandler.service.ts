import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  posts: any[] = [{text:'This is a wonderful text'}];

  constructor(private http: HttpClient) { }

  getPosts(){
    return this.posts;
    //return this.http.get('/api/getTodos', httpOptions);
  }

  createPost(post: any){
    this.posts.push(post);
    return this.http.post('/api/createPost',{post: post}, httpOptions);
  }

}
