# Boilerplate for Node.js Webapplications with Express.js, Marko.js & Webpack 🧙

![Screenshot](app/assets/images/screenshot.png)

### Features

- Marko.js 🧩
- Express.js 🚂
- i18n internationalization 🌐
- Webpack 📦
- GitHub Primer 🎨
- FontAwesome 🔣
- Octicons :octocat:
- jQuery 🧸
- Outdated browser warning generated from `.browserslistrc` 🚨
- Hot reloading after filechanges 🔥

This boilerplate works also on a Microsoft IIS server & in Docker container!

### Use this boilerplate as template

![Use this Template](app/assets/images/use-template.png)

First of all, use this repository as template for your new web application by clicking the green button on top of this repository. After that, you have to clone your new repository to your local pc.

```bash
# Clone repository
$ git clone https://github.com/YourUsername/YourRepository.git
```

## Contents

- [Installation](#installation)
- [Build application](#build-application)
- [Run application](#run-application)
- [Add routes / views](#add-routes--views)
- [Components](#components)
- [Stylesheets](#stylesheets)
- [Language variables](#language-variables)
- [Octicon component](https://github.com/Teddy95/octicons-marko)
- [Environment variables](#environment-variables)
- [Authentication](#authentication)
- [Docker container](#docker-container)

### Installation

Install all node modules to get things work.

```bash
# Install node dependencies
$ npm install
```

### Build application

Before you start your web application, you have to compile the app. This step is required bevor the first run and after every file change.

```bash
# Build your webapp
$ npm run build
```

### Run application

```bash
# Run application
$ npm run start
```

Or you can run the app in developer mode, so the app is compiling itself after filechanges and reload its contents in browser.

```bash
# Run application in developer mode
$ npm run dev
```

You can also run your app in debug mode. Just run the following command and attach a debugger to your app. The app is using the default port, mostly `9229`.

```bash
# Run application in debug mode
$ npm run debug
```

### Add routes / views

Add a new route in `/app/routes.js` and the matching view in the `/app/view` directory as `.marko` file.

### Components

Components are written in [marko.js](https://github.com/marko-js/marko). Add new components in the `/app/components` directory.

### Stylesheets

Write your stylesheets in CSS or SCSS and save them to `/app/style` and import them to `style.scss`. This stylesheet file will be compiled and included in your application.

### Language variables

All language variables are stored in `/app/locales` and can be accessed by a marko.js component. The boilerplate uses the i18n module for browser. Change language with query parameter `lang` i.e. `http://localhost:8080/?lang=de`

```marko
// Simple language variable
<lang var="greeting" /> // -> Hello world!

// Language variable with value (value can also be an array of values)
<lang var="interpolatedGreeting" value="Andre" /> // -> Hello Andre!

// Language variables with singular and plural
<lang var="cats" value="1" plural=true /> // -> One cat
<lang var="cats" value="2" plural=true /> // -> 2 cats

// You can also use the translation via JavaScript
-- ${__('greeting')} // -> Hello world!
-- ${__('interpolatedGreeting', 'Andre')} // -> Hello Andre!
-- ${__n('cats', 2)} // -> 2 cats
```

### Octicon component

Read documentation of [octicons-marko](https://github.com/Teddy95/octicons-marko). :octocat:

### Environment variables

Create an `.env` file in the root directory of your web app.

```env
# Sample...
GITHUB_CLIENT_ID="11e92....df3"
GITHUB_CLIENT_SECRET="27bfd2..........84e66d7"
```

```javascript
// Access environment variables
const githubClientId = process.env.GITHUB_CLIENT_ID
console.log(githubClientId)
```

### Authentication

#### Enable authentication

Enable authentication in `/config.js` by setting `authentication` to true.

```bash
# Login url
/auth/<provider>/login
/auth/github/login

# Login callback url
/auth/<provider>/callback

# Logout url
/logout
```

The user object is passed to the browser and can be accessed by `out.global.user`. GitHub authentication is already integrated! Just enable authentication add an `.env` file as the example above with your GitHub client id and client secret to your project and let the magic happen. ✨

#### Authentication for routes

You can enable authentication for each route in `/app/routes.js` individually.

#### Add authentication providers

You can add third party authentication in `/app/authentication.js` i.e. for GitHub.

```javascript
module.exports = {
	'github': {
		authMehtodFile: require('./lib/auth/github.auth.js'),
		callbackHttpMethod: 'get'
	},
	'azuread-openidconnect': { ... },
	...
}
```

You need an `authMehtodFile` which returns a passport strategy and a `callbackHttpMethod` like get or post. The callback http method defines the method type of the callback url for the specific authentication type.

## Docker container

### Build image from Dockerfile

```bash
$ docker build -t webapp_name .
```

### Run container from image

The following command start a docker container from your image and map port 8080 to port 3000. 🔮

```bash
$ docker run -it -p 3000:8080 webapp_name
```

After running the commands above, go to: <http://localhost:3000>
