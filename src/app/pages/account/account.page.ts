import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  public user: any;

  constructor(private authService: AuthenticationService) {}

  async ngOnInit() {
    this.user = await this.authService.getIdToken();
    console.log(this.user);
  }

  async logout() {
    await this.authService.logout();
  }
}
