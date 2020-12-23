# Ionic Appflow

Ionic Appflow is the CICD provider for native and live web based updates of Ionic app deployments.

## Updating Appflow configuration

```
ionic deploy configure
```

- https://ionicframework.com/docs/cli/commands/deploy-configure

## Deploying Live Updates

1. Push commit
2. Go to Appflow dashboard commits section
3. Start build
4. Select target Platform Web, Build stack Linux - 2020.06, Enable live update, & build
5. Select deployment channel

## iOS
The Ionic Appflow deployment details are configured in the info.plist file.

This is where the app id, update method and other details are configured.

```
	<key>IonAppId</key>
	<string>a01f653f</string>
	<key>IonChannelName</key>
	<string>Production</string>
	<key>IonMaxVersions</key>
	<string>2</string>
	<key>IonMinBackgroundDuration</key>
	<string>30</string>
	<key>IonUpdateMethod</key>
	<string>background</string>
```