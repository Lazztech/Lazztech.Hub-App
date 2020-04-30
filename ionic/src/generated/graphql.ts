import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
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
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  image?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  usersConnection?: Maybe<Array<JoinUserHub>>;
  microChats?: Maybe<Array<MicroChat>>;
};

export type InAppNotification = {
   __typename?: 'InAppNotification';
  id: Scalars['ID'];
  header?: Maybe<Scalars['String']>;
  text: Scalars['String'];
  date: Scalars['String'];
  thumbnail?: Maybe<Scalars['String']>;
  actionLink?: Maybe<Scalars['String']>;
};

export type Invite = {
   __typename?: 'Invite';
  id: Scalars['ID'];
  email: Scalars['String'];
};

export type JoinUserHub = {
   __typename?: 'JoinUserHub';
  userId: Scalars['ID'];
  hubId: Scalars['ID'];
  user: User;
  hub: Hub;
  isOwner: Scalars['Boolean'];
  starred: Scalars['Boolean'];
  isPresent: Scalars['Boolean'];
};

export type JoinUserInAppNotifications = {
   __typename?: 'JoinUserInAppNotifications';
  userId: Scalars['ID'];
  inAppNotificationId: Scalars['ID'];
  user: User;
  inAppNotification: InAppNotification;
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
  createHub: Hub;
  inviteUserToHub: Scalars['Boolean'];
  deleteHub: Scalars['Boolean'];
  editHub: Hub;
  changeHubImage: Hub;
  joinHub: Scalars['Boolean'];
  setHubStarred: Scalars['Boolean'];
  setHubNotStarred: Scalars['Boolean'];
  enteredHubGeofence: Scalars['Boolean'];
  exitedHubGeofence: Scalars['Boolean'];
  activateHub: Hub;
  deactivateHub: Hub;
  microChatToHub: Scalars['Boolean'];
  createMicroChat: MicroChat;
  deleteMicroChat: Scalars['Boolean'];
  editUserDetails: User;
  changeEmail: User;
  changeUserImage: User;
  addUserFcmNotificationToken: Scalars['Boolean'];
  deleteInAppNotification: Scalars['Boolean'];
  deleteAllInAppNotifications: Scalars['Boolean'];
  login?: Maybe<Scalars['String']>;
  register?: Maybe<Scalars['String']>;
  logout: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  sendPasswordResetEmail: Scalars['Boolean'];
  changePassword: Scalars['Boolean'];
  deleteAccount: Scalars['Boolean'];
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
  hubId: Scalars['Int'];
};


export type MutationDeleteHubArgs = {
  hubId: Scalars['Int'];
};


export type MutationEditHubArgs = {
  description: Scalars['String'];
  name: Scalars['String'];
  hubId: Scalars['Int'];
};


export type MutationChangeHubImageArgs = {
  newImage: Scalars['String'];
  hubId: Scalars['Int'];
};


export type MutationJoinHubArgs = {
  id: Scalars['Int'];
};


export type MutationSetHubStarredArgs = {
  hubId: Scalars['Int'];
};


export type MutationSetHubNotStarredArgs = {
  hubId: Scalars['Int'];
};


export type MutationEnteredHubGeofenceArgs = {
  hubId: Scalars['Int'];
};


export type MutationExitedHubGeofenceArgs = {
  hubId: Scalars['Int'];
};


export type MutationActivateHubArgs = {
  hubId: Scalars['Int'];
};


export type MutationDeactivateHubArgs = {
  hubId: Scalars['Int'];
};


export type MutationMicroChatToHubArgs = {
  microChatId: Scalars['Int'];
  hubId: Scalars['Int'];
};


export type MutationCreateMicroChatArgs = {
  microChatText: Scalars['String'];
  hubId: Scalars['Int'];
};


export type MutationDeleteMicroChatArgs = {
  microChatId: Scalars['Int'];
  hubId: Scalars['Int'];
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


export type MutationAddUserFcmNotificationTokenArgs = {
  token: Scalars['String'];
};


export type MutationDeleteInAppNotificationArgs = {
  inAppNotificationId: Scalars['Int'];
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

export type Query = {
   __typename?: 'Query';
  hub: JoinUserHub;
  usersHubs: Array<JoinUserHub>;
  commonUsersHubs: Array<JoinUserHub>;
  usersPeople: Array<User>;
  searchHubByName: Array<Hub>;
  ownedHubs: Array<Hub>;
  memberOfHubs: Array<Hub>;
  me?: Maybe<User>;
  getInAppNotifications: Array<InAppNotification>;
};


export type QueryHubArgs = {
  id: Scalars['Int'];
};


export type QueryCommonUsersHubsArgs = {
  otherUsersId: Scalars['Int'];
};


export type QuerySearchHubByNameArgs = {
  search: Scalars['String'];
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  email: Scalars['String'];
};

export type UserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginMutationVariables = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);

export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image' | 'email'>
  )> }
);

export type RegisterMutationVariables = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);

export type ResetPasswordMutationVariables = {
  email: Scalars['String'];
  newPassword: Scalars['String'];
  resetPin: Scalars['String'];
};


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resetPassword'>
);

export type SendPasswordResetEmailMutationVariables = {
  email: Scalars['String'];
};


export type SendPasswordResetEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendPasswordResetEmail'>
);

export type ActivateHubMutationVariables = {
  hubId: Scalars['Int'];
};


export type ActivateHubMutation = (
  { __typename?: 'Mutation' }
  & { activateHub: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'active'>
  ) }
);

export type ChangeHubImageMutationVariables = {
  id: Scalars['Int'];
  image: Scalars['String'];
};


export type ChangeHubImageMutation = (
  { __typename?: 'Mutation' }
  & { changeHubImage: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'image'>
  ) }
);

export type CommonUsersHubsQueryVariables = {
  otherUsersId: Scalars['Int'];
};


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

export type CreateHubMutationVariables = {
  image: Scalars['String'];
  name: Scalars['String'];
  description: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};


export type CreateHubMutation = (
  { __typename?: 'Mutation' }
  & { createHub: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'name' | 'description' | 'image' | 'latitude' | 'longitude'>
  ) }
);

export type CreateMicroChatMutationVariables = {
  hubId: Scalars['Int'];
  microChatText: Scalars['String'];
};


export type CreateMicroChatMutation = (
  { __typename?: 'Mutation' }
  & { createMicroChat: (
    { __typename?: 'MicroChat' }
    & Pick<MicroChat, 'id' | 'text'>
  ) }
);

export type DeactivateHubMutationVariables = {
  hubId: Scalars['Int'];
};


export type DeactivateHubMutation = (
  { __typename?: 'Mutation' }
  & { deactivateHub: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'active'>
  ) }
);

export type DeleteHubMutationVariables = {
  id: Scalars['Int'];
};


export type DeleteHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteHub'>
);

export type EditHubMutationVariables = {
  hubId: Scalars['Int'];
  name: Scalars['String'];
  description: Scalars['String'];
};


export type EditHubMutation = (
  { __typename?: 'Mutation' }
  & { editHub: (
    { __typename?: 'Hub' }
    & Pick<Hub, 'id' | 'name' | 'description'>
  ) }
);

export type EnteredHubGeofenceMutationVariables = {
  hubId: Scalars['Int'];
};


export type EnteredHubGeofenceMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'enteredHubGeofence'>
);

export type ExitedHubGeofenceMutationVariables = {
  hubId: Scalars['Int'];
};


export type ExitedHubGeofenceMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'exitedHubGeofence'>
);

export type HubQueryVariables = {
  id: Scalars['Int'];
};


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

export type InviteUserToHubMutationVariables = {
  hubId: Scalars['Int'];
  inviteesEmail: Scalars['String'];
};


export type InviteUserToHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'inviteUserToHub'>
);

export type JoinHubMutationVariables = {
  id: Scalars['Int'];
};


export type JoinHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'joinHub'>
);

export type MicroChatToHubMutationVariables = {
  hubId: Scalars['Int'];
  microChatId: Scalars['Int'];
};


export type MicroChatToHubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'microChatToHub'>
);

export type SetHubNotStarredMutationVariables = {
  hubId: Scalars['Int'];
};


export type SetHubNotStarredMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setHubNotStarred'>
);

export type SetHubStarredMutationVariables = {
  hubId: Scalars['Int'];
};


export type SetHubStarredMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'setHubStarred'>
);

export type UsersHubsQueryVariables = {};


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

export type UsersPeopleQueryVariables = {};


export type UsersPeopleQuery = (
  { __typename?: 'Query' }
  & { usersPeople: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'description' | 'image'>
  )> }
);

export type AddUserFcmNotificationTokenMutationVariables = {
  token: Scalars['String'];
};


export type AddUserFcmNotificationTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addUserFcmNotificationToken'>
);

export type DeleteAllInAppNotificationsMutationVariables = {};


export type DeleteAllInAppNotificationsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteAllInAppNotifications'>
);

export type DeleteInAppNotificationMutationVariables = {
  inAppNotificationId: Scalars['Int'];
};


export type DeleteInAppNotificationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteInAppNotification'>
);

export type GetInAppNotificationsQueryVariables = {};


export type GetInAppNotificationsQuery = (
  { __typename?: 'Query' }
  & { getInAppNotifications: Array<(
    { __typename?: 'InAppNotification' }
    & Pick<InAppNotification, 'id' | 'header' | 'text' | 'date' | 'thumbnail' | 'actionLink'>
  )> }
);

export type ChangeEmailMutationVariables = {
  newEmail: Scalars['String'];
};


export type ChangeEmailMutation = (
  { __typename?: 'Mutation' }
  & { changeEmail: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  ) }
);

export type ChangePasswordMutationVariables = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changePassword'>
);

export type ChangeUserImageMutationVariables = {
  image: Scalars['String'];
};


export type ChangeUserImageMutation = (
  { __typename?: 'Mutation' }
  & { changeUserImage: (
    { __typename?: 'User' }
    & Pick<User, 'image'>
  ) }
);

export type DeleteAccountMutationVariables = {
  emailAddress: Scalars['String'];
  password: Scalars['String'];
};


export type DeleteAccountMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteAccount'>
);

export type EditUserDetailsMutationVariables = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  description: Scalars['String'];
};


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
    mutation register($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
  register(data: {firstName: $firstName, lastName: $lastName, email: $email, password: $password})
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
export const ActivateHubDocument = gql`
    mutation activateHub($hubId: Int!) {
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
    mutation changeHubImage($id: Int!, $image: String!) {
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
export const CommonUsersHubsDocument = gql`
    query commonUsersHubs($otherUsersId: Int!) {
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
    id
    name
    description
    image
    latitude
    longitude
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
    mutation createMicroChat($hubId: Int!, $microChatText: String!) {
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
    mutation deactivateHub($hubId: Int!) {
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
    mutation deleteHub($id: Int!) {
  deleteHub(hubId: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteHubGQL extends Apollo.Mutation<DeleteHubMutation, DeleteHubMutationVariables> {
    document = DeleteHubDocument;
    
  }
export const EditHubDocument = gql`
    mutation editHub($hubId: Int!, $name: String!, $description: String!) {
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
    mutation enteredHubGeofence($hubId: Int!) {
  enteredHubGeofence(hubId: $hubId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class EnteredHubGeofenceGQL extends Apollo.Mutation<EnteredHubGeofenceMutation, EnteredHubGeofenceMutationVariables> {
    document = EnteredHubGeofenceDocument;
    
  }
export const ExitedHubGeofenceDocument = gql`
    mutation exitedHubGeofence($hubId: Int!) {
  exitedHubGeofence(hubId: $hubId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ExitedHubGeofenceGQL extends Apollo.Mutation<ExitedHubGeofenceMutation, ExitedHubGeofenceMutationVariables> {
    document = ExitedHubGeofenceDocument;
    
  }
export const HubDocument = gql`
    query hub($id: Int!) {
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
export const InviteUserToHubDocument = gql`
    mutation inviteUserToHub($hubId: Int!, $inviteesEmail: String!) {
  inviteUserToHub(hubId: $hubId, inviteesEmail: $inviteesEmail)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InviteUserToHubGQL extends Apollo.Mutation<InviteUserToHubMutation, InviteUserToHubMutationVariables> {
    document = InviteUserToHubDocument;
    
  }
export const JoinHubDocument = gql`
    mutation joinHub($id: Int!) {
  joinHub(id: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class JoinHubGQL extends Apollo.Mutation<JoinHubMutation, JoinHubMutationVariables> {
    document = JoinHubDocument;
    
  }
export const MicroChatToHubDocument = gql`
    mutation microChatToHub($hubId: Int!, $microChatId: Int!) {
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
    mutation setHubNotStarred($hubId: Int!) {
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
    mutation setHubStarred($hubId: Int!) {
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
    mutation deleteInAppNotification($inAppNotificationId: Int!) {
  deleteInAppNotification(inAppNotificationId: $inAppNotificationId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteInAppNotificationGQL extends Apollo.Mutation<DeleteInAppNotificationMutation, DeleteInAppNotificationMutationVariables> {
    document = DeleteInAppNotificationDocument;
    
  }
export const GetInAppNotificationsDocument = gql`
    query getInAppNotifications {
  getInAppNotifications {
    id
    header
    text
    date
    thumbnail
    actionLink
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetInAppNotificationsGQL extends Apollo.Query<GetInAppNotificationsQuery, GetInAppNotificationsQueryVariables> {
    document = GetInAppNotificationsDocument;
    
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