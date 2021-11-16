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

Development tools:
- brew
  - https://brew.sh/
- node version manager
  - https://github.com/nvm-sh/nvm
- cocoapods
  - https://guides.cocoapods.org/using/getting-started.html#installation
- xcode
  - https://apps.apple.com/us/app/xcode/id497799835?mt=12
- android studio
  - https://developer.android.com/studio

```bash
# use nvm to install node from the .nvmrc file
$ nvm install
# set the in use node version from the .nvmrc file's verision
$ nvm use
# install node dependencies
$ npm install
```

```bash
# Apple M1 support & troubleshooting resources: 
# https://github.com/nvm-sh/nvm#macos-troubleshooting
# https://www.reddit.com/r/node/comments/lp9xlk/mac_mini_m1_issues_with_node_js_15/

# open x86 shell with rosetta
$ $ arch -x86_64 zsh
# install node version manager & use the version from the .nvmrc file
$ nvm install
# Now check that the architecture is correct:
$ node -p process.arch
x64
# It is now safe to return to the arm64 zsh process:
$ exit
# We're back to a native shell:
$ arch
arm64
# set the in use node version from the .nvmrc file's verision
$ nvm use
# verify that the despite running in an arm shell node architecture returns x86
$ node -p process.arch
x64
# install node dependencies
$ npm install
# install x86 cocoapod dependency for iOS builds
$ sudo arch -x86_64 gem install ffi
```

```bash
# install ionic on you machine
$ npm install -g @ionic/cli
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

## iOS & Android

```bash
# run the following helper npm scripts
# see package.json for available environments
$ npm run prepare:ios:dev
# or
$ npm run prepare:android:dev
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
