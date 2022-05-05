// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { IonicAuthOptions } from '@ionic-enterprise/auth';

const authOptions = {
  authConfig: 'auth0' as 'auth0',
  clientID: 'YOUR_AUTH0_CLIENT_ID',
  discoveryUrl: 'https://YOUR_AUTH0_DOMAIN/.well-known/openid-configuration',
  clientSecret: 'YOUR_AUTH0_CLIENT_SECRET',
  scope: 'openid offline_access email picture profile',
  audience: '',
};

export const nativeAuthOptions: IonicAuthOptions = {
  ...authOptions,
  redirectUri: 'myEnterpriseApp://callback',
  logoutUrl: 'myEnterpriseApp://login',
  platform: 'capacitor',
  iosWebView: 'private',
};

export const webAuthOptions: IonicAuthOptions = {
  ...authOptions,
  redirectUri: 'http://app.enterprise.com/callback',
  logoutUrl: 'http://app.enterprise.com/login',
  platform: 'web',
  implicitLogin: 'CURRENT',
};

export const environment = {
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
