/* tslint:disable */
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type Block = {
  __typename?: 'Block';
  from: User;
  to: User;
};

export type Event = {
  __typename?: 'Event';
  coverImage?: Maybe<File>;
  createdBy?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  /** ISO 8601 Date Time */
  endDateTime?: Maybe<Scalars['String']['output']>;
  fileUploads?: Maybe<Array<JoinEventFile>>;
  hub?: Maybe<Hub>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  /** Returns from Hub if available, or else value from Event is returned */
  latitude?: Maybe<Scalars['Float']['output']>;
  /** Returns value from Hub if available, or else value from Event is returned */
  locationLabel?: Maybe<Scalars['String']['output']>;
  /** Returns from Hub if available, or else value from Event is returned */
  longitude?: Maybe<Scalars['Float']['output']>;
  maximumCapacity?: Maybe<Scalars['Float']['output']>;
  minimumCapacity?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  shareableId: Scalars['String']['output'];
  /** ISO 8601 Date Time */
  startDateTime?: Maybe<Scalars['String']['output']>;
  usersConnection?: Maybe<Array<JoinUserEvent>>;
};

export type ExpeditedRegistration = {
  __typename?: 'ExpeditedRegistration';
  jwt: Scalars['String']['output'];
  password: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type File = {
  __typename?: 'File';
  createdBy: User;
  /** ISO 8601 Date Time */
  createdOn: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mimetype?: Maybe<Scalars['String']['output']>;
  shareableId: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type FileUploadJoinUnion = JoinEventFile | JoinHubFile;

export type Hub = {
  __typename?: 'Hub';
  active?: Maybe<Scalars['Boolean']['output']>;
  coverImage?: Maybe<File>;
  description?: Maybe<Scalars['String']['output']>;
  events?: Maybe<Array<Event>>;
  fileUploads?: Maybe<Array<JoinHubFile>>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  invites?: Maybe<Array<Invite>>;
  latitude?: Maybe<Scalars['Float']['output']>;
  locationLabel?: Maybe<Scalars['String']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  microChats?: Maybe<Array<MicroChat>>;
  name: Scalars['String']['output'];
  shareableId: Scalars['String']['output'];
  usersConnection?: Maybe<Array<JoinUserHub>>;
};

export type InAppNotification = {
  __typename?: 'InAppNotification';
  actionLink?: Maybe<Scalars['String']['output']>;
  date: Scalars['String']['output'];
  header?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
};

export type Invite = {
  __typename?: 'Invite';
  accepted: Scalars['Boolean']['output'];
  hub?: Maybe<Hub>;
  hubId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  invitee?: Maybe<User>;
  inviteesId: Scalars['ID']['output'];
  inviter?: Maybe<User>;
  invitersId: Scalars['ID']['output'];
};

export type JoinEventFile = {
  __typename?: 'JoinEventFile';
  approved: Scalars['Boolean']['output'];
  approvedBy?: Maybe<User>;
  approvedByUserId?: Maybe<Scalars['ID']['output']>;
  event: Event;
  eventId: Scalars['ID']['output'];
  file: File;
  fileId: Scalars['ID']['output'];
};

export type JoinHubFile = {
  __typename?: 'JoinHubFile';
  approved: Scalars['Boolean']['output'];
  approvedBy?: Maybe<User>;
  approvedByUserId?: Maybe<Scalars['ID']['output']>;
  file: File;
  fileId: Scalars['ID']['output'];
  hub: Hub;
  hubId: Scalars['ID']['output'];
};

export type JoinUserEvent = {
  __typename?: 'JoinUserEvent';
  event?: Maybe<Event>;
  eventId: Scalars['ID']['output'];
  isPresent?: Maybe<Scalars['Boolean']['output']>;
  /** last update event for presence */
  lastGeofenceEvent?: Maybe<Scalars['String']['output']>;
  /** unix timestamp for the last time the presence state was updated */
  lastUpdated?: Maybe<Scalars['String']['output']>;
  /** going or maybe or cantgo */
  rsvp?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type JoinUserHub = {
  __typename?: 'JoinUserHub';
  hub?: Maybe<Hub>;
  hubId: Scalars['ID']['output'];
  isOwner: Scalars['Boolean']['output'];
  isPresent?: Maybe<Scalars['Boolean']['output']>;
  /** last update event for presence */
  lastGeofenceEvent?: Maybe<Scalars['String']['output']>;
  /** unix timestamp for the last time the presence state was updated */
  lastUpdated?: Maybe<Scalars['String']['output']>;
  muted: Scalars['Boolean']['output'];
  starred: Scalars['Boolean']['output'];
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type MicroChat = {
  __typename?: 'MicroChat';
  hub: Scalars['ID']['output'];
  hubId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptHubInvite: JoinUserHub;
  activateHub: Hub;
  addUserFcmNotificationToken: Scalars['Boolean']['output'];
  blockUser: Block;
  changeEmail: User;
  changeHubLocation: Hub;
  changePassword: Scalars['Boolean']['output'];
  createEvent: JoinUserEvent;
  createHub: JoinUserHub;
  createMicroChat: MicroChat;
  deactivateHub: Hub;
  deleteAccount: Scalars['Boolean']['output'];
  deleteAllInAppNotifications: Scalars['Boolean']['output'];
  deleteEvent: Scalars['Boolean']['output'];
  deleteFileById: Scalars['Boolean']['output'];
  deleteHub: Scalars['Boolean']['output'];
  deleteInAppNotification: Scalars['Boolean']['output'];
  deleteInvite: Scalars['Boolean']['output'];
  deleteMicroChat: Scalars['Boolean']['output'];
  dwellEventGeofence: JoinUserEvent;
  dwellHubGeofence: JoinUserHub;
  editHub: Hub;
  editUserDetails: User;
  enteredEventGeofence: JoinUserEvent;
  enteredHubGeofence: JoinUserHub;
  exitedEventGeofence: JoinUserEvent;
  exitedHubGeofence: JoinUserHub;
  expeditedRegistration: ExpeditedRegistration;
  inviteUserToEvent: JoinUserEvent;
  inviteUserToHub: Invite;
  leaveHub: Scalars['Boolean']['output'];
  login?: Maybe<Scalars['String']['output']>;
  logout: Scalars['Boolean']['output'];
  microChatToHub: Scalars['Boolean']['output'];
  mute: JoinUserHub;
  register?: Maybe<Scalars['String']['output']>;
  removeUserFromEvent: Scalars['Boolean']['output'];
  removeUserFromHub: Scalars['Boolean']['output'];
  reportEventAsInappropriate: Scalars['Boolean']['output'];
  reportFileAsInappropriate: Scalars['Boolean']['output'];
  reportHubAsInappropriate: Scalars['Boolean']['output'];
  reportUserAsInappropriate: Scalars['Boolean']['output'];
  resetPassword: Scalars['Boolean']['output'];
  resetShareableEventID: JoinUserEvent;
  resetShareableHubID: JoinUserHub;
  rsvp: JoinUserEvent;
  sendPasswordResetEmail: Scalars['Boolean']['output'];
  setHubNotStarred: Scalars['Boolean']['output'];
  setHubStarred: Scalars['Boolean']['output'];
  unblockUser: Block;
  unmute: JoinUserHub;
  updateEvent: Event;
  updateHub: Hub;
  updateUser: User;
  uploadEventFiles: JoinUserEvent;
  uploadHubFiles: JoinUserHub;
};


export type MutationAcceptHubInviteArgs = {
  inviteId: Scalars['ID']['input'];
};


export type MutationActivateHubArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationAddUserFcmNotificationTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationBlockUserArgs = {
  toUserId: Scalars['ID']['input'];
};


export type MutationChangeEmailArgs = {
  newEmail: Scalars['String']['input'];
};


export type MutationChangeHubLocationArgs = {
  hubId: Scalars['ID']['input'];
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationCreateEventArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDateTime?: InputMaybe<Scalars['String']['input']>;
  hubId?: InputMaybe<Scalars['String']['input']>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  locationLabel?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  maximumCapacity?: InputMaybe<Scalars['Int']['input']>;
  minimumCapacity?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  startDateTime?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateHubArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
  latitude: Scalars['Float']['input'];
  locationLabel?: InputMaybe<Scalars['String']['input']>;
  longitude: Scalars['Float']['input'];
  name: Scalars['String']['input'];
};


export type MutationCreateMicroChatArgs = {
  hubId: Scalars['ID']['input'];
  microChatText: Scalars['String']['input'];
};


export type MutationDeactivateHubArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationDeleteAccountArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFileByIdArgs = {
  fileId: Scalars['ID']['input'];
};


export type MutationDeleteHubArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationDeleteInAppNotificationArgs = {
  inAppNotificationId: Scalars['ID']['input'];
};


export type MutationDeleteInviteArgs = {
  hubId: Scalars['ID']['input'];
  inviteId: Scalars['ID']['input'];
};


export type MutationDeleteMicroChatArgs = {
  hubId: Scalars['ID']['input'];
  microChatId: Scalars['ID']['input'];
};


export type MutationDwellEventGeofenceArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationDwellHubGeofenceArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationEditHubArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  hubId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationEditUserDetailsArgs = {
  description: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
};


export type MutationEnteredEventGeofenceArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationEnteredHubGeofenceArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationExitedEventGeofenceArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationExitedHubGeofenceArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationInviteUserToEventArgs = {
  eventId: Scalars['ID']['input'];
  inviteesEmail?: InputMaybe<Scalars['String']['input']>;
  inviteesShareableId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationInviteUserToHubArgs = {
  hubId: Scalars['ID']['input'];
  inviteesEmail?: InputMaybe<Scalars['String']['input']>;
  inviteesShareableId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationLeaveHubArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMicroChatToHubArgs = {
  hubId: Scalars['ID']['input'];
  microChatId: Scalars['ID']['input'];
};


export type MutationMuteArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationRegisterArgs = {
  data: UserInput;
};


export type MutationRemoveUserFromEventArgs = {
  eventId: Scalars['ID']['input'];
  otherUsersId: Scalars['ID']['input'];
};


export type MutationRemoveUserFromHubArgs = {
  hubId: Scalars['ID']['input'];
  otherUsersId: Scalars['ID']['input'];
};


export type MutationReportEventAsInappropriateArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationReportFileAsInappropriateArgs = {
  fileId: Scalars['ID']['input'];
};


export type MutationReportHubAsInappropriateArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationReportUserAsInappropriateArgs = {
  toUserId: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  resetPin: Scalars['String']['input'];
  usersEmail: Scalars['String']['input'];
};


export type MutationResetShareableEventIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationResetShareableHubIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRsvpArgs = {
  eventId: Scalars['ID']['input'];
  rsvp: Scalars['String']['input'];
};


export type MutationSendPasswordResetEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationSetHubNotStarredArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationSetHubStarredArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationUnblockUserArgs = {
  toUserId: Scalars['ID']['input'];
};


export type MutationUnmuteArgs = {
  hubId: Scalars['ID']['input'];
};


export type MutationUpdateEventArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDateTime?: InputMaybe<Scalars['String']['input']>;
  eventId: Scalars['ID']['input'];
  hubId?: InputMaybe<Scalars['String']['input']>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  locationLabel?: InputMaybe<Scalars['String']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  maximumCapacity?: InputMaybe<Scalars['Int']['input']>;
  minimumCapacity?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  startDateTime?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateHubArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  hubId: Scalars['ID']['input'];
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
  latitude: Scalars['Float']['input'];
  locationLabel?: InputMaybe<Scalars['String']['input']>;
  longitude: Scalars['Float']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  data?: InputMaybe<UpdateUserInput>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationUploadEventFilesArgs = {
  eventId: Scalars['ID']['input'];
  files?: InputMaybe<Array<Scalars['Upload']['input']>>;
};


export type MutationUploadHubFilesArgs = {
  files?: InputMaybe<Array<Scalars['Upload']['input']>>;
  hubId: Scalars['ID']['input'];
};

export type PageableOptions = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortOptions?: InputMaybe<SortOptions>;
};

export type PaginatedInAppNotificationsResponse = {
  __typename?: 'PaginatedInAppNotificationsResponse';
  items: Array<InAppNotification>;
  total: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  commonUsersHubs: Array<JoinUserHub>;
  event: JoinUserEvent;
  getInAppNotifications: Array<InAppNotification>;
  hub: JoinUserHub;
  invite: Invite;
  invitesByHub: Array<Invite>;
  invitesByUser: Array<Invite>;
  me?: Maybe<User>;
  memberOfHubs: Array<Hub>;
  myFileUploads?: Maybe<Array<FileUploadJoinUnion>>;
  ownedHubs: Array<Hub>;
  paginatedInAppNotifications: PaginatedInAppNotificationsResponse;
  searchHubByName: Array<Hub>;
  usersEvents: Array<JoinUserEvent>;
  usersHubs: Array<JoinUserHub>;
  usersPeople: Array<User>;
};


export type QueryCommonUsersHubsArgs = {
  otherUsersId: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHubArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInviteArgs = {
  hubId?: InputMaybe<Scalars['ID']['input']>;
  inviteId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryInvitesByHubArgs = {
  hubId: Scalars['ID']['input'];
  includeAccepted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryInvitesByUserArgs = {
  includeAccepted?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryPaginatedInAppNotificationsArgs = {
  pageableOptions?: InputMaybe<PageableOptions>;
};


export type QuerySearchHubByNameArgs = {
  search: Scalars['String']['input'];
};

export type SortOptions = {
  ascending: Scalars['Boolean']['input'];
  field: Scalars['String']['input'];
};

export type UpdateUserInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  /** string representation of unix timestamp */
  birthdate?: Maybe<Scalars['String']['output']>;
  blocked?: Maybe<Scalars['Boolean']['output']>;
  blocks?: Maybe<Array<Block>>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  /** unix timestamp for the last time the user was successfully authenticated */
  lastOnline?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<File>;
  shareableId: Scalars['String']['output'];
  userDevices?: Maybe<Array<UserDevice>>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UserDevice = {
  __typename?: 'UserDevice';
  fcmPushUserToken: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type UserInput = {
  /** string representation of unix timestamp */
  birthdate: Scalars['String']['input'];
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type AcceptHubInviteMutationVariables = Exact<{
  inviteId: Scalars['ID']['input'];
}>;


export type AcceptHubInviteMutation = { __typename?: 'Mutation', acceptHubInvite: { __typename?: 'JoinUserHub', userId: string, hubId: string, isOwner: boolean, starred: boolean, isPresent?: boolean | null, hub?: { __typename?: 'Hub', id: string, name: string, description?: string | null, active?: boolean | null, image?: string | null, latitude?: number | null, longitude?: number | null, microChats?: Array<{ __typename?: 'MicroChat', id: string, hubId: string, text: string }> | null } | null } };

export type ActivateHubMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type ActivateHubMutation = { __typename?: 'Mutation', activateHub: { __typename?: 'Hub', id: string, active?: boolean | null } };

export type AddUserFcmNotificationTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type AddUserFcmNotificationTokenMutation = { __typename?: 'Mutation', addUserFcmNotificationToken: boolean };

export type BlockUserMutationVariables = Exact<{
  toUserId: Scalars['ID']['input'];
}>;


export type BlockUserMutation = { __typename?: 'Mutation', blockUser: { __typename?: 'Block', from: { __typename?: 'User', id: string, firstName?: string | null }, to: { __typename?: 'User', id: string, firstName?: string | null } } };

export type ChangeEmailMutationVariables = Exact<{
  newEmail: Scalars['String']['input'];
}>;


export type ChangeEmailMutation = { __typename?: 'Mutation', changeEmail: { __typename?: 'User', id: string, email?: string | null } };

export type ChangeHubLocationMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
}>;


export type ChangeHubLocationMutation = { __typename?: 'Mutation', changeHubLocation: { __typename?: 'Hub', id: string, latitude?: number | null, longitude?: number | null } };

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type CreateEventMutationVariables = Exact<{
  name: Scalars['String']['input'];
  hubId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  startDateTime?: InputMaybe<Scalars['String']['input']>;
  endDateTime?: InputMaybe<Scalars['String']['input']>;
  minimumCapacity?: InputMaybe<Scalars['Int']['input']>;
  maximumCapacity?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  locationLabel?: InputMaybe<Scalars['String']['input']>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'JoinUserEvent', userId: string, eventId: string, rsvp?: string | null, lastGeofenceEvent?: string | null, lastUpdated?: string | null, user?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string } | null, event?: { __typename?: 'Event', id: string, name: string, description?: string | null, startDateTime?: string | null, endDateTime?: string | null, latitude?: number | null, longitude?: number | null, shareableId: string } | null } };

export type CreateHubMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  locationLabel?: InputMaybe<Scalars['String']['input']>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type CreateHubMutation = { __typename?: 'Mutation', createHub: { __typename?: 'JoinUserHub', userId: string, hubId: string, isOwner: boolean, starred: boolean, isPresent?: boolean | null, hub?: { __typename?: 'Hub', id: string, name: string, description?: string | null, active?: boolean | null, image?: string | null, latitude?: number | null, longitude?: number | null, usersConnection?: Array<{ __typename?: 'JoinUserHub', isPresent?: boolean | null, isOwner: boolean }> | null } | null } };

export type CreateMicroChatMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
  microChatText: Scalars['String']['input'];
}>;


export type CreateMicroChatMutation = { __typename?: 'Mutation', createMicroChat: { __typename?: 'MicroChat', id: string, text: string } };

export type DeactivateHubMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type DeactivateHubMutation = { __typename?: 'Mutation', deactivateHub: { __typename?: 'Hub', id: string, active?: boolean | null } };

export type DeleteAccountMutationVariables = Exact<{
  emailAddress: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: boolean };

export type DeleteAllInAppNotificationsMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAllInAppNotificationsMutation = { __typename?: 'Mutation', deleteAllInAppNotifications: boolean };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent: boolean };

export type DeleteFileByIdMutationVariables = Exact<{
  fileId: Scalars['ID']['input'];
}>;


export type DeleteFileByIdMutation = { __typename?: 'Mutation', deleteFileById: boolean };

export type DeleteHubMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteHubMutation = { __typename?: 'Mutation', deleteHub: boolean };

export type DeleteInAppNotificationMutationVariables = Exact<{
  inAppNotificationId: Scalars['ID']['input'];
}>;


export type DeleteInAppNotificationMutation = { __typename?: 'Mutation', deleteInAppNotification: boolean };

export type DeleteInviteMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
  inviteId: Scalars['ID']['input'];
}>;


export type DeleteInviteMutation = { __typename?: 'Mutation', deleteInvite: boolean };

export type DeleteMicroChatMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
  microChatId: Scalars['ID']['input'];
}>;


export type DeleteMicroChatMutation = { __typename?: 'Mutation', deleteMicroChat: boolean };

export type DwellEventGeofenceMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type DwellEventGeofenceMutation = { __typename?: 'Mutation', dwellEventGeofence: { __typename?: 'JoinUserEvent', userId: string, eventId: string, isPresent?: boolean | null } };

export type DwellHubGeofenceMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type DwellHubGeofenceMutation = { __typename?: 'Mutation', dwellHubGeofence: { __typename?: 'JoinUserHub', userId: string, hubId: string, isPresent?: boolean | null } };

export type EditHubMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type EditHubMutation = { __typename?: 'Mutation', editHub: { __typename?: 'Hub', id: string, name: string, description?: string | null } };

export type EditUserDetailsMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  description: Scalars['String']['input'];
}>;


export type EditUserDetailsMutation = { __typename?: 'Mutation', editUserDetails: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null } };

export type EnteredEventGeofenceMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type EnteredEventGeofenceMutation = { __typename?: 'Mutation', enteredEventGeofence: { __typename?: 'JoinUserEvent', userId: string, eventId: string, isPresent?: boolean | null } };

export type EnteredHubGeofenceMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type EnteredHubGeofenceMutation = { __typename?: 'Mutation', enteredHubGeofence: { __typename?: 'JoinUserHub', userId: string, hubId: string, isPresent?: boolean | null } };

export type ExitedEventGeofenceMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type ExitedEventGeofenceMutation = { __typename?: 'Mutation', exitedEventGeofence: { __typename?: 'JoinUserEvent', userId: string, eventId: string, isPresent?: boolean | null } };

export type ExitedHubGeofenceMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type ExitedHubGeofenceMutation = { __typename?: 'Mutation', exitedHubGeofence: { __typename?: 'JoinUserHub', userId: string, hubId: string, isPresent?: boolean | null } };

export type ExpeditedRegistrationMutationVariables = Exact<{ [key: string]: never; }>;


export type ExpeditedRegistrationMutation = { __typename?: 'Mutation', expeditedRegistration: { __typename?: 'ExpeditedRegistration', username: string, jwt: string, password: string } };

export type InviteUserToEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  inviteesEmail?: InputMaybe<Scalars['String']['input']>;
  inviteesShareableId?: InputMaybe<Scalars['String']['input']>;
}>;


export type InviteUserToEventMutation = { __typename?: 'Mutation', inviteUserToEvent: { __typename?: 'JoinUserEvent', userId: string, eventId: string, rsvp?: string | null, lastGeofenceEvent?: string | null, lastUpdated?: string | null, user?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string } | null, event?: { __typename?: 'Event', id: string, name: string, description?: string | null, startDateTime?: string | null, endDateTime?: string | null, latitude?: number | null, longitude?: number | null, shareableId: string } | null } };

export type InviteUserToHubMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
  inviteesEmail?: InputMaybe<Scalars['String']['input']>;
  inviteesShareableId?: InputMaybe<Scalars['String']['input']>;
}>;


export type InviteUserToHubMutation = { __typename?: 'Mutation', inviteUserToHub: { __typename?: 'Invite', id: string, invitersId: string, inviteesId: string, hubId: string, accepted: boolean, inviter?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null } | null, invitee?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null } | null, hub?: { __typename?: 'Hub', id: string, name: string } | null } };

export type LeaveHubMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type LeaveHubMutation = { __typename?: 'Mutation', leaveHub: boolean };

export type LoginMutationVariables = Exact<{
  password: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: string | null };

export type MicroChatToHubMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
  microChatId: Scalars['ID']['input'];
}>;


export type MicroChatToHubMutation = { __typename?: 'Mutation', microChatToHub: boolean };

export type MuteMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type MuteMutation = { __typename?: 'Mutation', mute: { __typename?: 'JoinUserHub', userId: string, hubId: string, muted: boolean, hub?: { __typename?: 'Hub', id: string } | null } };

export type RegisterMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  birthdate: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: string | null };

export type RemoveUserFromEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  otherUsersId: Scalars['ID']['input'];
}>;


export type RemoveUserFromEventMutation = { __typename?: 'Mutation', removeUserFromEvent: boolean };

export type RemoveUserFromHubMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
  otherUsersId: Scalars['ID']['input'];
}>;


export type RemoveUserFromHubMutation = { __typename?: 'Mutation', removeUserFromHub: boolean };

export type ReportEventAsInappropriateMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type ReportEventAsInappropriateMutation = { __typename?: 'Mutation', reportEventAsInappropriate: boolean };

export type ReportFileAsInappropriateMutationVariables = Exact<{
  fileId: Scalars['ID']['input'];
}>;


export type ReportFileAsInappropriateMutation = { __typename?: 'Mutation', reportFileAsInappropriate: boolean };

export type ReportHubAsInappropriateMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type ReportHubAsInappropriateMutation = { __typename?: 'Mutation', reportHubAsInappropriate: boolean };

export type ReportUserAsInappropriateMutationVariables = Exact<{
  toUserId: Scalars['ID']['input'];
}>;


export type ReportUserAsInappropriateMutation = { __typename?: 'Mutation', reportUserAsInappropriate: boolean };

export type ResetPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  resetPin: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type ResetShareableEventIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ResetShareableEventIdMutation = { __typename?: 'Mutation', resetShareableEventID: { __typename?: 'JoinUserEvent', userId: string, eventId: string, event?: { __typename?: 'Event', id: string, shareableId: string } | null } };

export type ResetShareableHubIdMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ResetShareableHubIdMutation = { __typename?: 'Mutation', resetShareableHubID: { __typename?: 'JoinUserHub', userId: string, hubId: string, hub?: { __typename?: 'Hub', id: string, shareableId: string } | null } };

export type RsvpMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  rsvp: Scalars['String']['input'];
}>;


export type RsvpMutation = { __typename?: 'Mutation', rsvp: { __typename?: 'JoinUserEvent', userId: string, eventId: string, rsvp?: string | null } };

export type SendPasswordResetEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendPasswordResetEmailMutation = { __typename?: 'Mutation', sendPasswordResetEmail: boolean };

export type SetHubNotStarredMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type SetHubNotStarredMutation = { __typename?: 'Mutation', setHubNotStarred: boolean };

export type SetHubStarredMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type SetHubStarredMutation = { __typename?: 'Mutation', setHubStarred: boolean };

export type UnblockUserMutationVariables = Exact<{
  toUserId: Scalars['ID']['input'];
}>;


export type UnblockUserMutation = { __typename?: 'Mutation', unblockUser: { __typename?: 'Block', from: { __typename?: 'User', id: string, firstName?: string | null }, to: { __typename?: 'User', id: string, firstName?: string | null } } };

export type UnmuteMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type UnmuteMutation = { __typename?: 'Mutation', unmute: { __typename?: 'JoinUserHub', userId: string, hubId: string, muted: boolean, hub?: { __typename?: 'Hub', id: string } | null } };

export type UpdateEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  startDateTime?: InputMaybe<Scalars['String']['input']>;
  endDateTime?: InputMaybe<Scalars['String']['input']>;
  minimumCapacity?: InputMaybe<Scalars['Int']['input']>;
  maximumCapacity?: InputMaybe<Scalars['Int']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  locationLabel?: InputMaybe<Scalars['String']['input']>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
  hubId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent: { __typename?: 'Event', id: string, name: string, image?: string | null, description?: string | null, startDateTime?: string | null, endDateTime?: string | null, latitude?: number | null, longitude?: number | null, locationLabel?: string | null, shareableId: string, createdBy?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string } | null, usersConnection?: Array<{ __typename?: 'JoinUserEvent', rsvp?: string | null, lastGeofenceEvent?: string | null, lastUpdated?: string | null, isPresent?: boolean | null, user?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, lastOnline?: string | null, blocked?: boolean | null } | null }> | null } };

export type UpdateHubMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  locationLabel?: InputMaybe<Scalars['String']['input']>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type UpdateHubMutation = { __typename?: 'Mutation', updateHub: { __typename?: 'Hub', id: string, name: string, description?: string | null, active?: boolean | null, image?: string | null, latitude?: number | null, longitude?: number | null, usersConnection?: Array<{ __typename?: 'JoinUserHub', isPresent?: boolean | null, isOwner: boolean }> | null } };

export type UpdateUserMutationVariables = Exact<{
  data?: InputMaybe<UpdateUserInput>;
  imageFile?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, phoneNumber?: string | null, shareableId: string } };

export type UploadEventFilesMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  files?: InputMaybe<Array<Scalars['Upload']['input']> | Scalars['Upload']['input']>;
}>;


export type UploadEventFilesMutation = { __typename?: 'Mutation', uploadEventFiles: { __typename?: 'JoinUserEvent', userId: string, eventId: string, event?: { __typename?: 'Event', id: string, name: string, fileUploads?: Array<{ __typename?: 'JoinEventFile', fileId: string, eventId: string, approvedByUserId?: string | null, file: { __typename?: 'File', id: string, createdOn: string, url?: string | null, shareableId: string, createdBy: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string } }, approvedBy?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string } | null }> | null } | null } };

export type UploadHubFilesMutationVariables = Exact<{
  hubId: Scalars['ID']['input'];
  files?: InputMaybe<Array<Scalars['Upload']['input']> | Scalars['Upload']['input']>;
}>;


export type UploadHubFilesMutation = { __typename?: 'Mutation', uploadHubFiles: { __typename?: 'JoinUserHub', userId: string, hubId: string, hub?: { __typename?: 'Hub', id: string, name: string, fileUploads?: Array<{ __typename?: 'JoinHubFile', fileId: string, hubId: string, approvedByUserId?: string | null, file: { __typename?: 'File', id: string, createdOn: string, url?: string | null, shareableId: string, createdBy: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string } }, approvedBy?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string } | null }> | null } | null } };

export type CommonUsersHubsQueryVariables = Exact<{
  otherUsersId: Scalars['ID']['input'];
}>;


export type CommonUsersHubsQuery = { __typename?: 'Query', commonUsersHubs: Array<{ __typename?: 'JoinUserHub', userId: string, hubId: string, isOwner: boolean, starred: boolean, isPresent?: boolean | null, hub?: { __typename?: 'Hub', id: string, name: string, active?: boolean | null, image?: string | null, latitude?: number | null, longitude?: number | null, usersConnection?: Array<{ __typename?: 'JoinUserHub', isPresent?: boolean | null, isOwner: boolean }> | null } | null }> };

export type EventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EventQuery = { __typename?: 'Query', event: { __typename?: 'JoinUserEvent', userId: string, eventId: string, rsvp?: string | null, lastGeofenceEvent?: string | null, lastUpdated?: string | null, isPresent?: boolean | null, user?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string, phoneNumber?: string | null } | null, event?: { __typename?: 'Event', id: string, name: string, image?: string | null, description?: string | null, startDateTime?: string | null, endDateTime?: string | null, minimumCapacity?: number | null, maximumCapacity?: number | null, latitude?: number | null, longitude?: number | null, locationLabel?: string | null, shareableId: string, createdBy?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string, phoneNumber?: string | null } | null, hub?: { __typename?: 'Hub', id: string, name: string, description?: string | null, active?: boolean | null, image?: string | null, latitude?: number | null, longitude?: number | null, locationLabel?: string | null, usersConnection?: Array<{ __typename?: 'JoinUserHub', isPresent?: boolean | null, isOwner: boolean }> | null } | null, fileUploads?: Array<{ __typename?: 'JoinEventFile', fileId: string, eventId: string, approvedByUserId?: string | null, approved: boolean, file: { __typename?: 'File', id: string, fileName: string, createdOn: string, url?: string | null, createdBy: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, shareableId: string, image?: string | null, lastOnline?: string | null, phoneNumber?: string | null, email?: string | null } }, approvedBy?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, shareableId: string } | null }> | null, usersConnection?: Array<{ __typename?: 'JoinUserEvent', rsvp?: string | null, lastGeofenceEvent?: string | null, lastUpdated?: string | null, isPresent?: boolean | null, user?: { __typename?: 'User', id: string, shareableId: string, firstName?: string | null, lastName?: string | null, username?: string | null, description?: string | null, image?: string | null, lastOnline?: string | null, blocked?: boolean | null, phoneNumber?: string | null } | null }> | null } | null } };

export type HubQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type HubQuery = { __typename?: 'Query', hub: { __typename?: 'JoinUserHub', userId: string, hubId: string, isOwner: boolean, starred: boolean, muted: boolean, isPresent?: boolean | null, hub?: { __typename?: 'Hub', id: string, name: string, description?: string | null, active?: boolean | null, image?: string | null, latitude?: number | null, longitude?: number | null, locationLabel?: string | null, shareableId: string, fileUploads?: Array<{ __typename?: 'JoinHubFile', fileId: string, hubId: string, approvedByUserId?: string | null, approved: boolean, file: { __typename?: 'File', id: string, fileName: string, createdOn: string, url?: string | null, createdBy: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, shareableId: string, image?: string | null, lastOnline?: string | null, phoneNumber?: string | null, email?: string | null } }, approvedBy?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, shareableId: string } | null }> | null, usersConnection?: Array<{ __typename?: 'JoinUserHub', isOwner: boolean, isPresent?: boolean | null, user?: { __typename?: 'User', id: string, shareableId: string, firstName?: string | null, lastName?: string | null, username?: string | null, description?: string | null, image?: string | null, lastOnline?: string | null, blocked?: boolean | null, phoneNumber?: string | null } | null }> | null, events?: Array<{ __typename?: 'Event', id: string, name: string, image?: string | null, description?: string | null, startDateTime?: string | null, endDateTime?: string | null, latitude?: number | null, longitude?: number | null, shareableId: string, createdBy?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string, phoneNumber?: string | null } | null }> | null, microChats?: Array<{ __typename?: 'MicroChat', id: string, text: string }> | null } | null } };

export type InviteQueryVariables = Exact<{
  inviteId: Scalars['ID']['input'];
}>;


export type InviteQuery = { __typename?: 'Query', invite: { __typename?: 'Invite', id: string, invitersId: string, inviteesId: string, hubId: string, accepted: boolean, inviter?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null } | null, hub?: { __typename?: 'Hub', id: string, name: string, description?: string | null, active?: boolean | null, image?: string | null, latitude?: number | null, longitude?: number | null, locationLabel?: string | null } | null } };

export type InvitesByHubQueryVariables = Exact<{
  hubId: Scalars['ID']['input'];
}>;


export type InvitesByHubQuery = { __typename?: 'Query', invitesByHub: Array<{ __typename?: 'Invite', id: string, invitersId: string, inviteesId: string, hubId: string, accepted: boolean, inviter?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, image?: string | null } | null, invitee?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, image?: string | null } | null, hub?: { __typename?: 'Hub', id: string } | null }> };

export type InvitesByUserQueryVariables = Exact<{ [key: string]: never; }>;


export type InvitesByUserQuery = { __typename?: 'Query', invitesByUser: Array<{ __typename?: 'Invite', id: string, invitersId: string, inviteesId: string, hubId: string, accepted: boolean, inviter?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null } | null, hub?: { __typename?: 'Hub', id: string, name: string, description?: string | null, active?: boolean | null, image?: string | null, latitude?: number | null, longitude?: number | null, usersConnection?: Array<{ __typename?: 'JoinUserHub', isPresent?: boolean | null }> | null } | null }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, username?: string | null, description?: string | null, image?: string | null, email?: string | null, phoneNumber?: string | null, shareableId: string, blocks?: Array<{ __typename?: 'Block', from: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string }, to: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string } }> | null } | null };

export type MyFileUploadsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyFileUploadsQuery = { __typename?: 'Query', myFileUploads?: Array<{ __typename?: 'JoinEventFile', fileId: string, eventId: string, approvedByUserId?: string | null, approved: boolean, file: { __typename?: 'File', id: string, createdBy: { __typename?: 'User', id: string, shareableId: string, firstName?: string | null, lastName?: string | null, profileImage?: { __typename?: 'File', url?: string | null } | null } }, event: { __typename?: 'Event', name: string }, approvedBy?: { __typename?: 'User', username?: string | null } | null } | { __typename?: 'JoinHubFile', fileId: string, hubId: string, approvedByUserId?: string | null, approved: boolean, file: { __typename?: 'File', id: string, shareableId: string, fileName: string, mimetype?: string | null, createdOn: string, url?: string | null, createdBy: { __typename?: 'User', id: string, shareableId: string, firstName?: string | null, lastName?: string | null, profileImage?: { __typename?: 'File', url?: string | null } | null } }, hub: { __typename?: 'Hub', name: string }, approvedBy?: { __typename?: 'User', username?: string | null } | null }> | null };

export type PaginatedInAppNotifcationsQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  field: Scalars['String']['input'];
  ascending: Scalars['Boolean']['input'];
}>;


export type PaginatedInAppNotifcationsQuery = { __typename?: 'Query', paginatedInAppNotifications: { __typename?: 'PaginatedInAppNotificationsResponse', total: number, items: Array<{ __typename?: 'InAppNotification', id: string, userId: string, header?: string | null, text: string, date: string, actionLink?: string | null, thumbnail?: string | null }> } };

export type UserEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserEventsQuery = { __typename?: 'Query', usersEvents: Array<{ __typename?: 'JoinUserEvent', userId: string, eventId: string, rsvp?: string | null, lastGeofenceEvent?: string | null, lastUpdated?: string | null, isPresent?: boolean | null, user?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string } | null, event?: { __typename?: 'Event', id: string, name: string, image?: string | null, description?: string | null, startDateTime?: string | null, endDateTime?: string | null, minimumCapacity?: number | null, maximumCapacity?: number | null, latitude?: number | null, longitude?: number | null, shareableId: string, createdBy?: { __typename?: 'User', id: string, firstName?: string | null, lastName?: string | null, description?: string | null, image?: string | null, email?: string | null, shareableId: string, phoneNumber?: string | null } | null, hub?: { __typename?: 'Hub', id: string, name: string, description?: string | null, active?: boolean | null, image?: string | null, latitude?: number | null, longitude?: number | null, locationLabel?: string | null, usersConnection?: Array<{ __typename?: 'JoinUserHub', userId: string, isPresent?: boolean | null, isOwner: boolean }> | null } | null, usersConnection?: Array<{ __typename?: 'JoinUserEvent', userId: string, rsvp?: string | null, lastGeofenceEvent?: string | null, lastUpdated?: string | null, isPresent?: boolean | null, user?: { __typename?: 'User', id: string, shareableId: string, firstName?: string | null, lastName?: string | null, username?: string | null, email?: string | null, image?: string | null } | null }> | null } | null }> };

export type UsersHubsQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersHubsQuery = { __typename?: 'Query', usersHubs: Array<{ __typename?: 'JoinUserHub', userId: string, hubId: string, isOwner: boolean, starred: boolean, muted: boolean, isPresent?: boolean | null, hub?: { __typename?: 'Hub', id: string, name: string, description?: string | null, active?: boolean | null, image?: string | null, latitude?: number | null, longitude?: number | null, locationLabel?: string | null, usersConnection?: Array<{ __typename?: 'JoinUserHub', userId: string, isPresent?: boolean | null, isOwner: boolean, user?: { __typename?: 'User', id: string, shareableId: string, firstName?: string | null, lastName?: string | null, username?: string | null, email?: string | null, image?: string | null } | null }> | null } | null }> };

export type UsersPeopleQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersPeopleQuery = { __typename?: 'Query', usersPeople: Array<{ __typename?: 'User', id: string, shareableId: string, firstName?: string | null, lastName?: string | null, username?: string | null, email?: string | null, description?: string | null, image?: string | null, lastOnline?: string | null, blocked?: boolean | null, phoneNumber?: string | null }> };

export const AcceptHubInviteDocument = gql`
    mutation acceptHubInvite($inviteId: ID!) {
  acceptHubInvite(inviteId: $inviteId) {
    userId
    hubId
    isOwner
    starred
    isPresent
    hub {
      id
      name
      description
      active
      image
      latitude
      longitude
      microChats {
        id
        hubId
        text
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AcceptHubInviteGQL extends Apollo.Mutation<AcceptHubInviteMutation, AcceptHubInviteMutationVariables> {
    document = AcceptHubInviteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ActivateHubDocument = gql`
    mutation activateHub($hubId: ID!) {
  activateHub(hubId: $hubId) {
    id
    active
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ActivateHubGQL extends Apollo.Mutation<ActivateHubMutation, ActivateHubMutationVariables> {
    document = ActivateHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddUserFcmNotificationTokenDocument = gql`
    mutation addUserFcmNotificationToken($token: String!) {
  addUserFcmNotificationToken(token: $token)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddUserFcmNotificationTokenGQL extends Apollo.Mutation<AddUserFcmNotificationTokenMutation, AddUserFcmNotificationTokenMutationVariables> {
    document = AddUserFcmNotificationTokenDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const BlockUserDocument = gql`
    mutation blockUser($toUserId: ID!) {
  blockUser(toUserId: $toUserId) {
    from {
      id
      firstName
    }
    to {
      id
      firstName
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class BlockUserGQL extends Apollo.Mutation<BlockUserMutation, BlockUserMutationVariables> {
    document = BlockUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangeEmailDocument = gql`
    mutation changeEmail($newEmail: String!) {
  changeEmail(newEmail: $newEmail) {
    id
    email
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangeEmailGQL extends Apollo.Mutation<ChangeEmailMutation, ChangeEmailMutationVariables> {
    document = ChangeEmailDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangeHubLocationDocument = gql`
    mutation changeHubLocation($hubId: ID!, $latitude: Float!, $longitude: Float!) {
  changeHubLocation(hubId: $hubId, latitude: $latitude, longitude: $longitude) {
    id
    latitude
    longitude
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangeHubLocationGQL extends Apollo.Mutation<ChangeHubLocationMutation, ChangeHubLocationMutationVariables> {
    document = ChangeHubLocationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangePasswordDocument = gql`
    mutation changePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangePasswordGQL extends Apollo.Mutation<ChangePasswordMutation, ChangePasswordMutationVariables> {
    document = ChangePasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateEventDocument = gql`
    mutation createEvent($name: String!, $hubId: String, $description: String, $startDateTime: String, $endDateTime: String, $minimumCapacity: Int, $maximumCapacity: Int, $latitude: Float, $longitude: Float, $locationLabel: String, $imageFile: Upload) {
  createEvent(
    name: $name
    hubId: $hubId
    description: $description
    startDateTime: $startDateTime
    endDateTime: $endDateTime
    minimumCapacity: $minimumCapacity
    maximumCapacity: $maximumCapacity
    latitude: $latitude
    longitude: $longitude
    locationLabel: $locationLabel
    imageFile: $imageFile
  ) {
    userId
    eventId
    user {
      id
      firstName
      lastName
      description
      image
      email
      shareableId
    }
    event {
      id
      name
      description
      startDateTime
      endDateTime
      latitude
      longitude
      shareableId
    }
    rsvp
    lastGeofenceEvent
    lastUpdated
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateEventGQL extends Apollo.Mutation<CreateEventMutation, CreateEventMutationVariables> {
    document = CreateEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateHubDocument = gql`
    mutation createHub($name: String!, $description: String, $latitude: Float!, $longitude: Float!, $locationLabel: String, $imageFile: Upload) {
  createHub(
    name: $name
    description: $description
    latitude: $latitude
    longitude: $longitude
    locationLabel: $locationLabel
    imageFile: $imageFile
  ) {
    userId
    hubId
    isOwner
    starred
    isPresent
    hub {
      id
      name
      description
      active
      image
      latitude
      longitude
      usersConnection {
        isPresent
        isOwner
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateHubGQL extends Apollo.Mutation<CreateHubMutation, CreateHubMutationVariables> {
    document = CreateHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateMicroChatDocument = gql`
    mutation createMicroChat($hubId: ID!, $microChatText: String!) {
  createMicroChat(hubId: $hubId, microChatText: $microChatText) {
    id
    text
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateMicroChatGQL extends Apollo.Mutation<CreateMicroChatMutation, CreateMicroChatMutationVariables> {
    document = CreateMicroChatDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeactivateHubDocument = gql`
    mutation deactivateHub($hubId: ID!) {
  deactivateHub(hubId: $hubId) {
    id
    active
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeactivateHubGQL extends Apollo.Mutation<DeactivateHubMutation, DeactivateHubMutationVariables> {
    document = DeactivateHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteAccountDocument = gql`
    mutation deleteAccount($emailAddress: String!, $password: String!) {
  deleteAccount(email: $emailAddress, password: $password)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteAccountGQL extends Apollo.Mutation<DeleteAccountMutation, DeleteAccountMutationVariables> {
    document = DeleteAccountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteAllInAppNotificationsDocument = gql`
    mutation deleteAllInAppNotifications {
  deleteAllInAppNotifications
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteAllInAppNotificationsGQL extends Apollo.Mutation<DeleteAllInAppNotificationsMutation, DeleteAllInAppNotificationsMutationVariables> {
    document = DeleteAllInAppNotificationsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteEventDocument = gql`
    mutation deleteEvent($id: ID!) {
  deleteEvent(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteEventGQL extends Apollo.Mutation<DeleteEventMutation, DeleteEventMutationVariables> {
    document = DeleteEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteFileByIdDocument = gql`
    mutation deleteFileById($fileId: ID!) {
  deleteFileById(fileId: $fileId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteFileByIdGQL extends Apollo.Mutation<DeleteFileByIdMutation, DeleteFileByIdMutationVariables> {
    document = DeleteFileByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteHubDocument = gql`
    mutation deleteHub($id: ID!) {
  deleteHub(hubId: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteHubGQL extends Apollo.Mutation<DeleteHubMutation, DeleteHubMutationVariables> {
    document = DeleteHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteInAppNotificationDocument = gql`
    mutation deleteInAppNotification($inAppNotificationId: ID!) {
  deleteInAppNotification(inAppNotificationId: $inAppNotificationId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteInAppNotificationGQL extends Apollo.Mutation<DeleteInAppNotificationMutation, DeleteInAppNotificationMutationVariables> {
    document = DeleteInAppNotificationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteInviteDocument = gql`
    mutation deleteInvite($hubId: ID!, $inviteId: ID!) {
  deleteInvite(hubId: $hubId, inviteId: $inviteId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteInviteGQL extends Apollo.Mutation<DeleteInviteMutation, DeleteInviteMutationVariables> {
    document = DeleteInviteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteMicroChatDocument = gql`
    mutation deleteMicroChat($hubId: ID!, $microChatId: ID!) {
  deleteMicroChat(hubId: $hubId, microChatId: $microChatId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteMicroChatGQL extends Apollo.Mutation<DeleteMicroChatMutation, DeleteMicroChatMutationVariables> {
    document = DeleteMicroChatDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DwellEventGeofenceDocument = gql`
    mutation dwellEventGeofence($eventId: ID!) {
  dwellEventGeofence(eventId: $eventId) {
    userId
    eventId
    isPresent
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DwellEventGeofenceGQL extends Apollo.Mutation<DwellEventGeofenceMutation, DwellEventGeofenceMutationVariables> {
    document = DwellEventGeofenceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DwellHubGeofenceDocument = gql`
    mutation dwellHubGeofence($hubId: ID!) {
  dwellHubGeofence(hubId: $hubId) {
    userId
    hubId
    isPresent
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DwellHubGeofenceGQL extends Apollo.Mutation<DwellHubGeofenceMutation, DwellHubGeofenceMutationVariables> {
    document = DwellHubGeofenceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EditHubDocument = gql`
    mutation editHub($hubId: ID!, $name: String!, $description: String) {
  editHub(hubId: $hubId, name: $name, description: $description) {
    id
    name
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class EditHubGQL extends Apollo.Mutation<EditHubMutation, EditHubMutationVariables> {
    document = EditHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EditUserDetailsDocument = gql`
    mutation editUserDetails($firstName: String!, $lastName: String!, $description: String!) {
  editUserDetails(
    firstName: $firstName
    lastName: $lastName
    description: $description
  ) {
    id
    firstName
    lastName
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class EditUserDetailsGQL extends Apollo.Mutation<EditUserDetailsMutation, EditUserDetailsMutationVariables> {
    document = EditUserDetailsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EnteredEventGeofenceDocument = gql`
    mutation enteredEventGeofence($eventId: ID!) {
  enteredEventGeofence(eventId: $eventId) {
    userId
    eventId
    isPresent
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class EnteredEventGeofenceGQL extends Apollo.Mutation<EnteredEventGeofenceMutation, EnteredEventGeofenceMutationVariables> {
    document = EnteredEventGeofenceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EnteredHubGeofenceDocument = gql`
    mutation enteredHubGeofence($hubId: ID!) {
  enteredHubGeofence(hubId: $hubId) {
    userId
    hubId
    isPresent
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class EnteredHubGeofenceGQL extends Apollo.Mutation<EnteredHubGeofenceMutation, EnteredHubGeofenceMutationVariables> {
    document = EnteredHubGeofenceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ExitedEventGeofenceDocument = gql`
    mutation exitedEventGeofence($eventId: ID!) {
  exitedEventGeofence(eventId: $eventId) {
    userId
    eventId
    isPresent
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ExitedEventGeofenceGQL extends Apollo.Mutation<ExitedEventGeofenceMutation, ExitedEventGeofenceMutationVariables> {
    document = ExitedEventGeofenceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ExitedHubGeofenceDocument = gql`
    mutation exitedHubGeofence($hubId: ID!) {
  exitedHubGeofence(hubId: $hubId) {
    userId
    hubId
    isPresent
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ExitedHubGeofenceGQL extends Apollo.Mutation<ExitedHubGeofenceMutation, ExitedHubGeofenceMutationVariables> {
    document = ExitedHubGeofenceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ExpeditedRegistrationDocument = gql`
    mutation expeditedRegistration {
  expeditedRegistration {
    username
    jwt
    password
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ExpeditedRegistrationGQL extends Apollo.Mutation<ExpeditedRegistrationMutation, ExpeditedRegistrationMutationVariables> {
    document = ExpeditedRegistrationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InviteUserToEventDocument = gql`
    mutation inviteUserToEvent($eventId: ID!, $inviteesEmail: String, $inviteesShareableId: String) {
  inviteUserToEvent(
    eventId: $eventId
    inviteesEmail: $inviteesEmail
    inviteesShareableId: $inviteesShareableId
  ) {
    userId
    eventId
    user {
      id
      firstName
      lastName
      description
      image
      email
      shareableId
    }
    event {
      id
      name
      description
      startDateTime
      endDateTime
      latitude
      longitude
      shareableId
    }
    rsvp
    lastGeofenceEvent
    lastUpdated
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InviteUserToEventGQL extends Apollo.Mutation<InviteUserToEventMutation, InviteUserToEventMutationVariables> {
    document = InviteUserToEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InviteUserToHubDocument = gql`
    mutation inviteUserToHub($hubId: ID!, $inviteesEmail: String, $inviteesShareableId: String) {
  inviteUserToHub(
    hubId: $hubId
    inviteesEmail: $inviteesEmail
    inviteesShareableId: $inviteesShareableId
  ) {
    id
    invitersId
    inviteesId
    hubId
    accepted
    inviter {
      id
      firstName
      lastName
    }
    invitee {
      id
      firstName
      lastName
    }
    hub {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InviteUserToHubGQL extends Apollo.Mutation<InviteUserToHubMutation, InviteUserToHubMutationVariables> {
    document = InviteUserToHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LeaveHubDocument = gql`
    mutation leaveHub($hubId: ID!) {
  leaveHub(hubId: $hubId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LeaveHubGQL extends Apollo.Mutation<LeaveHubMutation, LeaveHubMutationVariables> {
    document = LeaveHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginDocument = gql`
    mutation login($password: String!, $email: String!) {
  login(password: $password, email: $email)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MicroChatToHubDocument = gql`
    mutation microChatToHub($hubId: ID!, $microChatId: ID!) {
  microChatToHub(hubId: $hubId, microChatId: $microChatId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MicroChatToHubGQL extends Apollo.Mutation<MicroChatToHubMutation, MicroChatToHubMutationVariables> {
    document = MicroChatToHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MuteDocument = gql`
    mutation mute($hubId: ID!) {
  mute(hubId: $hubId) {
    userId
    hubId
    muted
    hub {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MuteGQL extends Apollo.Mutation<MuteMutation, MuteMutationVariables> {
    document = MuteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RegisterDocument = gql`
    mutation register($firstName: String!, $lastName: String!, $birthdate: String!, $email: String!, $password: String!, $phoneNumber: String) {
  register(
    data: {firstName: $firstName, lastName: $lastName, birthdate: $birthdate, email: $email, password: $password, phoneNumber: $phoneNumber}
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterGQL extends Apollo.Mutation<RegisterMutation, RegisterMutationVariables> {
    document = RegisterDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveUserFromEventDocument = gql`
    mutation removeUserFromEvent($eventId: ID!, $otherUsersId: ID!) {
  removeUserFromEvent(eventId: $eventId, otherUsersId: $otherUsersId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveUserFromEventGQL extends Apollo.Mutation<RemoveUserFromEventMutation, RemoveUserFromEventMutationVariables> {
    document = RemoveUserFromEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveUserFromHubDocument = gql`
    mutation removeUserFromHub($hubId: ID!, $otherUsersId: ID!) {
  removeUserFromHub(hubId: $hubId, otherUsersId: $otherUsersId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveUserFromHubGQL extends Apollo.Mutation<RemoveUserFromHubMutation, RemoveUserFromHubMutationVariables> {
    document = RemoveUserFromHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ReportEventAsInappropriateDocument = gql`
    mutation reportEventAsInappropriate($eventId: ID!) {
  reportEventAsInappropriate(eventId: $eventId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ReportEventAsInappropriateGQL extends Apollo.Mutation<ReportEventAsInappropriateMutation, ReportEventAsInappropriateMutationVariables> {
    document = ReportEventAsInappropriateDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ReportFileAsInappropriateDocument = gql`
    mutation reportFileAsInappropriate($fileId: ID!) {
  reportFileAsInappropriate(fileId: $fileId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ReportFileAsInappropriateGQL extends Apollo.Mutation<ReportFileAsInappropriateMutation, ReportFileAsInappropriateMutationVariables> {
    document = ReportFileAsInappropriateDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ReportHubAsInappropriateDocument = gql`
    mutation reportHubAsInappropriate($hubId: ID!) {
  reportHubAsInappropriate(hubId: $hubId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ReportHubAsInappropriateGQL extends Apollo.Mutation<ReportHubAsInappropriateMutation, ReportHubAsInappropriateMutationVariables> {
    document = ReportHubAsInappropriateDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ReportUserAsInappropriateDocument = gql`
    mutation reportUserAsInappropriate($toUserId: ID!) {
  reportUserAsInappropriate(toUserId: $toUserId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ReportUserAsInappropriateGQL extends Apollo.Mutation<ReportUserAsInappropriateMutation, ReportUserAsInappropriateMutationVariables> {
    document = ReportUserAsInappropriateDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ResetPasswordDocument = gql`
    mutation resetPassword($email: String!, $newPassword: String!, $resetPin: String!) {
  resetPassword(
    usersEmail: $email
    newPassword: $newPassword
    resetPin: $resetPin
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ResetPasswordGQL extends Apollo.Mutation<ResetPasswordMutation, ResetPasswordMutationVariables> {
    document = ResetPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ResetShareableEventIdDocument = gql`
    mutation resetShareableEventID($id: ID!) {
  resetShareableEventID(id: $id) {
    userId
    eventId
    event {
      id
      shareableId
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ResetShareableEventIdGQL extends Apollo.Mutation<ResetShareableEventIdMutation, ResetShareableEventIdMutationVariables> {
    document = ResetShareableEventIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ResetShareableHubIdDocument = gql`
    mutation resetShareableHubID($id: ID!) {
  resetShareableHubID(id: $id) {
    userId
    hubId
    hub {
      id
      shareableId
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ResetShareableHubIdGQL extends Apollo.Mutation<ResetShareableHubIdMutation, ResetShareableHubIdMutationVariables> {
    document = ResetShareableHubIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RsvpDocument = gql`
    mutation rsvp($eventId: ID!, $rsvp: String!) {
  rsvp(eventId: $eventId, rsvp: $rsvp) {
    userId
    eventId
    rsvp
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RsvpGQL extends Apollo.Mutation<RsvpMutation, RsvpMutationVariables> {
    document = RsvpDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SendPasswordResetEmailDocument = gql`
    mutation sendPasswordResetEmail($email: String!) {
  sendPasswordResetEmail(email: $email)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SendPasswordResetEmailGQL extends Apollo.Mutation<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables> {
    document = SendPasswordResetEmailDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetHubNotStarredDocument = gql`
    mutation setHubNotStarred($hubId: ID!) {
  setHubNotStarred(hubId: $hubId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SetHubNotStarredGQL extends Apollo.Mutation<SetHubNotStarredMutation, SetHubNotStarredMutationVariables> {
    document = SetHubNotStarredDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetHubStarredDocument = gql`
    mutation setHubStarred($hubId: ID!) {
  setHubStarred(hubId: $hubId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SetHubStarredGQL extends Apollo.Mutation<SetHubStarredMutation, SetHubStarredMutationVariables> {
    document = SetHubStarredDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UnblockUserDocument = gql`
    mutation unblockUser($toUserId: ID!) {
  unblockUser(toUserId: $toUserId) {
    from {
      id
      firstName
    }
    to {
      id
      firstName
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UnblockUserGQL extends Apollo.Mutation<UnblockUserMutation, UnblockUserMutationVariables> {
    document = UnblockUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UnmuteDocument = gql`
    mutation unmute($hubId: ID!) {
  unmute(hubId: $hubId) {
    userId
    hubId
    muted
    hub {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UnmuteGQL extends Apollo.Mutation<UnmuteMutation, UnmuteMutationVariables> {
    document = UnmuteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateEventDocument = gql`
    mutation updateEvent($eventId: ID!, $name: String!, $description: String, $startDateTime: String, $endDateTime: String, $minimumCapacity: Int, $maximumCapacity: Int, $latitude: Float, $longitude: Float, $locationLabel: String, $imageFile: Upload, $hubId: String) {
  updateEvent(
    eventId: $eventId
    name: $name
    description: $description
    startDateTime: $startDateTime
    endDateTime: $endDateTime
    minimumCapacity: $minimumCapacity
    maximumCapacity: $maximumCapacity
    latitude: $latitude
    longitude: $longitude
    locationLabel: $locationLabel
    imageFile: $imageFile
    hubId: $hubId
  ) {
    id
    createdBy {
      id
      firstName
      lastName
      description
      image
      email
      shareableId
    }
    name
    image
    description
    startDateTime
    endDateTime
    latitude
    longitude
    locationLabel
    shareableId
    usersConnection {
      user {
        id
        firstName
        lastName
        description
        image
        lastOnline
        blocked
      }
      rsvp
      lastGeofenceEvent
      lastUpdated
      isPresent
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateEventGQL extends Apollo.Mutation<UpdateEventMutation, UpdateEventMutationVariables> {
    document = UpdateEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateHubDocument = gql`
    mutation updateHub($hubId: ID!, $name: String!, $description: String, $latitude: Float!, $longitude: Float!, $locationLabel: String, $imageFile: Upload) {
  updateHub(
    hubId: $hubId
    name: $name
    description: $description
    latitude: $latitude
    longitude: $longitude
    locationLabel: $locationLabel
    imageFile: $imageFile
  ) {
    id
    name
    description
    active
    image
    latitude
    longitude
    usersConnection {
      isPresent
      isOwner
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateHubGQL extends Apollo.Mutation<UpdateHubMutation, UpdateHubMutationVariables> {
    document = UpdateHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateUserDocument = gql`
    mutation updateUser($data: UpdateUserInput, $imageFile: Upload) {
  updateUser(data: $data, imageFile: $imageFile) {
    id
    firstName
    lastName
    description
    image
    email
    phoneNumber
    shareableId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateUserGQL extends Apollo.Mutation<UpdateUserMutation, UpdateUserMutationVariables> {
    document = UpdateUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UploadEventFilesDocument = gql`
    mutation uploadEventFiles($eventId: ID!, $files: [Upload!]) {
  uploadEventFiles(eventId: $eventId, files: $files) {
    userId
    eventId
    event {
      id
      name
      fileUploads {
        fileId
        eventId
        approvedByUserId
        file {
          id
          createdOn
          url
          shareableId
          createdBy {
            id
            firstName
            lastName
            description
            image
            email
            shareableId
          }
        }
        approvedBy {
          id
          firstName
          lastName
          description
          image
          email
          shareableId
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UploadEventFilesGQL extends Apollo.Mutation<UploadEventFilesMutation, UploadEventFilesMutationVariables> {
    document = UploadEventFilesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UploadHubFilesDocument = gql`
    mutation uploadHubFiles($hubId: ID!, $files: [Upload!]) {
  uploadHubFiles(hubId: $hubId, files: $files) {
    userId
    hubId
    hub {
      id
      name
      fileUploads {
        fileId
        hubId
        approvedByUserId
        file {
          id
          createdOn
          url
          shareableId
          createdBy {
            id
            firstName
            lastName
            description
            image
            email
            shareableId
          }
        }
        approvedBy {
          id
          firstName
          lastName
          description
          image
          email
          shareableId
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UploadHubFilesGQL extends Apollo.Mutation<UploadHubFilesMutation, UploadHubFilesMutationVariables> {
    document = UploadHubFilesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CommonUsersHubsDocument = gql`
    query commonUsersHubs($otherUsersId: ID!) {
  commonUsersHubs(otherUsersId: $otherUsersId) {
    userId
    hubId
    isOwner
    starred
    isPresent
    hub {
      id
      name
      active
      image
      latitude
      longitude
      usersConnection {
        isPresent
        isOwner
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CommonUsersHubsGQL extends Apollo.Query<CommonUsersHubsQuery, CommonUsersHubsQueryVariables> {
    document = CommonUsersHubsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const EventDocument = gql`
    query event($id: ID!) {
  event(id: $id) {
    userId
    eventId
    user {
      id
      firstName
      lastName
      description
      image
      email
      shareableId
      phoneNumber
    }
    event {
      id
      createdBy {
        id
        firstName
        lastName
        description
        image
        email
        shareableId
        phoneNumber
      }
      hub {
        id
        name
        description
        active
        image
        latitude
        longitude
        locationLabel
        usersConnection {
          isPresent
          isOwner
        }
      }
      name
      image
      description
      startDateTime
      endDateTime
      minimumCapacity
      maximumCapacity
      latitude
      longitude
      locationLabel
      shareableId
      fileUploads {
        fileId
        eventId
        approvedByUserId
        approved
        file {
          id
          fileName
          createdOn
          url
          createdBy {
            id
            firstName
            lastName
            shareableId
            image
            lastOnline
            phoneNumber
            email
          }
        }
        approvedBy {
          id
          firstName
          lastName
          shareableId
        }
      }
      usersConnection {
        user {
          id
          shareableId
          firstName
          lastName
          username
          description
          image
          lastOnline
          blocked
          phoneNumber
        }
        rsvp
        lastGeofenceEvent
        lastUpdated
        isPresent
      }
    }
    rsvp
    lastGeofenceEvent
    lastUpdated
    isPresent
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class EventGQL extends Apollo.Query<EventQuery, EventQueryVariables> {
    document = EventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const HubDocument = gql`
    query hub($id: ID!) {
  hub(id: $id) {
    userId
    hubId
    isOwner
    starred
    muted
    isPresent
    hub {
      id
      name
      description
      active
      image
      latitude
      longitude
      locationLabel
      shareableId
      fileUploads {
        fileId
        hubId
        approvedByUserId
        approved
        file {
          id
          fileName
          createdOn
          url
          createdBy {
            id
            firstName
            lastName
            shareableId
            image
            lastOnline
            phoneNumber
            email
          }
        }
        approvedBy {
          id
          firstName
          lastName
          shareableId
        }
      }
      usersConnection {
        user {
          id
          shareableId
          firstName
          lastName
          username
          description
          image
          lastOnline
          blocked
          phoneNumber
        }
        isOwner
        isPresent
      }
      events {
        id
        createdBy {
          id
          firstName
          lastName
          description
          image
          email
          shareableId
          phoneNumber
        }
        name
        image
        description
        startDateTime
        endDateTime
        latitude
        longitude
        shareableId
      }
      microChats {
        id
        text
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class HubGQL extends Apollo.Query<HubQuery, HubQueryVariables> {
    document = HubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InviteDocument = gql`
    query invite($inviteId: ID!) {
  invite(inviteId: $inviteId) {
    id
    invitersId
    inviteesId
    hubId
    accepted
    inviter {
      id
      firstName
      lastName
      description
      image
    }
    hub {
      id
      name
      description
      active
      image
      latitude
      longitude
      locationLabel
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InviteGQL extends Apollo.Query<InviteQuery, InviteQueryVariables> {
    document = InviteDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InvitesByHubDocument = gql`
    query invitesByHub($hubId: ID!) {
  invitesByHub(hubId: $hubId) {
    id
    invitersId
    inviteesId
    hubId
    accepted
    inviter {
      id
      firstName
      lastName
      image
    }
    invitee {
      id
      firstName
      lastName
      image
    }
    hub {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InvitesByHubGQL extends Apollo.Query<InvitesByHubQuery, InvitesByHubQueryVariables> {
    document = InvitesByHubDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InvitesByUserDocument = gql`
    query invitesByUser {
  invitesByUser {
    id
    invitersId
    inviteesId
    hubId
    accepted
    inviter {
      id
      firstName
      lastName
      description
      image
    }
    hub {
      id
      name
      description
      active
      image
      latitude
      longitude
      usersConnection {
        isPresent
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InvitesByUserGQL extends Apollo.Query<InvitesByUserQuery, InvitesByUserQueryVariables> {
    document = InvitesByUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MeDocument = gql`
    query me {
  me {
    id
    firstName
    lastName
    username
    description
    image
    email
    phoneNumber
    shareableId
    blocks {
      from {
        id
        firstName
        lastName
        description
        image
        email
        shareableId
      }
      to {
        id
        firstName
        lastName
        description
        image
        email
        shareableId
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MeGQL extends Apollo.Query<MeQuery, MeQueryVariables> {
    document = MeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MyFileUploadsDocument = gql`
    query myFileUploads {
  myFileUploads {
    ... on JoinHubFile {
      fileId
      hubId
      approvedByUserId
      file {
        id
        shareableId
        fileName
        mimetype
        createdOn
        url
        createdBy {
          id
          shareableId
          firstName
          lastName
          profileImage {
            url
          }
        }
      }
      hub {
        name
      }
      approved
      approvedBy {
        username
      }
    }
    ... on JoinEventFile {
      fileId
      eventId
      approvedByUserId
      file {
        id
        createdBy {
          id
          shareableId
          firstName
          lastName
          profileImage {
            url
          }
        }
      }
      event {
        name
      }
      approved
      approvedBy {
        username
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyFileUploadsGQL extends Apollo.Query<MyFileUploadsQuery, MyFileUploadsQueryVariables> {
    document = MyFileUploadsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PaginatedInAppNotifcationsDocument = gql`
    query paginatedInAppNotifcations($limit: Int!, $offset: Int!, $field: String!, $ascending: Boolean!) {
  paginatedInAppNotifications(
    pageableOptions: {limit: $limit, offset: $offset, sortOptions: {field: $field, ascending: $ascending}}
  ) {
    items {
      id
      userId
      header
      text
      date
      actionLink
      thumbnail
    }
    total
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PaginatedInAppNotifcationsGQL extends Apollo.Query<PaginatedInAppNotifcationsQuery, PaginatedInAppNotifcationsQueryVariables> {
    document = PaginatedInAppNotifcationsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserEventsDocument = gql`
    query userEvents {
  usersEvents {
    userId
    eventId
    user {
      id
      firstName
      lastName
      description
      image
      email
      shareableId
    }
    event {
      id
      createdBy {
        id
        firstName
        lastName
        description
        image
        email
        shareableId
        phoneNumber
      }
      hub {
        id
        name
        description
        active
        image
        latitude
        longitude
        locationLabel
        usersConnection {
          userId
          isPresent
          isOwner
        }
      }
      name
      image
      description
      startDateTime
      endDateTime
      minimumCapacity
      maximumCapacity
      latitude
      longitude
      shareableId
      usersConnection {
        userId
        user {
          id
          shareableId
          firstName
          lastName
          username
          email
          image
        }
        rsvp
        lastGeofenceEvent
        lastUpdated
        isPresent
      }
    }
    rsvp
    lastGeofenceEvent
    lastUpdated
    isPresent
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserEventsGQL extends Apollo.Query<UserEventsQuery, UserEventsQueryVariables> {
    document = UserEventsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UsersHubsDocument = gql`
    query usersHubs {
  usersHubs {
    userId
    hubId
    isOwner
    starred
    muted
    isPresent
    hub {
      id
      name
      description
      active
      image
      latitude
      longitude
      locationLabel
      usersConnection {
        userId
        user {
          id
          shareableId
          firstName
          lastName
          username
          email
          image
        }
        isPresent
        isOwner
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UsersHubsGQL extends Apollo.Query<UsersHubsQuery, UsersHubsQueryVariables> {
    document = UsersHubsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UsersPeopleDocument = gql`
    query usersPeople {
  usersPeople {
    id
    shareableId
    firstName
    lastName
    username
    email
    description
    image
    lastOnline
    blocked
    phoneNumber
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UsersPeopleGQL extends Apollo.Query<UsersPeopleQuery, UsersPeopleQueryVariables> {
    document = UsersPeopleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }