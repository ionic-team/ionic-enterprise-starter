---
sidebar_label: 'Register Enterprise Key'
sidebar_position: 3
---

# Register Enterprise Key

<iframe
  src="https://www.loom.com/embed/7f7ba613ebfd4ba7a38e53b875508d9a"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

Previously, you went ahead and registered for an Enterprise product key which is now available in the [Ionic Hub](https://dashboard.ionicframework.com/). We can work to assign that key to your newly created app.

## Import your App

First, go to the `Apps` section of Ionic Hub and choose `Import existing app`.

<img src={require('@site/static/img/tutorial/import-existing-app.png').default} />

This will walk you through connecting your newly created app via your app's git host. So, give the app a name, connect to your git host, and select your app's repository.

## Assign the Native Plugin Key

Once your app exists within Ionic Hub, you can go back to the `Native Plugin Keys` section of the Ionic Hub. Under the `App` column of your key, you can select the `Assign to app` button. A popover will appear where you can choose your app that you just added to the hub!

## Connect Key and App

There are a few ways you can register your key with your app. One way is through the command line. The instructions for this process can be found [here](https://ionic.io/docs/supported-plugins/setup#install-tooling). However, in this tutorial we'll approach it slightly differently.

For starters, go back to VSCode where you have your app open. In the root folder of the app, create a new file called `.npmrc`. Inside of this new file you can add the following:

```
@ionic-enterprise:registry=https://registry.ionicframework.com/
//registry.ionicframework.com/:_authToken=${ENT_NATIVE_KEY}
```

The `ENT_NATIVE_KEY` part represents the Enterprise Native Key in variable format that will be swapped in dynamically, and can be named however you'd like.

## Configure Local Development Environment

With the app looking for a key, your computer's environment needs to fulfill that need. So, we will add what the app is looking for ...

### Mac

Add the native key to a `.bashrc`, `.bash_profile`, or `.zshrc` file:

```
export ENT_NATIVE_KEY="key_a17927..."
```

### Windows

Add the native key as an Environment Variable. Navigate to `System Properties -> Advanced -> Environment Variables`. Under "User variables for [login name]", add a new Variable (ENT_NATIVE_KEY) and Value ([the native key]).

This is all done in an effort to keep your Enterprise Native Key truly private. This is also a useful setup when building an open-source app that may utilize an Enterprise Native Key as well.

Later, to we'll need to revisit this Environment Variable concept when setting up app builds within [Appflow](https://ionic.io/appflow).

## Next up

Now that we have our key safely talking to the app, let's put it to use with [Auth Connect](https://ionic.io/products/auth-connect)!
