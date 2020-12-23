# Ionic Appflow

Ionic Appflow is the CICD provider for native and live web based updates of Ionic app deployments.

# iOS
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