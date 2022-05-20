# Ionic Enterprise Starter

Ionic Enterprise Starter is a showcase app of Ionic App Platform technologies, including [Ionic Framework](https://ionicframework.com), [Capacitor](https://capacitorjs.com), [Appflow](https://ionic.io/appflow), and [Ionic Enterprise solutions](https://ionic.io/docs).

| <img src="https://user-images.githubusercontent.com/7469758/169586741-dddafdde-b328-4ba2-93e0-064219de9dc0.PNG" width="350" alt="Ionic Enterprise Starter Login Page Screenshot on iOS" /> | <img src="https://user-images.githubusercontent.com/7469758/169586745-2dcfb155-f1d6-4b21-a16f-7a8863273328.PNG" width="350" alt="Ionic Enterprise Starter Account Page Screenshot on iOS" /> | 
|:---:|:---:|
| [Login Page](https://github.com/ionic-team/ionic-enterprise-starter/tree/main/src/app/pages/login) | [Account Page](https://github.com/ionic-team/ionic-enterprise-starter/tree/main/src/app/pages/account) |

## Try the App

To log into Ionic Enterprise Starter, use username **user@enterprise.com** and password: **ionic**.

## Tech Details

- Native runtime: [Capacitor 3](https://capacitorjs.com)
- Frameworks: Ionic Framework 6 and Angular 13
- Capacitor Core plugins
- Ionic Enterprise solutions: [Auth Connect](https://ionic.io/products/auth-connect), [Identity Vault](https://ionic.io/products/identity-vault), [Secure Storage](https://ionic.io/products/secure-storage)

## How to Run
> Note: Installing and running this app requires a subscription to [Ionic Enterprise](https://ionicframework.com/enterprise). For details, pricing info, and a live demo, please reach out [here](https://ionic.io/contact/sales).

__Want to try Ionic's native solutions in your app?__ [Sign up for a free trial](https://dashboard.ionicframework.com/personal/apps?native_trial=1).

- Install the Ionic CLI: `npm install -g @ionic/cli`
- Clone this repository: `git clone https://github.com/ionic-team/ionic-enterprise-starter.git`
- Navigate to repo in a terminal: `cd ionic-enterprise-starter`
- Add an Ionic Enterprise Native key into your `.bash_profile` file or as an Environment Variable on Windows: `export ENT_NATIVE_KEY="key_4e9d5..."`
- Install dependencies (this will fail if you don't have an Ionic Native key): `npm i`
- Run locally in a browser: `ionic serve`
- Deploy to a mobile device: See details [here](https://capacitorjs.com/docs/basics/running-your-app).
