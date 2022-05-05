const writeFile = require("fs").writeFileSync;

require("dotenv").config();
const auth0ClientID = process.env.AUTH0_CLIENT_ID;
const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
const auth0Domain = process.env.AUTH0_DOMAIN;

const isProd = process.env.ENVIRONMENT === "production" ? true : false;

const nativeLogin = "entstarter://login";
const webLogin = isProd
  ? "https://enterprise-starter.ionic.io/login"
  : "http://localhost:8100/login";

const envConfigFile = `
  import { IonicAuthOptions } from '@ionic-enterprise/auth';

  const auth0Config = {
    authConfig: 'auth0' as 'auth0',
    clientID: '${auth0ClientID}',
    discoveryUrl: 'https://${auth0Domain}/.well-known/openid-configuration',
    clientSecret: '${auth0ClientSecret}',
    scope: 'openid offline_access email picture profile',
    audience: '',
  };

  export const auth0NativeConfig: IonicAuthOptions = {
    ...auth0Config,
    redirectUri: '${nativeLogin}',
    logoutUrl: '${nativeLogin}',
    platform: 'capacitor',
    iosWebView: 'private',
  };

  export const auth0WebConfig: IonicAuthOptions = {
    ...auth0Config,
    redirectUri: '${webLogin}',
    logoutUrl: '${webLogin}',
    platform: 'web',
    implicitLogin: 'CURRENT',
  };

  export const environment = {
    production: ${isProd},
  };
`;
writeFile("src/environments/environment.ts", envConfigFile);
