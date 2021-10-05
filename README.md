# Lazztech.Hub-App

<p align="center">
  <a href="https://lazz.tech/software/" target="blank"><img src="https://lazz.tech/images/lazztech_icon.png" width="320"/></a>
</p>
  
  <p align="center">The iOS & Android(Coming Soon) Lazztech Hub Mobile App. Written in <a href="https://www.typescriptlang.org/" target="blank">TypeScript</a> with <a href="https://graphql.org/" target="blank">GraphQL</a> & the <a href="https://nestjs.com/" target="blank">Ionic</a> framework.</p>
    <p align="center">
</p>

## Companion Server

For the companion back-end server see the repo linked below.

[Lazztech.Hub-Service](https://github.com/Lazztech/Lazztech.Hub-Service)

## Installation Dependencies

```bash
# ensure you have nvm installed or the correct version of node
# this command looks for the node version in an .nvmrc file
$ nvm use
```

```bash
# install ionic on you machine
$ npm install -g @ionic/cli
```

```bash
# download npm dependencies for the project
$ npm install
```

## Environments

```bash
# copy environment.ts to new environment.local.ts
# environment.local.ts should not be checked in to git repo & is gitignored
$ cp src/environments/environment.ts src/environments/environment.local.ts

# run with local environment variables
$ npm run start:local

# run as dev
$ npm run start

# run as stage
$ npm run start:stage

# run as prod
$ npm run start:prod
```

## iOS

```bash
# prepare build for iOS
$ ionic build && npx cap sync && npx cap copy && npx cap open ios
```

<!-- ## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
``` -->

## Documentation

[Lazztech.Hub-App Docs](https://lazztech-hub-app.netlify.app/)

## Stay in touch

- Website - [https://lazz.tech/](https://lazz.tech/)

## License

Copyright Lazztech LLC
