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




export type Hub = {
  __typename?: 'Hub';
  shareableId: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  usersConnection?: Maybe<Array<JoinUserHub>>;
  microChats?: Maybe<Array<MicroChat>>;
  invites?: Maybe<Array<Invite>>;
  image?: Maybe<Scalars['String']>;
};

export type InAppNotification = {
  __typename?: 'InAppNotification';
  id: Scalars['ID'];
  userId: Scalars['ID'];
  header?: Maybe<Scalars['String']>;
  text: Scalars['String'];
  date: Scalars['String'];
  actionLink?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
};

export type Invite = {
  __typename?: 'Invite';
  id: Scalars['ID'];
  invitersId: Scalars['ID'];
  inviteesId: Scalars['ID'];
  hubId: Scalars['ID'];
  accepted: Scalars['Boolean'];
  inviter: User;
  invitee: User;
  hub: Hub;
};

export type JoinUserHub = {
  __typename?: 'JoinUserHub';
  userId: Scalars['ID'];
  hubId: Scalars['ID'];
  user: User;
  hub: Hub;
  isOwner: Scalars['Boolean'];
  starred: Scalars['Boolean'];
  /** last update event for presence */
  lastGeofenceEvent?: Maybe<Scalars['String']>;
  /** unix timestamp for the last time the presence state was updated */
  lastUpdated?: Maybe<Scalars['String']>;
  isPresent?: Maybe<Scalars['Boolean']>;
};

export type MicroChat = {
  __typename?: 'MicroChat';
  id: Scalars['ID'];
  hubId: Scalars['Float'];
  hub: Scalars['ID'];
  text: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserFcmNotificationToken: Scalars['Boolean'];
  deleteInAppNotification: Scalars['Boolean'];
  deleteAllInAppNotifications: Scalars['Boolean'];
  createHub: JoinUserHub;
  inviteUserToHub: Invite;
  acceptHubInvite: JoinUserHub;
  deleteInvite: Scalars['Boolean'];
  leaveHub: Scalars['Boolean'];
  deleteHub: Scalars['Boolean'];
  editHub: Hub;
  changeHubLocation: Hub;
  changeHubImage: Hub;
  setHubStarred: Scalars['Boolean'];
  setHubNotStarred: Scalars['Boolean'];
  enteredHubGeofence: JoinUserHub;
  dwellHubGeofence: JoinUserHub;
  exitedHubGeofence: JoinUserHub;
  activateHub: Hub;
  deactivateHub: Hub;
  microChatToHub: Scalars['Boolean'];
  createMicroChat: MicroChat;
  deleteMicroChat: Scalars['Boolean'];
  editUserDetails: User;
  changeEmail: User;
  changeUserImage: User;
  login?: Maybe<Scalars['String']>;
  register?: Maybe<Scalars['String']>;
  logout: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  sendPasswordResetEmail: Scalars['Boolean'];
  changePassword: Scalars['Boolean'];
  deleteAccount: Scalars['Boolean'];
};


export type MutationAddUserFcmNotificationTokenArgs = {
  token: Scalars['String'];
};


export type MutationDeleteInAppNotificationArgs = {
  inAppNotificationId: Scalars['ID'];
};


export type MutationCreateHubArgs = {
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
  image: Scalars['String'];
  description: Scalars['String'];
  name: Scalars['String'];
};


export type MutationInviteUserToHubArgs = {
  inviteesEmail: Scalars['String'];
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


export type MutationEditHubArgs = {
  description: Scalars['String'];
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


export type MutationChangeEmailArgs = {
  newEmail: Scalars['String'];
};


export type MutationChangeUserImageArgs = {
  newImage: Scalars['String'];
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

export type SortOptions = {
  field: Scalars['String'];
  ascending: Scalars['Boolean'];
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
  image?: Maybe<Scalars['String']>;
  userDevices?: Maybe<Array<UserDevice>>;
};

export type UserDevice = {
  __typename?: 'UserDevice';
  id: Scalars['ID'];
  fcmPushUserToken: Scalars['String'];
};

export type UserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  /** string representation of unix timestamp */
  birthdate: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email'>
  )> }
);

export type RegisterMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  birthdate: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
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

export type SendPasswordResetEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendPasswordResetEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendPasswordResetEmail'>
);

export type AcceptHubInviteMutationVariables = Exact<{
  inviteId: Scalars['ID'];
}>;


export type AcceptHubInviteMutation = (
  { __typename?: 'Mutation' }
  & { acceptHubInvite: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isOwner' | 'starred' | 'isPresent'>
    & { hub: (
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
      & { microChats?: Maybe<Array<(
        { __typename?: 'MicroChat' }
        & Pick<MicroChat, 'id' | 'hubId' | 'text'>
      )>> }
    ) }
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

export type CommonUsersHubsQueryVariables = Exact<{
  otherUsersId: Scalars['ID'];
}>;


export type CommonUsersHubsQuery = (
  { __typename?: 'Query' }
  & { commonUsersHubs: Array<(
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isOwner' | 'starred' | 'isPresent'>
    & { hub: (
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'active' | 'image' | 'latitude' | 'longitude'>
      & { usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserHub' }
        & Pick<JoinUserHub, 'isPresent' | 'isOwner'>
      )>> }
    ) }
  )> }
);

export type CreateHubMutationVariables = Exact<{
  image: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
}>;


export type CreateHubMutation = (
  { __typename?: 'Mutation' }
  & { createHub: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isOwner' | 'starred' | 'isPresent'>
    & { hub: (
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
      & { usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserHub' }
        & Pick<JoinUserHub, 'isPresent' | 'isOwner'>
      )>> }
    ) }
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

export type DeleteHubMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteHub'>
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

export type EditHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
}>;


export type EditHubMutation = (
  { __typename?: 'Mutation' }
  & { editHub: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'name' | 'description'>
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

export type HubQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type HubQuery = (
  { __typename?: 'Query' }
  & { hub: (
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isOwner' | 'starred' | 'isPresent'>
    & { hub: (
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
      & { usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserHub' }
        & Pick<JoinUserHub, 'isOwner' | 'isPresent'>
        & { user: (
          { __typename?: 'User' }
          & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image'>
        ) }
      )>>, microChats?: Maybe<Array<(
        { __typename?: 'MicroChat' }
        & Pick<MicroChat, 'id' | 'text'>
      )>> }
    ) }
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
    & { inviter: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image'>
    ), hub: (
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
    ) }
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
    & { inviter: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
    ), invitee: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName'>
    ), hub: (
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name'>
    ) }
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
    & { inviter: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'image'>
    ), invitee: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'image'>
    ), hub: (
      { __typename?: 'Hub' }
      & Pick<Hub, 'id'>
    ) }
  )> }
);

export type InvitesByUserQueryVariables = Exact<{ [key: string]: never; }>;


export type InvitesByUserQuery = (
  { __typename?: 'Query' }
  & { invitesByUser: Array<(
    { __typename?: 'Invite' }
    & Pick<Invite, 'id' | 'invitersId' | 'inviteesId' | 'hubId' | 'accepted'>
    & { inviter: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image'>
    ), hub: (
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
      & { usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserHub' }
        & Pick<JoinUserHub, 'isPresent'>
      )>> }
    ) }
  )> }
);

export type LeaveHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
}>;


export type LeaveHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'leaveHub'>
);

export type MicroChatToHubMutationVariables = Exact<{
  hubId: Scalars['ID'];
  microChatId: Scalars['ID'];
}>;


export type MicroChatToHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'microChatToHub'>
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

export type UsersHubsQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersHubsQuery = (
  { __typename?: 'Query' }
  & { usersHubs: Array<(
    { __typename?: 'JoinUserHub' }
    & Pick<JoinUserHub, 'userId' | 'hubId' | 'isOwner' | 'starred' | 'isPresent'>
    & { hub: (
      { __typename?: 'Hub' }
      & Pick<Hub, 'id' | 'name' | 'description' | 'active' | 'image' | 'latitude' | 'longitude'>
      & { usersConnection?: Maybe<Array<(
        { __typename?: 'JoinUserHub' }
        & Pick<JoinUserHub, 'isPresent' | 'isOwner'>
      )>> }
    ) }
  )> }
);

export type UsersPeopleQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersPeopleQuery = (
  { __typename?: 'Query' }
  & { usersPeople: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'description' | 'image'>
  )> }
);

export type AddUserFcmNotificationTokenMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type AddUserFcmNotificationTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addUserFcmNotificationToken'>
);

export type DeleteAllInAppNotificationsMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAllInAppNotificationsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteAllInAppNotifications'>
);

export type DeleteInAppNotificationMutationVariables = Exact<{
  inAppNotificationId: Scalars['ID'];
}>;


export type DeleteInAppNotificationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteInAppNotification'>
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

export type DeleteAccountMutationVariables = Exact<{
  emailAddress: Scalars['String'];
  password: Scalars['String'];
}>;


export type DeleteAccountMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteAccount'>
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
export const MeDocument = gql`
    query me {
  me {
    id
    firstName
    lastName
    description
    image
    email
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MeGQL extends Apollo.Query<MeQuery, MeQueryVariables> {
    document = MeDocument;
    
  }
export const RegisterDocument = gql`
    mutation register($firstName: String!, $lastName: String!, $birthdate: String!, $email: String!, $password: String!) {
  register(data: {firstName: $firstName, lastName: $lastName, birthdate: $birthdate, email: $email, password: $password})
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterGQL extends Apollo.Mutation<RegisterMutation, RegisterMutationVariables> {
    document = RegisterDocument;
    
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
export const CreateHubDocument = gql`
    mutation createHub($image: String!, $name: String!, $description: String!, $latitude: Float!, $longitude: Float!) {
  createHub(image: $image, name: $name, description: $description, latitude: $latitude, longitude: $longitude) {
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
export const EditHubDocument = gql`
    mutation editHub($hubId: ID!, $name: String!, $description: String!) {
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
export const HubDocument = gql`
    query hub($id: ID!) {
  hub(id: $id) {
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
        user {
          id
          firstName
          lastName
          description
          image
        }
        isOwner
        isPresent
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
export const UsersHubsDocument = gql`
    query usersHubs {
  usersHubs {
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
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UsersPeopleGQL extends Apollo.Query<UsersPeopleQuery, UsersPeopleQueryVariables> {
    document = UsersPeopleDocument;
    
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