---
sidebar_label: "Auth Service Updates"
sidebar_position: 10
---

# Authentication Service Updates

Now that the application allows a user to login through a third-party authentication service and have their session data securely stored with added encryption, some final touches can be put on the `AuthenticationService` to round out it's functionality.

## Update Authentication Service

With the `VaultService` implemented, additional updates are required within the `AuthenticationService`. For starters, the `constructor()` needs to pass configuration updates to it's parent now that Identity Vault is serving as the `tokenStorageProvider`. This means the `VaultService` needs to be injected:

```typescript title="src/app/services/authentication.service.ts"
...
import { VaultService } from './vault.service';

...
export class AuthenticationService extends IonicAuth {
  constructor(private router: Router, private vaultService: VaultService) {
    super({
      ...(Capacitor.isNativePlatform() ? nativeAuthOptions : webAuthOptions),
      tokenStorageProvider: vaultService.getVault(),
    });
  }
}
```

To ensure the user's data remains secured, it will also need to be deleted when the user logs out. Thus, the `AuthenticationService`'s super class' `logout()` function can be overridden with custom logic to also clear the `vault`:

```typescript title="src/app/services/authentication.service.ts"
async logout() {
  await this.vaultService.clear();
  return await super.logout();
}
```

Finally, we can tell the app where to go after the user logs out. In our case, we will take them right back to the original `LoginPage`:

```typescript title="src/app/services/authentication.service.ts"
async onLogout() {
  return await this.router.navigate(['login']);
}
```

## Next Up

We have created a fully functioning enterprise-grade application! It is time to deploy the application using Ionic's mobile CI/CD platform, Appflow.
