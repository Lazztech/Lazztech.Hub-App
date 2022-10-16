/* tslint:disable */
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};




export type Block = {
  __typename?: 'Block';
  from: User;
  to: User;
};

export type Event = {
  __typename?: 'Event';
  shareableId: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  /** ISO 8601 Date Time */
  startDateTime?: Maybe<Scalars['String']>;
  /** ISO 8601 Date Time */
  endDateTime?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  locationLabel?: Maybe<Scalars['String']>;
  createdBy?: Maybe<User>;
  hub?: Maybe<Hub>;
  image?: Maybe<Scalars['String']>;
  usersConnection?: Maybe<Array<JoinUserEvent>>;
};

export type Hub = {
  __typename?: 'Hub';
  shareableId: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  locationLabel?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  usersConnection?: Maybe<Array<JoinUserHub>>;
  microChats?: Maybe<Array<MicroChat>>;
  events?: Maybe<Array<Event>>;
  invites?: Maybe<Array<Invite>>;
};

export type InAppNotification = {
  __typename?: 'InAppNotification';
  id: Scalars['ID'];
  header?: Maybe<Scalars['String']>;
  text: Scalars['String'];
  date: Scalars['String'];
  actionLink?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
  thumbnail?: Maybe<Scalars['String']>;
};

export type Invite = {
  __typename?: 'Invite';
  id: Scalars['ID'];
  accepted: Scalars['Boolean'];
  invitersId: Scalars['ID'];
  inviteesId: Scalars['ID'];
  hubId: Scalars['ID'];
  inviter?: Maybe<User>;
  invitee?: Maybe<User>;
  hub?: Maybe<Hub>;
};

export type JoinUserEvent = {
  __typename?: 'JoinUserEvent';
  /** going or maybe or cantgo */
  rsvp?: Maybe<Scalars['String']>;
  /** last update event for presence */
  lastGeofenceEvent?: Maybe<Scalars['String']>;
  /** unix timestamp for the last time the presence state was updated */
  lastUpdated?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
  eventId: Scalars['ID'];
  isPresent?: Maybe<Scalars['Boolean']>;
  user?: Maybe<User>;
  event?: Maybe<Event>;
};

export type JoinUserHub = {
  __typename?: 'JoinUserHub';
  isOwner: Scalars['Boolean'];
  starred: Scalars['Boolean'];
  muted: Scalars['Boolean'];
  /** last update event for presence */
  lastGeofenceEvent?: Maybe<Scalars['String']>;
  /** unix timestamp for the last time the presence state was updated */
  lastUpdated?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
  hubId: Scalars['ID'];
  isPresent?: Maybe<Scalars['Boolean']>;
  user?: Maybe<User>;
  hub?: Maybe<Hub>;
};

export type MicroChat = {
  __typename?: 'MicroChat';
  id: Scalars['ID'];
  hub: Scalars['ID'];
  text: Scalars['String'];
  hubId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserFcmNotificationToken: Scalars['Boolean'];
  deleteInAppNotification: Scalars['Boolean'];
  deleteAllInAppNotifications: Scalars['Boolean'];
  createHub: JoinUserHub;
  resetShareableHubID: JoinUserHub;
  inviteUserToHub: Invite;
  removeUserFromHub: Scalars['Boolean'];
  acceptHubInvite: JoinUserHub;
  deleteInvite: Scalars['Boolean'];
  leaveHub: Scalars['Boolean'];
  deleteHub: Scalars['Boolean'];
  updateHub: Hub;
  editHub: Hub;
  changeHubLocation: Hub;
  changeHubImage: Hub;
  setHubStarred: Scalars['Boolean'];
  setHubNotStarred: Scalars['Boolean'];
  mute: JoinUserHub;
  unmute: JoinUserHub;
  enteredHubGeofence: JoinUserHub;
  dwellHubGeofence: JoinUserHub;
  exitedHubGeofence: JoinUserHub;
  activateHub: Hub;
  deactivateHub: Hub;
  microChatToHub: Scalars['Boolean'];
  createMicroChat: MicroChat;
  deleteMicroChat: Scalars['Boolean'];
  editUserDetails: User;
  updateUser: User;
  changeEmail: User;
  changeUserImage: User;
  blockUser: Block;
  unblockUser: Block;
  login?: Maybe<Scalars['String']>;
  register?: Maybe<Scalars['String']>;
  logout: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  sendPasswordResetEmail: Scalars['Boolean'];
  changePassword: Scalars['Boolean'];
  deleteAccount: Scalars['Boolean'];
  reportHubAsInappropriate: Scalars['Boolean'];
  reportUserAsInappropriate: Scalars['Boolean'];
  reportEventAsInappropriate: Scalars['Boolean'];
  createEvent: JoinUserEvent;
  rsvp: JoinUserEvent;
  inviteUserToEvent: JoinUserEvent;
  resetShareableEventID: JoinUserEvent;
  deleteEvent: Scalars['Boolean'];
  updateEvent: Event;
};


export type MutationAddUserFcmNotificationTokenArgs = {
  token: Scalars['String'];
};


export type MutationDeleteInAppNotificationArgs = {
  inAppNotificationId: Scalars['ID'];
};


export type MutationCreateHubArgs = {
  locationLabel?: Maybe<Scalars['String']>;
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
  image?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationResetShareableHubIdArgs = {
  id: Scalars['ID'];
};


export type MutationInviteUserToHubArgs = {
  inviteesEmail: Scalars['String'];
  hubId: Scalars['ID'];
};


export type MutationRemoveUserFromHubArgs = {
  otherUsersId: Scalars['ID'];
  hubId: Scalars['ID'];
};


export type MutationAcceptHubInviteArgs = {
  inviteId: Scalars['ID'];
};


export type MutationDeleteInviteArgs = {
  inviteId: Scalars['ID'];
  hubId: Scalars['ID'];
};


export type MutationLeaveHubArgs = {
  hubId: Scalars['ID'];
};


export type MutationDeleteHubArgs = {
  hubId: Scalars['ID'];
};


export type MutationUpdateHubArgs = {
  locationLabel?: Maybe<Scalars['String']>;
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
  image?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  hubId: Scalars['ID'];
};


export type MutationEditHubArgs = {
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  hubId: Scalars['ID'];
};


export type MutationChangeHubLocationArgs = {
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
  hubId: Scalars['ID'];
};


export type MutationChangeHubImageArgs = {
  newImage: Scalars['String'];
  hubId: Scalars['ID'];
};


export type MutationSetHubStarredArgs = {
  hubId: Scalars['ID'];
};


export type MutationSetHubNotStarredArgs = {
  hubId: Scalars['ID'];
};


export type MutationMuteArgs = {
  hubId: Scalars['ID'];
};


export type MutationUnmuteArgs = {
  hubId: Scalars['ID'];
};


export type MutationEnteredHubGeofenceArgs = {
  hubId: Scalars['ID'];
};


export type MutationDwellHubGeofenceArgs = {
  hubId: Scalars['ID'];
};


export type MutationExitedHubGeofenceArgs = {
  hubId: Scalars['ID'];
};


export type MutationActivateHubArgs = {
  hubId: Scalars['ID'];
};


export type MutationDeactivateHubArgs = {
  hubId: Scalars['ID'];
};


export type MutationMicroChatToHubArgs = {
  microChatId: Scalars['ID'];
  hubId: Scalars['ID'];
};


export type MutationCreateMicroChatArgs = {
  microChatText: Scalars['String'];
  hubId: Scalars['ID'];
};


export type MutationDeleteMicroChatArgs = {
  microChatId: Scalars['ID'];
  hubId: Scalars['ID'];
};


export type MutationEditUserDetailsArgs = {
  description: Scalars['String'];
  lastName: Scalars['String'];
  firstName: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};


export type MutationChangeEmailArgs = {
  newEmail: Scalars['String'];
};


export type MutationChangeUserImageArgs = {
  newImage: Scalars['String'];
};


export type MutationBlockUserArgs = {
  toUserId: Scalars['ID'];
};


export type MutationUnblockUserArgs = {
  toUserId: Scalars['ID'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  data: UserInput;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  resetPin: Scalars['String'];
  usersEmail: Scalars['String'];
};


export type MutationSendPasswordResetEmailArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationDeleteAccountArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationReportHubAsInappropriateArgs = {
  hubId: Scalars['ID'];
};


export type MutationReportUserAsInappropriateArgs = {
  toUserId: Scalars['ID'];
};


export type MutationReportEventAsInappropriateArgs = {
  eventId: Scalars['ID'];
};


export type MutationCreateEventArgs = {
  locationLabel?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['Float']>;
  latitude?: Maybe<Scalars['Float']>;
  hubId?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
  startDateTime?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationRsvpArgs = {
  rsvp: Scalars['String'];
  eventId: Scalars['ID'];
};


export type MutationInviteUserToEventArgs = {
  inviteesEmail: Scalars['String'];
  eventId: Scalars['ID'];
};


export type MutationResetShareableEventIdArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateEventArgs = {
  locationLabel?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['Float']>;
  latitude?: Maybe<Scalars['Float']>;
  hubId?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
  startDateTime?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  eventId: Scalars['ID'];
};

export type PageableOptions = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  sortOptions?: Maybe<SortOptions>;
};

export type PaginatedInAppNotificationsResponse = {
  __typename?: 'PaginatedInAppNotificationsResponse';
  items: Array<InAppNotification>;
  total: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getInAppNotifications: Array<InAppNotification>;
  paginatedInAppNotifications: PaginatedInAppNotificationsResponse;
  hub: JoinUserHub;
  usersHubs: Array<JoinUserHub>;
  commonUsersHubs: Array<JoinUserHub>;
  invitesByHub: Array<Invite>;
  invite: Invite;
  invitesByUser: Array<Invite>;
  usersPeople: Array<User>;
  searchHubByName: Array<Hub>;
  ownedHubs: Array<Hub>;
  memberOfHubs: Array<Hub>;
  me?: Maybe<User>;
  event: JoinUserEvent;
  usersEvents: Array<JoinUserEvent>;
};


export type QueryPaginatedInAppNotificationsArgs = {
  pageableOptions?: Maybe<PageableOptions>;
};


export type QueryHubArgs = {
  id: Scalars['ID'];
};


export type QueryCommonUsersHubsArgs = {
  otherUsersId: Scalars['ID'];
};


export type QueryInvitesByHubArgs = {
  includeAccepted?: Maybe<Scalars['Boolean']>;
  hubId: Scalars['ID'];
};


export type QueryInviteArgs = {
  hubId: Scalars['ID'];
};


export type QueryInvitesByUserArgs = {
  includeAccepted?: Maybe<Scalars['Boolean']>;
};


export type QuerySearchHubByNameArgs = {
  search: Scalars['String'];
};


export type QueryEventArgs = {
  id: Scalars['ID'];
};

export type SortOptions = {
  field: Scalars['String'];
  ascending: Scalars['Boolean'];
};

export type UpdateUserInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  shareableId: Scalars['String'];
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  /** string representation of unix timestamp */
  birthdate?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  /** unix timestamp for the last time the user was successfully authenticated */
  lastOnline?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  userDevices?: Maybe<Array<UserDevice>>;
  blocks?: Maybe<Array<Block>>;
  blocked?: Maybe<Scalars['Boolean']>;
};

export type UserDevice = {
  __typename?: 'UserDevice';
  id: Scalars['ID'];
  fcmPushUserToken: Scalars['String'];
  userId: Scalars['ID'];
};

export type UserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  /** string representation of unix timestamp */
  birthdate: Scalars['String'];
  email: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  password: Scalars['String'];
};

export type AcceptHubInviteMutationVariables = Exact<{
  inviteId: Scalars['ID'];
}>;


export type AcceptHubInviteMutation = (
  { __typename?: 'Mutation' }
  & { acceptHubInvite: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isOwner' | 'starred' | 'isPresent'>
    & { hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
      & { microChats?: Maybe<Array<(
        { __typename?: 'MicroChat' }
        & Pick<MicroChat, 'id' | 'hubId' | 'text'>
      )>> }
    )> }
  ) }
);

export type ActivateHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type ActivateHubMutation = (
  { __typename?: 'Mutation' }
  & { activateHub: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'active'>
  ) }
);

export type AddUserFcmNotificationTokenMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type AddUserFcmNotificationTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addUserFcmNotificationToken'>
);

export type BlockUserMutationVariables = Exact<{
  toUserId: Scalars['ID'];
}>;


export type BlockUserMutation = (
  { __typename?: 'Mutation' }
  & { blockUser: (
    { __typename?: 'Block' }
    & { from: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName'>
    ), to: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName'>
    ) }
  ) }
);

export type ChangeEmailMutationVariables = Exact<{
  newEmail: Scalars['String'];
}>;


export type ChangeEmailMutation = (
  { __typename?: 'Mutation' }
  & { changeEmail: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  ) }
);

export type ChangeHubImageMutationVariables = Exact<{
  id: Scalars['ID'];
  image: Scalars['String'];
}>;


export type ChangeHubImageMutation = (
  { __typename?: 'Mutation' }
  & { changeHubImage: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'image'>
  ) }
);

export type ChangeHubLocationMutationVariables = Exact<{
  hubId: Scalars['ID'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
}>;


export type ChangeHubLocationMutation = (
  { __typename?: 'Mutation' }
  & { changeHubLocation: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'latitude' | 'longitude'>
  ) }
);

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changePassword'>
);

export type ChangeUserImageMutationVariables = Exact<{
  image: Scalars['String'];
}>;


export type ChangeUserImageMutation = (
  { __typename?: 'Mutation' }
  & { changeUserImage: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'image'>
  ) }
);

export type CreateEventMutationVariables = Exact<{
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  startDateTime?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  locationLabel?: Maybe<Scalars['String']>;
}>;


export type CreateEventMutation = (
  { __typename?: 'Mutation' }
  & { createEvent: (
    { __typename?: 'JoinUserEvent' }
    & Pick<JoinUserEvent, 'userId' | 'eventId' | 'rsvp' | 'lastGeofenceEvent' | 'lastUpdated'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'shareableId'>
    )>, event?: Maybe<(
      { __typename?: 'Event' }
      & Pick<Event, 'id' | 'name' | 'description' | 'startDateTime' | 'endDateTime' | 'latitude' | 'longitude' | 'shareableId'>
    )> }
  ) }
);

export type CreateHubMutationVariables = Exact<{
  name: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  locationLabel?: Maybe<Scalars['String']>;
}>;


export type CreateHubMutation = (
  { __typename?: 'Mutation' }
  & { createHub: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isOwner' | 'starred' | 'isPresent'>
    & { hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
      & { usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserHub' }
        & Pick<JoinUserHub, 'isPresent' | 'isOwner'>
      )>> }
    )> }
  ) }
);

export type CreateMicroChatMutationVariables = Exact<{
  hubId: Scalars['ID'];
  microChatText: Scalars['String'];
}>;


export type CreateMicroChatMutation = (
  { __typename?: 'Mutation' }
  & { createMicroChat: (
    { __typename?: 'MicroChat' }
    & Pick<MicroChat, 'id' | 'text'>
  ) }
);

export type DeactivateHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type DeactivateHubMutation = (
  { __typename?: 'Mutation' }
  & { deactivateHub: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'active'>
  ) }
);

export type DeleteAccountMutationVariables = Exact<{
  emailAddress: Scalars['String'];
  password: Scalars['String'];
}>;


export type DeleteAccountMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteAccount'>
);

export type DeleteAllInAppNotificationsMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAllInAppNotificationsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteAllInAppNotifications'>
);

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteEventMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteEvent'>
);

export type DeleteHubMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteHub'>
);

export type DeleteInAppNotificationMutationVariables = Exact<{
  inAppNotificationId: Scalars['ID'];
}>;


export type DeleteInAppNotificationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteInAppNotification'>
);

export type DeleteInviteMutationVariables = Exact<{
  hubId: Scalars['ID'];
  inviteId: Scalars['ID'];
}>;


export type DeleteInviteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteInvite'>
);

export type DeleteMicroChatMutationVariables = Exact<{
  hubId: Scalars['ID'];
  microChatId: Scalars['ID'];
}>;


export type DeleteMicroChatMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteMicroChat'>
);

export type DwellHubGeofenceMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type DwellHubGeofenceMutation = (
  { __typename?: 'Mutation' }
  & { dwellHubGeofence: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isPresent'>
  ) }
);

export type EditHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
}>;


export type EditHubMutation = (
  { __typename?: 'Mutation' }
  & { editHub: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'name' | 'description'>
  ) }
);

export type EditUserDetailsMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  description: Scalars['String'];
}>;


export type EditUserDetailsMutation = (
  { __typename?: 'Mutation' }
  & { editUserDetails: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'description'>
  ) }
);

export type EnteredHubGeofenceMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type EnteredHubGeofenceMutation = (
  { __typename?: 'Mutation' }
  & { enteredHubGeofence: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isPresent'>
  ) }
);

export type ExitedHubGeofenceMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type ExitedHubGeofenceMutation = (
  { __typename?: 'Mutation' }
  & { exitedHubGeofence: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isPresent'>
  ) }
);

export type InviteUserToEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  inviteesEmail: Scalars['String'];
}>;


export type InviteUserToEventMutation = (
  { __typename?: 'Mutation' }
  & { inviteUserToEvent: (
    { __typename?: 'JoinUserEvent' }
    & Pick<JoinUserEvent, 'userId' | 'eventId' | 'rsvp' | 'lastGeofenceEvent' | 'lastUpdated'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'shareableId'>
    )>, event?: Maybe<(
      { __typename?: 'Event' }
      & Pick<Event, 'id' | 'name' | 'description' | 'startDateTime' | 'endDateTime' | 'latitude' | 'longitude' | 'shareableId'>
    )> }
  ) }
);

export type InviteUserToHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
  inviteesEmail: Scalars['String'];
}>;


export type InviteUserToHubMutation = (
  { __typename?: 'Mutation' }
  & { inviteUserToHub: (
    { __typename?: 'Invite' }
    & Pick<Invite, 'id' | 'invitersId' | 'inviteesId' | 'hubId' | 'accepted'>
    & { inviter?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
    )>, invitee?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
    )>, hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name'>
    )> }
  ) }
);

export type LeaveHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type LeaveHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'leaveHub'>
);

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);

export type MicroChatToHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
  microChatId: Scalars['ID'];
}>;


export type MicroChatToHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'microChatToHub'>
);

export type MuteMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type MuteMutation = (
  { __typename?: 'Mutation' }
  & { mute: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'muted'>
    & { hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id'>
    )> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  birthdate: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);

export type RemoveUserFromHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
  otherUsersId: Scalars['ID'];
}>;


export type RemoveUserFromHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeUserFromHub'>
);

export type ReportEventAsInappropriateMutationVariables = Exact<{
  eventId: Scalars['ID'];
}>;


export type ReportEventAsInappropriateMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'reportEventAsInappropriate'>
);

export type ReportHubAsInappropriateMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type ReportHubAsInappropriateMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'reportHubAsInappropriate'>
);

export type ReportUserAsInappropriateMutationVariables = Exact<{
  toUserId: Scalars['ID'];
}>;


export type ReportUserAsInappropriateMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'reportUserAsInappropriate'>
);

export type ResetPasswordMutationVariables = Exact<{
  email: Scalars['String'];
  newPassword: Scalars['String'];
  resetPin: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resetPassword'>
);

export type ResetShareableEventIdMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ResetShareableEventIdMutation = (
  { __typename?: 'Mutation' }
  & { resetShareableEventID: (
    { __typename?: 'JoinUserEvent' }
    & Pick<JoinUserEvent, 'userId' | 'eventId'>
    & { event?: Maybe<(
      { __typename?: 'Event' }
      & Pick<Event, 'id' | 'shareableId'>
    )> }
  ) }
);

export type ResetShareableHubIdMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ResetShareableHubIdMutation = (
  { __typename?: 'Mutation' }
  & { resetShareableHubID: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId'>
    & { hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'shareableId'>
    )> }
  ) }
);

export type RsvpMutationVariables = Exact<{
  eventId: Scalars['ID'];
  rsvp: Scalars['String'];
}>;


export type RsvpMutation = (
  { __typename?: 'Mutation' }
  & { rsvp: (
    { __typename?: 'JoinUserEvent' }
    & Pick<JoinUserEvent, 'userId' | 'eventId' | 'rsvp'>
  ) }
);

export type SendPasswordResetEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendPasswordResetEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendPasswordResetEmail'>
);

export type SetHubNotStarredMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type SetHubNotStarredMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setHubNotStarred'>
);

export type SetHubStarredMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type SetHubStarredMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setHubStarred'>
);

export type UnblockUserMutationVariables = Exact<{
  toUserId: Scalars['ID'];
}>;


export type UnblockUserMutation = (
  { __typename?: 'Mutation' }
  & { unblockUser: (
    { __typename?: 'Block' }
    & { from: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName'>
    ), to: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName'>
    ) }
  ) }
);

export type UnmuteMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type UnmuteMutation = (
  { __typename?: 'Mutation' }
  & { unmute: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'muted'>
    & { hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id'>
    )> }
  ) }
);

export type UpdateEventMutationVariables = Exact<{
  eventId: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  startDateTime?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  locationLabel?: Maybe<Scalars['String']>;
}>;


export type UpdateEventMutation = (
  { __typename?: 'Mutation' }
  & { updateEvent: (
    { __typename?: 'Event' }
    & Pick<Event, 'id' | 'name' | 'image' | 'description' | 'startDateTime' | 'endDateTime' | 'latitude' | 'longitude' | 'locationLabel' | 'shareableId'>
    & { createdBy?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'shareableId'>
    )>, usersConnection?: Maybe<Array<(
      { __typename?: 'JoinUserEvent' }
      & Pick<JoinUserEvent, 'rsvp' | 'lastGeofenceEvent' | 'lastUpdated' | 'isPresent'>
      & { user?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'lastOnline' | 'blocked'>
      )> }
    )>> }
  ) }
);

export type UpdateHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
  name: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  locationLabel?: Maybe<Scalars['String']>;
}>;


export type UpdateHubMutation = (
  { __typename?: 'Mutation' }
  & { updateHub: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
    & { usersConnection?: Maybe<Array<(
      { __typename?: 'JoinUserHub' }
      & Pick<JoinUserHub, 'isPresent' | 'isOwner'>
    )>> }
  ) }
);

export type UpdateUserMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'phoneNumber' | 'shareableId'>
  ) }
);

export type CommonUsersHubsQueryVariables = Exact<{
  otherUsersId: Scalars['ID'];
}>;


export type CommonUsersHubsQuery = (
  { __typename?: 'Query' }
  & { commonUsersHubs: Array<(
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isOwner' | 'starred' | 'isPresent'>
    & { hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'active' | 'image' | 'latitude' | 'longitude'>
      & { usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserHub' }
        & Pick<JoinUserHub, 'isPresent' | 'isOwner'>
      )>> }
    )> }
  )> }
);

export type EventQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type EventQuery = (
  { __typename?: 'Query' }
  & { event: (
    { __typename?: 'JoinUserEvent' }
    & Pick<JoinUserEvent, 'userId' | 'eventId' | 'rsvp' | 'lastGeofenceEvent' | 'lastUpdated' | 'isPresent'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'shareableId' | 'phoneNumber'>
    )>, event?: Maybe<(
      { __typename?: 'Event' }
      & Pick<Event, 'id' | 'name' | 'image' | 'description' | 'startDateTime' | 'endDateTime' | 'latitude' | 'longitude' | 'locationLabel' | 'shareableId'>
      & { createdBy?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'shareableId' | 'phoneNumber'>
      )>, hub?: Maybe<(
        { __typename?: 'Hub' }
        & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude' | 'locationLabel'>
        & { usersConnection?: Maybe<Array<(
          { __typename?: 'JoinUserHub' }
          & Pick<JoinUserHub, 'isPresent' | 'isOwner'>
        )>> }
      )>, usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserEvent' }
        & Pick<JoinUserEvent, 'rsvp' | 'lastGeofenceEvent' | 'lastUpdated' | 'isPresent'>
        & { user?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'lastOnline' | 'blocked' | 'phoneNumber'>
        )> }
      )>> }
    )> }
  ) }
);

export type HubQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type HubQuery = (
  { __typename?: 'Query' }
  & { hub: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isOwner' | 'starred' | 'muted' | 'isPresent'>
    & { hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude' | 'locationLabel' | 'shareableId'>
      & { usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserHub' }
        & Pick<JoinUserHub, 'isOwner' | 'isPresent'>
        & { user?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'lastOnline' | 'blocked' | 'phoneNumber'>
        )> }
      )>>, events?: Maybe<Array<(
        { __typename?: 'Event' }
        & Pick<Event, 'id' | 'name' | 'image' | 'description' | 'startDateTime' | 'endDateTime' | 'latitude' | 'longitude' | 'shareableId'>
        & { createdBy?: Maybe<(
          { __typename?: 'User' }
          & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'shareableId' | 'phoneNumber'>
        )> }
      )>>, microChats?: Maybe<Array<(
        { __typename?: 'MicroChat' }
        & Pick<MicroChat, 'id' | 'text'>
      )>> }
    )> }
  ) }
);

export type InviteQueryVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type InviteQuery = (
  { __typename?: 'Query' }
  & { invite: (
    { __typename?: 'Invite' }
    & Pick<Invite, 'id' | 'invitersId' | 'inviteesId' | 'hubId' | 'accepted'>
    & { inviter?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image'>
    )>, hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
    )> }
  ) }
);

export type InvitesByHubQueryVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type InvitesByHubQuery = (
  { __typename?: 'Query' }
  & { invitesByHub: Array<(
    { __typename?: 'Invite' }
    & Pick<Invite, 'id' | 'invitersId' | 'inviteesId' | 'hubId' | 'accepted'>
    & { inviter?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'image'>
    )>, invitee?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'image'>
    )>, hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id'>
    )> }
  )> }
);

export type InvitesByUserQueryVariables = Exact<{ [key: string]: never; }>;


export type InvitesByUserQuery = (
  { __typename?: 'Query' }
  & { invitesByUser: Array<(
    { __typename?: 'Invite' }
    & Pick<Invite, 'id' | 'invitersId' | 'inviteesId' | 'hubId' | 'accepted'>
    & { inviter?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image'>
    )>, hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
      & { usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserHub' }
        & Pick<JoinUserHub, 'isPresent'>
      )>> }
    )> }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'phoneNumber' | 'shareableId'>
    & { blocks?: Maybe<Array<(
      { __typename?: 'Block' }
      & { from: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'shareableId'>
      ), to: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'shareableId'>
      ) }
    )>> }
  )> }
);

export type PaginatedInAppNotifcationsQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  field: Scalars['String'];
  ascending: Scalars['Boolean'];
}>;


export type PaginatedInAppNotifcationsQuery = (
  { __typename?: 'Query' }
  & { paginatedInAppNotifications: (
    { __typename?: 'PaginatedInAppNotificationsResponse' }
    & Pick<PaginatedInAppNotificationsResponse, 'total'>
    & { items: Array<(
      { __typename?: 'InAppNotification' }
      & Pick<InAppNotification, 'id' | 'userId' | 'header' | 'text' | 'date' | 'actionLink' | 'thumbnail'>
    )> }
  ) }
);

export type UserEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserEventsQuery = (
  { __typename?: 'Query' }
  & { usersEvents: Array<(
    { __typename?: 'JoinUserEvent' }
    & Pick<JoinUserEvent, 'userId' | 'eventId' | 'rsvp' | 'lastGeofenceEvent' | 'lastUpdated'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'shareableId'>
    )>, event?: Maybe<(
      { __typename?: 'Event' }
      & Pick<Event, 'id' | 'name' | 'image' | 'description' | 'startDateTime' | 'endDateTime' | 'latitude' | 'longitude' | 'shareableId'>
      & { createdBy?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email' | 'shareableId' | 'phoneNumber'>
      )>, hub?: Maybe<(
        { __typename?: 'Hub' }
        & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude' | 'locationLabel'>
        & { usersConnection?: Maybe<Array<(
          { __typename?: 'JoinUserHub' }
          & Pick<JoinUserHub, 'isPresent' | 'isOwner'>
        )>> }
      )> }
    )> }
  )> }
);

export type UsersHubsQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersHubsQuery = (
  { __typename?: 'Query' }
  & { usersHubs: Array<(
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isOwner' | 'starred' | 'muted' | 'isPresent'>
    & { hub?: Maybe<(
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude' | 'locationLabel'>
      & { usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserHub' }
        & Pick<JoinUserHub, 'isPresent' | 'isOwner'>
      )>> }
    )> }
  )> }
);

export type UsersPeopleQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersPeopleQuery = (
  { __typename?: 'Query' }
  & { usersPeople: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'description' | 'image' | 'lastOnline' | 'blocked' | 'phoneNumber'>
  )> }
);

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
    
  }
export const ChangeHubImageDocument = gql`
    mutation changeHubImage($id: ID!, $image: String!) {
  changeHubImage(hubId: $id, newImage: $image) {
    id
    image
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangeHubImageGQL extends Apollo.Mutation<ChangeHubImageMutation, ChangeHubImageMutationVariables> {
    document = ChangeHubImageDocument;
    
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
    
  }
export const ChangeUserImageDocument = gql`
    mutation changeUserImage($image: String!) {
  changeUserImage(newImage: $image) {
    id
    image
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ChangeUserImageGQL extends Apollo.Mutation<ChangeUserImageMutation, ChangeUserImageMutationVariables> {
    document = ChangeUserImageDocument;
    
  }
export const CreateEventDocument = gql`
    mutation createEvent($name: String!, $description: String, $startDateTime: String, $endDateTime: String, $image: String, $latitude: Float, $longitude: Float, $locationLabel: String) {
  createEvent(name: $name, description: $description, startDateTime: $startDateTime, endDateTime: $endDateTime, image: $image, latitude: $latitude, longitude: $longitude, locationLabel: $locationLabel) {
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
    
  }
export const CreateHubDocument = gql`
    mutation createHub($name: String!, $image: String, $description: String, $latitude: Float!, $longitude: Float!, $locationLabel: String) {
  createHub(image: $image, name: $name, description: $description, latitude: $latitude, longitude: $longitude, locationLabel: $locationLabel) {
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
    
  }
export const EditUserDetailsDocument = gql`
    mutation editUserDetails($firstName: String!, $lastName: String!, $description: String!) {
  editUserDetails(firstName: $firstName, lastName: $lastName, description: $description) {
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
    
  }
export const InviteUserToEventDocument = gql`
    mutation inviteUserToEvent($eventId: ID!, $inviteesEmail: String!) {
  inviteUserToEvent(eventId: $eventId, inviteesEmail: $inviteesEmail) {
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
    
  }
export const InviteUserToHubDocument = gql`
    mutation inviteUserToHub($hubId: ID!, $inviteesEmail: String!) {
  inviteUserToHub(hubId: $hubId, inviteesEmail: $inviteesEmail) {
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
    
  }
export const RegisterDocument = gql`
    mutation register($firstName: String!, $lastName: String!, $birthdate: String!, $email: String!, $password: String!, $phoneNumber: String) {
  register(data: {firstName: $firstName, lastName: $lastName, birthdate: $birthdate, email: $email, password: $password, phoneNumber: $phoneNumber})
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterGQL extends Apollo.Mutation<RegisterMutation, RegisterMutationVariables> {
    document = RegisterDocument;
    
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
    
  }
export const ResetPasswordDocument = gql`
    mutation resetPassword($email: String!, $newPassword: String!, $resetPin: String!) {
  resetPassword(usersEmail: $email, newPassword: $newPassword, resetPin: $resetPin)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ResetPasswordGQL extends Apollo.Mutation<ResetPasswordMutation, ResetPasswordMutationVariables> {
    document = ResetPasswordDocument;
    
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
    
  }
export const UpdateEventDocument = gql`
    mutation updateEvent($eventId: ID!, $name: String!, $description: String, $startDateTime: String, $endDateTime: String, $image: String, $latitude: Float, $longitude: Float, $locationLabel: String) {
  updateEvent(eventId: $eventId, name: $name, description: $description, startDateTime: $startDateTime, endDateTime: $endDateTime, image: $image, latitude: $latitude, longitude: $longitude, locationLabel: $locationLabel) {
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
    
  }
export const UpdateHubDocument = gql`
    mutation updateHub($hubId: ID!, $name: String!, $image: String, $description: String, $latitude: Float!, $longitude: Float!, $locationLabel: String) {
  updateHub(hubId: $hubId, image: $image, name: $name, description: $description, latitude: $latitude, longitude: $longitude, locationLabel: $locationLabel) {
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
    
  }
export const UpdateUserDocument = gql`
    mutation updateUser($data: UpdateUserInput!) {
  updateUser(data: $data) {
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
      usersConnection {
        user {
          id
          firstName
          lastName
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
    
  }
export const InviteDocument = gql`
    query invite($hubId: ID!) {
  invite(hubId: $hubId) {
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
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InviteGQL extends Apollo.Query<InviteQuery, InviteQueryVariables> {
    document = InviteDocument;
    
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
    
  }
export const MeDocument = gql`
    query me {
  me {
    id
    firstName
    lastName
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
    
  }
export const PaginatedInAppNotifcationsDocument = gql`
    query paginatedInAppNotifcations($limit: Int!, $offset: Int!, $field: String!, $ascending: Boolean!) {
  paginatedInAppNotifications(pageableOptions: {limit: $limit, offset: $offset, sortOptions: {field: $field, ascending: $ascending}}) {
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
          isPresent
          isOwner
        }
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
    rsvp
    lastGeofenceEvent
    lastUpdated
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserEventsGQL extends Apollo.Query<UserEventsQuery, UserEventsQueryVariables> {
    document = UserEventsDocument;
    
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
    
  }
export const UsersPeopleDocument = gql`
    query usersPeople {
  usersPeople {
    id
    firstName
    lastName
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
    
  }