# Ionic Secure Solutions Starter

A showcase app of Ionic App Platform technologies, including [Ionic Framework](https://ionicframework.com), [Capacitor](https://capacitorjs.com), [Appflow](https://ionic.io/appflow), and [Ionic Secure Solutions solutions](https://go.ionic.io/ionic-enterprise-free-trial).

| <img src="https://user-images.githubusercontent.com/7469758/169586741-dddafdde-b328-4ba2-93e0-064219de9dc0.PNG" width="350" alt="Ionic Secure Solutions Starter Login Page Screenshot on iOS" /> | <img src="https://user-images.githubusercontent.com/7469758/169586745-2dcfb155-f1d6-4b21-a16f-7a8863273328.PNG" width="350" alt="Ionic Secure Solutions Starter Account Page Screenshot on iOS" /> | 
|:---:|:---:|
| [Login Page](https://github.com/ionic-team/ionic-enterprise-starter/tree/main/src/app/pages/login) | [Account Page](https://github.com/ionic-team/ionic-enterprise-starter/tree/main/src/app/pages/account) |

## Try the App

To log into Ionic Secure Solutions Starter, use username **user@enterprise.com** and password: **ionic**.

## Tutorial

Want to see how the Ionic Secure Solutions Starter was made? [Follow along the step-by-step tutorial](https://ionic.io/docs/enterprise-starter).

## Tech Details

- Native runtime: [Capacitor 4](https://capacitorjs.com)
- Frameworks: Ionic Framework 6 and Angular 14
- Capacitor Core plugins
- Ionic Secure Solutions: [Auth Connect](https://ionic.io/products/auth-connect), [Identity Vault](https://ionic.io/products/identity-vault), [Secure Storage](https://ionic.io/products/secure-storage)

## How to Run
> Note: Installing and running this app requires an Ionic Enterprise Native key from a [Ionic Standard or Ionic Enterprise subscription or trial](https://ionic.io/pricing), as well as an Auth0 App. 


__Want to try Ionic's Secure Solutions in your app?__ [Sign up for a free trial](https://dashboard.ionicframework.com/personal/apps?native_trial=1&utm_medium=referral&utm_source=git_hub&utm_campaign=is3_native_trial).

- Install the Ionic CLI: `npm install -g @ionic/cli`
- Clone this repository: `git clone https://github.com/ionic-team/ionic-enterprise-starter.git`
- Navigate to repo in a terminal: `cd ionic-enterprise-starter`
- Add an Ionic Enterprise Native key into your `.bash_profile` file or as an Environment Variable on Windows: `export ENT_NATIVE_KEY="key_4e9d5..."`
  - You can find your key under Native Solutions > Auth Connect > Get Started after creating an app in your [Ionic Hub](https://dashboard.ionicframework.com/). More details [here](https://ionic.io/docs/enterprise-starter/enterprise-key).
- Install dependencies (this will fail if you don't have an Ionic Enterprise Native key): `npm i`
- Set up your local environment file: `npm run prebuild:dev`
- Update the `clientID` and domain within the `discoveryURL` in the `auth0Config` in your `environment.ts` file using your Auth0 App details. More details [here](https://ionic.io/docs/enterprise-starter/auth-connect#setup-auth-configs-in-the-app).
- Run locally in a browser: `ionic serve`
- Deploy to a mobile device: See details [here](https://capacitorjs.com/docs/basics/workflow#testing-your-capacitor-app).
