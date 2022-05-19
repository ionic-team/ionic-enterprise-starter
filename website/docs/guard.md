---
sidebar_label: "Gating the App"
sidebar_position: 7
---

# Gating the App

Our authentication process in great and all, but it does us no good if users can navigate anywhere in the app without logging in. We change that with an authentication guard around the `tabs` route.

## Create the Guard

<iframe
  src="https://www.loom.com/embed/703d828d1bc54478a088c306d3166968"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

Once again we can run a command to create the appropriate file in the project structure:

```bash
ionic g guard guards/auth
```

You will be prompted to choose your gaurd's interface. In this case we will go with `CanActivate`, which ultimately allows you to decided when routes can be activated. Additional information on the other structures can be found [here](https://angular.io/api/router#structures).

<img src={require('@site/static/img/tutorial/generate-guard.png').default} />

After choosing our structure, the file is created with the function already in place:

```typescript title="src/app/guards/auth.guard.ts"
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}
```

For our purposes, we will condense the `canActivate()` return type down to just a `Promise` of a `boolean` value. Next, the `AuthenticationService` is injected in order to give access to the predefined `isAuthenticated()` function. Finally, we will update the activation logic to check to see the user is authenticated or not. If they are, `true` is returned and the user will get access to the main part of the app. If they are not authenticated, logic is added to handle navigating the user back to the `LoginPage` using the `NavController`. This will end up looking as follows:

```typescript title="src/app/guards/auth.guard.ts"
...
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

...
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private navCtrl: NavController
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return await this.checkAuth();
  }

  private async checkAuth() {
    const authed = await this.authService.isAuthenticated();
    return authed || this.routeToLogin();
  }

  private routeToLogin(): boolean {
    this.navCtrl.navigateRoot('/login');
    return false;
  }
}
```

## Using the Guard

<iframe
  src="https://www.loom.com/embed/8b606ed961a94e0c93bcdb7cd8d64343"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

With the `AuthGuard` created, it can now be utilized in protecting the `tabs` route. This is done through updating the `canActivate` property within the initial route for `tabs`:

```typescript title="src/app/tabs/tabs-routing.module.ts"
...
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      ...
    ],
  },
];
...
```

Now you'll notice that the app routing pushes you to `LoginPage` right away. This is because we never logged in with a user yet.

## Next up

With your application being properly gated, we can build on to the security measures by implementing secure storage of its data.
