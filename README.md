# Webapp Boilerplate

![Screenshot](app/assets/images/screenshot.png)

### Features

- Marko.js 🧩
- Express.js 🚂
- Webpack 4 📦
- Bootstrap 4 🎨
- FontAwesome 5 🔣
- Popper.js 💬
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

### Add routes / views

Add a new route in `/app/routes.json` and the matching view in the `/app/view` directory as `.marko` file.

### Components

Components are written in [marko.js](https://github.com/marko-js/marko). Add new components in the `/app/components` directory.

### Stylesheets

Write your stylesheets in CSS or SCSS and save them to `/app/style` and import them to `style.scss`. This stylesheet file will be compiled and included in your application.

## Docker Container

### Build Image from Dockerfile

```bash
$ docker build -t webapp_name .
```

### Run Container from Image

The following command start a docker container from your image and map port 8080 to port 3000.

```bash
$ docker run -it -p 3000:8080 webapp_name
```

After running the commands above, go to: <http://localhost:3000>
