/* tslint:disable */
import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type QueryKeySpecifier = ('getInAppNotifications' | 'paginatedInAppNotifications' | 'hub' | 'usersHubs' | 'commonUsersHubs' | 'invitesByHub' | 'invite' | 'invitesByUser' | 'usersPeople' | 'searchHubByName' | 'ownedHubs' | 'memberOfHubs' | 'me' | 'event' | 'usersEvents' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	getInAppNotifications?: FieldPolicy<any> | FieldReadFunction<any>,
	paginatedInAppNotifications?: FieldPolicy<any> | FieldReadFunction<any>,
	hub?: FieldPolicy<any> | FieldReadFunction<any>,
	usersHubs?: FieldPolicy<any> | FieldReadFunction<any>,
	commonUsersHubs?: FieldPolicy<any> | FieldReadFunction<any>,
	invitesByHub?: FieldPolicy<any> | FieldReadFunction<any>,
	invite?: FieldPolicy<any> | FieldReadFunction<any>,
	invitesByUser?: FieldPolicy<any> | FieldReadFunction<any>,
	usersPeople?: FieldPolicy<any> | FieldReadFunction<any>,
	searchHubByName?: FieldPolicy<any> | FieldReadFunction<any>,
	ownedHubs?: FieldPolicy<any> | FieldReadFunction<any>,
	memberOfHubs?: FieldPolicy<any> | FieldReadFunction<any>,
	me?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>,
	usersEvents?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InAppNotificationKeySpecifier = ('id' | 'header' | 'text' | 'date' | 'actionLink' | 'userId' | 'thumbnail' | InAppNotificationKeySpecifier)[];
export type InAppNotificationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	header?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	actionLink?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>,
	thumbnail?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaginatedInAppNotificationsResponseKeySpecifier = ('items' | 'total' | PaginatedInAppNotificationsResponseKeySpecifier)[];
export type PaginatedInAppNotificationsResponseFieldPolicy = {
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	total?: FieldPolicy<any> | FieldReadFunction<any>
};
export type JoinUserHubKeySpecifier = ('isOwner' | 'starred' | 'lastGeofenceEvent' | 'lastUpdated' | 'userId' | 'hubId' | 'isPresent' | 'user' | 'hub' | JoinUserHubKeySpecifier)[];
export type JoinUserHubFieldPolicy = {
	isOwner?: FieldPolicy<any> | FieldReadFunction<any>,
	starred?: FieldPolicy<any> | FieldReadFunction<any>,
	lastGeofenceEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUpdated?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>,
	hubId?: FieldPolicy<any> | FieldReadFunction<any>,
	isPresent?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	hub?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('shareableId' | 'id' | 'firstName' | 'lastName' | 'birthdate' | 'description' | 'email' | 'lastOnline' | 'image' | 'userDevices' | 'blocks' | 'blocked' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	shareableId?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	firstName?: FieldPolicy<any> | FieldReadFunction<any>,
	lastName?: FieldPolicy<any> | FieldReadFunction<any>,
	birthdate?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	lastOnline?: FieldPolicy<any> | FieldReadFunction<any>,
	image?: FieldPolicy<any> | FieldReadFunction<any>,
	userDevices?: FieldPolicy<any> | FieldReadFunction<any>,
	blocks?: FieldPolicy<any> | FieldReadFunction<any>,
	blocked?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserDeviceKeySpecifier = ('id' | 'fcmPushUserToken' | 'userId' | UserDeviceKeySpecifier)[];
export type UserDeviceFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	fcmPushUserToken?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type BlockKeySpecifier = ('from' | 'to' | BlockKeySpecifier)[];
export type BlockFieldPolicy = {
	from?: FieldPolicy<any> | FieldReadFunction<any>,
	to?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HubKeySpecifier = ('shareableId' | 'id' | 'name' | 'description' | 'active' | 'latitude' | 'longitude' | 'image' | 'usersConnection' | 'microChats' | 'invites' | HubKeySpecifier)[];
export type HubFieldPolicy = {
	shareableId?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	active?: FieldPolicy<any> | FieldReadFunction<any>,
	latitude?: FieldPolicy<any> | FieldReadFunction<any>,
	longitude?: FieldPolicy<any> | FieldReadFunction<any>,
	image?: FieldPolicy<any> | FieldReadFunction<any>,
	usersConnection?: FieldPolicy<any> | FieldReadFunction<any>,
	microChats?: FieldPolicy<any> | FieldReadFunction<any>,
	invites?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MicroChatKeySpecifier = ('id' | 'hub' | 'text' | 'hubId' | MicroChatKeySpecifier)[];
export type MicroChatFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	hub?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	hubId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InviteKeySpecifier = ('id' | 'accepted' | 'invitersId' | 'inviteesId' | 'hubId' | 'inviter' | 'invitee' | 'hub' | InviteKeySpecifier)[];
export type InviteFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	accepted?: FieldPolicy<any> | FieldReadFunction<any>,
	invitersId?: FieldPolicy<any> | FieldReadFunction<any>,
	inviteesId?: FieldPolicy<any> | FieldReadFunction<any>,
	hubId?: FieldPolicy<any> | FieldReadFunction<any>,
	inviter?: FieldPolicy<any> | FieldReadFunction<any>,
	invitee?: FieldPolicy<any> | FieldReadFunction<any>,
	hub?: FieldPolicy<any> | FieldReadFunction<any>
};
export type JoinUserEventKeySpecifier = ('rsvp' | 'lastGeofenceEvent' | 'lastUpdated' | 'userId' | 'eventId' | 'isPresent' | 'user' | 'event' | JoinUserEventKeySpecifier)[];
export type JoinUserEventFieldPolicy = {
	rsvp?: FieldPolicy<any> | FieldReadFunction<any>,
	lastGeofenceEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUpdated?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>,
	eventId?: FieldPolicy<any> | FieldReadFunction<any>,
	isPresent?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	event?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EventKeySpecifier = ('shareableId' | 'id' | 'name' | 'description' | 'startDateTime' | 'endDateTime' | 'latitude' | 'longitude' | 'locationLabel' | 'createdBy' | 'image' | 'usersConnection' | EventKeySpecifier)[];
export type EventFieldPolicy = {
	shareableId?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	startDateTime?: FieldPolicy<any> | FieldReadFunction<any>,
	endDateTime?: FieldPolicy<any> | FieldReadFunction<any>,
	latitude?: FieldPolicy<any> | FieldReadFunction<any>,
	longitude?: FieldPolicy<any> | FieldReadFunction<any>,
	locationLabel?: FieldPolicy<any> | FieldReadFunction<any>,
	createdBy?: FieldPolicy<any> | FieldReadFunction<any>,
	image?: FieldPolicy<any> | FieldReadFunction<any>,
	usersConnection?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('addUserFcmNotificationToken' | 'deleteInAppNotification' | 'deleteAllInAppNotifications' | 'createHub' | 'inviteUserToHub' | 'acceptHubInvite' | 'deleteInvite' | 'leaveHub' | 'deleteHub' | 'editHub' | 'changeHubLocation' | 'changeHubImage' | 'setHubStarred' | 'setHubNotStarred' | 'enteredHubGeofence' | 'dwellHubGeofence' | 'exitedHubGeofence' | 'activateHub' | 'deactivateHub' | 'microChatToHub' | 'createMicroChat' | 'deleteMicroChat' | 'editUserDetails' | 'changeEmail' | 'changeUserImage' | 'blockUser' | 'unblockUser' | 'login' | 'register' | 'logout' | 'resetPassword' | 'sendPasswordResetEmail' | 'changePassword' | 'deleteAccount' | 'reportHubAsInappropriate' | 'reportUserAsInappropriate' | 'reportEventAsInappropriate' | 'createEvent' | 'rsvp' | 'inviteUserToEvent' | 'deleteEvent' | 'updateEvent' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	addUserFcmNotificationToken?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteInAppNotification?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteAllInAppNotifications?: FieldPolicy<any> | FieldReadFunction<any>,
	createHub?: FieldPolicy<any> | FieldReadFunction<any>,
	inviteUserToHub?: FieldPolicy<any> | FieldReadFunction<any>,
	acceptHubInvite?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteInvite?: FieldPolicy<any> | FieldReadFunction<any>,
	leaveHub?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteHub?: FieldPolicy<any> | FieldReadFunction<any>,
	editHub?: FieldPolicy<any> | FieldReadFunction<any>,
	changeHubLocation?: FieldPolicy<any> | FieldReadFunction<any>,
	changeHubImage?: FieldPolicy<any> | FieldReadFunction<any>,
	setHubStarred?: FieldPolicy<any> | FieldReadFunction<any>,
	setHubNotStarred?: FieldPolicy<any> | FieldReadFunction<any>,
	enteredHubGeofence?: FieldPolicy<any> | FieldReadFunction<any>,
	dwellHubGeofence?: FieldPolicy<any> | FieldReadFunction<any>,
	exitedHubGeofence?: FieldPolicy<any> | FieldReadFunction<any>,
	activateHub?: FieldPolicy<any> | FieldReadFunction<any>,
	deactivateHub?: FieldPolicy<any> | FieldReadFunction<any>,
	microChatToHub?: FieldPolicy<any> | FieldReadFunction<any>,
	createMicroChat?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteMicroChat?: FieldPolicy<any> | FieldReadFunction<any>,
	editUserDetails?: FieldPolicy<any> | FieldReadFunction<any>,
	changeEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	changeUserImage?: FieldPolicy<any> | FieldReadFunction<any>,
	blockUser?: FieldPolicy<any> | FieldReadFunction<any>,
	unblockUser?: FieldPolicy<any> | FieldReadFunction<any>,
	login?: FieldPolicy<any> | FieldReadFunction<any>,
	register?: FieldPolicy<any> | FieldReadFunction<any>,
	logout?: FieldPolicy<any> | FieldReadFunction<any>,
	resetPassword?: FieldPolicy<any> | FieldReadFunction<any>,
	sendPasswordResetEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	changePassword?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteAccount?: FieldPolicy<any> | FieldReadFunction<any>,
	reportHubAsInappropriate?: FieldPolicy<any> | FieldReadFunction<any>,
	reportUserAsInappropriate?: FieldPolicy<any> | FieldReadFunction<any>,
	reportEventAsInappropriate?: FieldPolicy<any> | FieldReadFunction<any>,
	createEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	rsvp?: FieldPolicy<any> | FieldReadFunction<any>,
	inviteUserToEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteEvent?: FieldPolicy<any> | FieldReadFunction<any>,
	updateEvent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	InAppNotification?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InAppNotificationKeySpecifier | (() => undefined | InAppNotificationKeySpecifier),
		fields?: InAppNotificationFieldPolicy,
	},
	PaginatedInAppNotificationsResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaginatedInAppNotificationsResponseKeySpecifier | (() => undefined | PaginatedInAppNotificationsResponseKeySpecifier),
		fields?: PaginatedInAppNotificationsResponseFieldPolicy,
	},
	JoinUserHub?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | JoinUserHubKeySpecifier | (() => undefined | JoinUserHubKeySpecifier),
		fields?: JoinUserHubFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserDevice?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserDeviceKeySpecifier | (() => undefined | UserDeviceKeySpecifier),
		fields?: UserDeviceFieldPolicy,
	},
	Block?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | BlockKeySpecifier | (() => undefined | BlockKeySpecifier),
		fields?: BlockFieldPolicy,
	},
	Hub?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | HubKeySpecifier | (() => undefined | HubKeySpecifier),
		fields?: HubFieldPolicy,
	},
	MicroChat?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MicroChatKeySpecifier | (() => undefined | MicroChatKeySpecifier),
		fields?: MicroChatFieldPolicy,
	},
	Invite?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InviteKeySpecifier | (() => undefined | InviteKeySpecifier),
		fields?: InviteFieldPolicy,
	},
	JoinUserEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | JoinUserEventKeySpecifier | (() => undefined | JoinUserEventKeySpecifier),
		fields?: JoinUserEventFieldPolicy,
	},
	Event?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EventKeySpecifier | (() => undefined | EventKeySpecifier),
		fields?: EventFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;