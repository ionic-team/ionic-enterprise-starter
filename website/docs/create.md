---
sidebar_label: "Create a Tab-based App"
---

# Create a Tab-based App

<!-- <iframe
  src="https://www.loom.com/embed/2c4a6b6e689649df8e91196ad261a0bc"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe> -->

<iframe
  src="https://www.loom.com/embed/20911e317aa04e368acd6b63679957d0"
  frameborder="0"
  allowfullscreen
  width="560"
  height="315"
></iframe>

With a bit of background on the solutions we will be using from the Ionic Platform for Enterprise, we will start by creating a tab-based application.

## Step-by-step instructions

:::note
The below instructions utilize the Ionic extension for Visual Studio Code. If you have not installed the Ionic extension already, you can do so [here](https://marketplace.visualstudio.com/items?itemName=ionic.ionic).
:::

Follow these steps along with the video above:

1. Open Visual Studio Code (VSCode) and click on the [Ionic extension](https://marketplace.visualstudio.com/items?itemName=ionic.ionic).

- This will prompt you to create an empty folder within your file system to house the new app.

<img src={require('@site/static/img/tutorial/create-app-folder.png').default} />

2. Choose a location for your application, then create and name the folder.

<img src={require('@site/static/img/tutorial/choose-app-folder-location.png').default} />
<br />
<img src={require('@site/static/img/tutorial/name-app-folder.png').default} />

3. With the folder created, you can open up the Ionic extension in VSCode once more. It will prompt you to create an Angular, React, or Vue application using one of the starter templates.

- In this demo we will choose the `tabs` starter under the `New Angular Project` section.

<img src={require('@site/static/img/tutorial/choose-app-template.png').default} />

4. After choosing your app template, you will then give the app a name and confirm.

<img src={require('@site/static/img/tutorial/name-the-app.png').default} />

5. Once confirming the name of the app, the Ionic VSCode extension will take over to create your tab-based application!

<img src={require('@site/static/img/tutorial/app-creation-cli.png').default} />

6. After the app is created, you can immediately run in on the web by clicking the `Web` option underneath the `Run` section.

- The result will be a fresh new tabs-based application running in your browser.

<img src={require('@site/static/img/tutorial/fresh-tabs-app.png').default} />

## Connect to Version Control

Now that we have an app created, it is important we manage the source code. In any Enterprise, this is common practice and you are likely familiar with the options at your disposal. Throughout the tutorial we will make reference to our version control, such as in the next step and when we reach the deployment step in our app development process. We utilize GitHub in this specific example. Before moving on to the next step, quickly connect your app's source code to your version control provider of choice.

## Next up

With the project created and connected to version control, now it is time to register your enterprise key.
