---
sidebar_label: "Auth Service Updates"
sidebar_position: 11
---

# Authentication Service Updates

Now that the application allows a user to login through a third-party authentication service and have their session data securely stored with added encryption, some final touches can be put on the `AuthenticationService` to round out it's functionality.

## Reconfigure Constructor

With the `SessionVaultService` implemented, additional updates are required within the `AuthenticationService`. For starters, the `constructor()` needs to pass configuration updates to it's parent now that session vault is serving as the `tokenStorageProvider`. This means the `SessionVaultService` needs to be injected:

```typescript title="src/app/services/authentication.service.ts"
...
import { SessionVaultService } from './session-vault.service';

...
export class AuthenticationService extends IonicAuth {
  constructor(
    private router: Router,
    private sessionVault: SessionVaultService
  ) {
    super({
      ...(Capacitor.isNativePlatform() ? nativeAuthOptions : webAuthOptions),
      tokenStorageProvider: sessionVault.getVault(),
    });
  }
}
```

## Override Super Class Logout

To ensure the user's data remains secured, it will also need to be deleted when the user logs out. Thus, the `AuthenticationService`'s super class' `logout()` function can be overridden with custom logic to also clear the `vault`:

```typescript title="src/app/services/authentication.service.ts"
async logout() {
  await this.sessionVault.clear();
  return await super.logout();
}
```

## Amend onLoginSuccess and onLogout

With the session vault helper functions, we can now successfully update the vault's configuration when the user logs in and logs out.

`onLoginSuccess` can now set the value within the session vault, update the unlock mode, and then do it's navigation:

```typescript title="src/app/services/authentication.service.ts"
async onLoginSuccess(response) {
  await this.sessionVault.setValue('session', response);
  await this.sessionVault.initializeUnlockMode();
  await this.router.navigate(['/']);
}
```

Finally, with `onLogout`, we can tell the app where to go after the user logs out, as well as update the vault's configs to match the current state of the application. In our case, we will take them right back to the original `LoginPage`:

```typescript title="src/app/services/authentication.service.ts"
async onLogout() {
  await this.sessionVault.setUnlockMode('NeverLock');
  return await this.router.navigate(['login']);
}
```

## Next Up

We have created a fully functioning enterprise-grade application! It is time to deploy the application using Ionic's mobile CI/CD platform, Appflow.
