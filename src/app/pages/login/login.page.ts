import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public errorMessage: string;

  constructor(
    private authService: AuthenticationService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    // If coming back after logging into Auth0,
    // and using CURRENT Implicit (web) Login
    if (window.location.hash) {
      const loadingIndicator = await this.showLoadingIndictator();
      try {
        await this.authService.handleLoginCallback(window.location.href);
      } catch (e) {
        this.errorMessage = e.message;
      } finally {
        loadingIndicator.dismiss();
      }
    }
  }

  async login() {
    // Display loading indicator while Auth Connect login window is open
    const loadingIndicator = await this.showLoadingIndictator();
    try {
      await this.authService.login();
    } catch (e) {
      console.error(e.message);
    } finally {
      loadingIndicator.dismiss();
    }
  }

  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Opening login window...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }
}
