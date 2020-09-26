import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user$: Observable<User>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: UserService
  ) {}


  ngOnInit() {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getUser(params.get('id')))
    );
  }

  gotoUsers(user: User) {
    const userId = user ? user.id : null;
    // Pass along the user id if available
    // so that the UserList component can select that user.
    // Include a junk 'foo' property for fun.
    this.router.navigate(['/superusers', { id: userId, foo: 'foo' }]);
  }
}
