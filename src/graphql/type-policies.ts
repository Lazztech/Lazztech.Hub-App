/* tslint:disable */
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type BlockKeySpecifier = ('from' | 'to' | BlockKeySpecifier)[];
export type BlockFieldPolicy = {
	from?: FieldPolicy<any> | FieldReadFunction<any>,
	to?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EventKeySpecifier = ('coverImage' | 'createdBy' | 'description' | 'endDateTime' | 'hub' | 'id' | 'image' | 'latitude' | 'locationLabel' | 'longitude' | 'maximumCapacity' | 'minimumCapacity' | 'name' | 'shareableId' | 'startDateTime' | 'usersConnection' | EventKeySpecifier)[];
export type EventFieldPolicy = {
	coverImage?: FieldPolicy<any> | FieldReadFunction<any>,
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	endDateTime?: FieldPolicy<any> | FieldReadFunction<any>,
	hub?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	image?: FieldPolicy<any> | FieldReadFunction<any>,
	latitude?: FieldPolicy<any> | FieldReadFunction<any>,
	locationLabel?: FieldPolicy<any> | FieldReadFunction<any>,
	longitude?: FieldPolicy<any> | FieldReadFunction<any>,
	maximumCapacity?: FieldPolicy<any> | FieldReadFunction<any>,
	minimumCapacity?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	shareableId?: FieldPolicy<any> | FieldReadFunction<any>,
	startDateTime?: FieldPolicy<any> | FieldReadFunction<any>,
	usersConnection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ExpeditedRegistrationKeySpecifier = ('jwt' | 'password' | 'username' | ExpeditedRegistrationKeySpecifier)[];
export type ExpeditedRegistrationFieldPolicy = {
	jwt?: FieldPolicy<any> | FieldReadFunction<any>,
	password?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>
};
export type FileKeySpecifier = ('createdBy' | 'createdOn' | 'fileName' | 'id' | 'mimetype' | 'shareableId' | 'url' | FileKeySpecifier)[];
export type FileFieldPolicy = {
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	createdOn?: FieldPolicy<any> | FieldReadFunction<any>,
	fileName?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	mimetype?: FieldPolicy<any> | FieldReadFunction<any>,
	shareableId?: FieldPolicy<any> | FieldReadFunction<any>,
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HubKeySpecifier = ('active' | 'coverImage' | 'description' | 'events' | 'id' | 'image' | 'invites' | 'latitude' | 'locationLabel' | 'longitude' | 'microChats' | 'name' | 'shareableId' | 'usersConnection' | HubKeySpecifier)[];
export type HubFieldPolicy = {
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	coverImage?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	events?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	image?: FieldPolicy<any> | FieldReadFunction<any>,
	invites?: FieldPolicy<any> | FieldReadFunction<any>,
	latitude?: FieldPolicy<any> | FieldReadFunction<any>,
	locationLabel?: FieldPolicy<any> | FieldReadFunction<any>,
	longitude?: FieldPolicy<any> | FieldReadFunction<any>,
	microChats?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	shareableId?: FieldPolicy<any> | FieldReadFunction<any>,
	usersConnection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InAppNotificationKeySpecifier = ('actionLink' | 'date' | 'header' | 'id' | 'text' | 'thumbnail' | 'userId' | InAppNotificationKeySpecifier)[];
export type InAppNotificationFieldPolicy = {
	actionLink?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	header?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	thumbnail?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InviteKeySpecifier = ('accepted' | 'hub' | 'hubId' | 'id' | 'invitee' | 'inviteesId' | 'inviter' | 'invitersId' | InviteKeySpecifier)[];
export type InviteFieldPolicy = {
	accepted?: FieldPolicy<any> | FieldReadFunction<any>,
	hub?: FieldPolicy<any> | FieldReadFunction<any>,
	hubId?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	invitee?: FieldPolicy<any> | FieldReadFunction<any>,
	inviteesId?: FieldPolicy<any> | FieldReadFunction<any>,
	inviter?: FieldPolicy<any> | FieldReadFunction<any>,
	invitersId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type JoinUserEventKeySpecifier = ('event' | 'eventId' | 'isPresent' | 'lastGeofenceEvent' | 'lastUpdated' | 'rsvp' | 'user' | 'userId' | JoinUserEventKeySpecifier)[];
export type JoinUserEventFieldPolicy = {
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	eventId?: FieldPolicy<any> | FieldReadFunction<any>,
	isPresent?: FieldPolicy<any> | FieldReadFunction<any>,
	lastGeofenceEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUpdated?: FieldPolicy<any> | FieldReadFunction<any>,
	rsvp?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type JoinUserHubKeySpecifier = ('hub' | 'hubId' | 'isOwner' | 'isPresent' | 'lastGeofenceEvent' | 'lastUpdated' | 'muted' | 'starred' | 'user' | 'userId' | JoinUserHubKeySpecifier)[];
export type JoinUserHubFieldPolicy = {
	hub?: FieldPolicy<any> | FieldReadFunction<any>,
	hubId?: FieldPolicy<any> | FieldReadFunction<any>,
	isOwner?: FieldPolicy<any> | FieldReadFunction<any>,
	isPresent?: FieldPolicy<any> | FieldReadFunction<any>,
	lastGeofenceEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUpdated?: FieldPolicy<any> | FieldReadFunction<any>,
	muted?: FieldPolicy<any> | FieldReadFunction<any>,
	starred?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MicroChatKeySpecifier = ('hub' | 'hubId' | 'id' | 'text' | MicroChatKeySpecifier)[];
export type MicroChatFieldPolicy = {
	hub?: FieldPolicy<any> | FieldReadFunction<any>,
	hubId?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('acceptHubInvite' | 'activateHub' | 'addUserFcmNotificationToken' | 'blockUser' | 'changeEmail' | 'changeHubLocation' | 'changePassword' | 'createEvent' | 'createHub' | 'createMicroChat' | 'deactivateHub' | 'deleteAccount' | 'deleteAllInAppNotifications' | 'deleteEvent' | 'deleteHub' | 'deleteInAppNotification' | 'deleteInvite' | 'deleteMicroChat' | 'dwellHubGeofence' | 'editHub' | 'editUserDetails' | 'enteredHubGeofence' | 'exitedHubGeofence' | 'expeditedRegistration' | 'inviteUserToEvent' | 'inviteUserToHub' | 'leaveHub' | 'login' | 'logout' | 'microChatToHub' | 'mute' | 'register' | 'removeUserFromEvent' | 'removeUserFromHub' | 'reportEventAsInappropriate' | 'reportHubAsInappropriate' | 'reportUserAsInappropriate' | 'resetPassword' | 'resetShareableEventID' | 'resetShareableHubID' | 'rsvp' | 'sendPasswordResetEmail' | 'setHubNotStarred' | 'setHubStarred' | 'unblockUser' | 'unmute' | 'updateEvent' | 'updateHub' | 'updateUser' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	acceptHubInvite?: FieldPolicy<any> | FieldReadFunction<any>,
	activateHub?: FieldPolicy<any> | FieldReadFunction<any>,
	addUserFcmNotificationToken?: FieldPolicy<any> | FieldReadFunction<any>,
	blockUser?: FieldPolicy<any> | FieldReadFunction<any>,
	changeEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	changeHubLocation?: FieldPolicy<any> | FieldReadFunction<any>,
	changePassword?: FieldPolicy<any> | FieldReadFunction<any>,
	createEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	createHub?: FieldPolicy<any> | FieldReadFunction<any>,
	createMicroChat?: FieldPolicy<any> | FieldReadFunction<any>,
	deactivateHub?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteAccount?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteAllInAppNotifications?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteHub?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteInAppNotification?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteInvite?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteMicroChat?: FieldPolicy<any> | FieldReadFunction<any>,
	dwellHubGeofence?: FieldPolicy<any> | FieldReadFunction<any>,
	editHub?: FieldPolicy<any> | FieldReadFunction<any>,
	editUserDetails?: FieldPolicy<any> | FieldReadFunction<any>,
	enteredHubGeofence?: FieldPolicy<any> | FieldReadFunction<any>,
	exitedHubGeofence?: FieldPolicy<any> | FieldReadFunction<any>,
	expeditedRegistration?: FieldPolicy<any> | FieldReadFunction<any>,
	inviteUserToEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	inviteUserToHub?: FieldPolicy<any> | FieldReadFunction<any>,
	leaveHub?: FieldPolicy<any> | FieldReadFunction<any>,
	login?: FieldPolicy<any> | FieldReadFunction<any>,
	logout?: FieldPolicy<any> | FieldReadFunction<any>,
	microChatToHub?: FieldPolicy<any> | FieldReadFunction<any>,
	mute?: FieldPolicy<any> | FieldReadFunction<any>,
	register?: FieldPolicy<any> | FieldReadFunction<any>,
	removeUserFromEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	removeUserFromHub?: FieldPolicy<any> | FieldReadFunction<any>,
	reportEventAsInappropriate?: FieldPolicy<any> | FieldReadFunction<any>,
	reportHubAsInappropriate?: FieldPolicy<any> | FieldReadFunction<any>,
	reportUserAsInappropriate?: FieldPolicy<any> | FieldReadFunction<any>,
	resetPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	resetShareableEventID?: FieldPolicy<any> | FieldReadFunction<any>,
	resetShareableHubID?: FieldPolicy<any> | FieldReadFunction<any>,
	rsvp?: FieldPolicy<any> | FieldReadFunction<any>,
	sendPasswordResetEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	setHubNotStarred?: FieldPolicy<any> | FieldReadFunction<any>,
	setHubStarred?: FieldPolicy<any> | FieldReadFunction<any>,
	unblockUser?: FieldPolicy<any> | FieldReadFunction<any>,
	unmute?: FieldPolicy<any> | FieldReadFunction<any>,
	updateEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	updateHub?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUser?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaginatedInAppNotificationsResponseKeySpecifier = ('items' | 'total' | PaginatedInAppNotificationsResponseKeySpecifier)[];
export type PaginatedInAppNotificationsResponseFieldPolicy = {
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('commonUsersHubs' | 'event' | 'getInAppNotifications' | 'hub' | 'invite' | 'invitesByHub' | 'invitesByUser' | 'me' | 'memberOfHubs' | 'ownedHubs' | 'paginatedInAppNotifications' | 'searchHubByName' | 'usersEvents' | 'usersHubs' | 'usersPeople' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	commonUsersHubs?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	getInAppNotifications?: FieldPolicy<any> | FieldReadFunction<any>,
	hub?: FieldPolicy<any> | FieldReadFunction<any>,
	invite?: FieldPolicy<any> | FieldReadFunction<any>,
	invitesByHub?: FieldPolicy<any> | FieldReadFunction<any>,
	invitesByUser?: FieldPolicy<any> | FieldReadFunction<any>,
	me?: FieldPolicy<any> | FieldReadFunction<any>,
	memberOfHubs?: FieldPolicy<any> | FieldReadFunction<any>,
	ownedHubs?: FieldPolicy<any> | FieldReadFunction<any>,
	paginatedInAppNotifications?: FieldPolicy<any> | FieldReadFunction<any>,
	searchHubByName?: FieldPolicy<any> | FieldReadFunction<any>,
	usersEvents?: FieldPolicy<any> | FieldReadFunction<any>,
	usersHubs?: FieldPolicy<any> | FieldReadFunction<any>,
	usersPeople?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('birthdate' | 'blocked' | 'blocks' | 'description' | 'email' | 'firstName' | 'id' | 'image' | 'lastName' | 'lastOnline' | 'phoneNumber' | 'profileImage' | 'shareableId' | 'userDevices' | 'username' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	birthdate?: FieldPolicy<any> | FieldReadFunction<any>,
	blocked?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	image?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	lastOnline?: FieldPolicy<any> | FieldReadFunction<any>,
	phoneNumber?: FieldPolicy<any> | FieldReadFunction<any>,
	profileImage?: FieldPolicy<any> | FieldReadFunction<any>,
	shareableId?: FieldPolicy<any> | FieldReadFunction<any>,
	userDevices?: FieldPolicy<any> | FieldReadFunction<any>,
	username?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserDeviceKeySpecifier = ('fcmPushUserToken' | 'id' | 'userId' | UserDeviceKeySpecifier)[];
export type UserDeviceFieldPolicy = {
	fcmPushUserToken?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Block?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BlockKeySpecifier | (() => undefined | BlockKeySpecifier),
		fields?: BlockFieldPolicy,
	},
	Event?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EventKeySpecifier | (() => undefined | EventKeySpecifier),
		fields?: EventFieldPolicy,
	},
	ExpeditedRegistration?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ExpeditedRegistrationKeySpecifier | (() => undefined | ExpeditedRegistrationKeySpecifier),
		fields?: ExpeditedRegistrationFieldPolicy,
	},
	File?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | FileKeySpecifier | (() => undefined | FileKeySpecifier),
		fields?: FileFieldPolicy,
	},
	Hub?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | HubKeySpecifier | (() => undefined | HubKeySpecifier),
		fields?: HubFieldPolicy,
	},
	InAppNotification?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InAppNotificationKeySpecifier | (() => undefined | InAppNotificationKeySpecifier),
		fields?: InAppNotificationFieldPolicy,
	},
	Invite?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InviteKeySpecifier | (() => undefined | InviteKeySpecifier),
		fields?: InviteFieldPolicy,
	},
	JoinUserEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | JoinUserEventKeySpecifier | (() => undefined | JoinUserEventKeySpecifier),
		fields?: JoinUserEventFieldPolicy,
	},
	JoinUserHub?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | JoinUserHubKeySpecifier | (() => undefined | JoinUserHubKeySpecifier),
		fields?: JoinUserHubFieldPolicy,
	},
	MicroChat?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MicroChatKeySpecifier | (() => undefined | MicroChatKeySpecifier),
		fields?: MicroChatFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	PaginatedInAppNotificationsResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaginatedInAppNotificationsResponseKeySpecifier | (() => undefined | PaginatedInAppNotificationsResponseKeySpecifier),
		fields?: PaginatedInAppNotificationsResponseFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserDevice?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserDeviceKeySpecifier | (() => undefined | UserDeviceKeySpecifier),
		fields?: UserDeviceFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;