import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

import { User } from './user';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public users: User[] = [];
  private jsonPath = 'assets/data/db.json';

  constructor(private messageService: MessageService,
              private http: HttpClient) {
  }

  async ngOnInit() {
  }

   getUsers(): Observable<User[]> {
    // TODO: send the message _after_ fetching the users
    this.messageService.add('UserService: fetched users');
     this.http.get(this.jsonPath).subscribe(data =>{
       this.users = data['users'] as User[];
     });
    return of(this.users);
  }

  getUser(id: number | string) {
    return this.getUsers().pipe(
      // (+) before `id` turns the string into a number
      map((users: User[]) => users.find(user => user.id === id))
    );
  }
}

