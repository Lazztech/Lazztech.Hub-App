import { Injectable } from '@angular/core';
import { FetchPolicy } from 'apollo-client';
import { NGXLogger } from 'ngx-logger';
import { AcceptHubInviteGQL, ActivateHubGQL, ChangeHubImageGQL, CommonUsersHubsGQL, CreateHubGQL, CreateMicroChatGQL, DeactivateHubGQL, DeleteHubGQL, DeleteInviteGQL, DeleteMicroChatGQL, EditHubGQL, EnteredHubGeofenceGQL, ExitedHubGeofenceGQL, HubDocument, HubGQL, HubQuery, HubQueryVariables, InviteGQL, InvitesByHubDocument, InvitesByHubGQL, InvitesByHubQueryVariables, InvitesByUserDocument, InvitesByUserGQL, InviteUserToHubGQL, MicroChatToHubGQL, Scalars, SetHubNotStarredGQL, SetHubStarredGQL, UsersHubsDocument, UsersHubsGQL, UsersHubsQuery, UsersPeopleGQL, LeaveHubGQL, QueryInvitesByHubArgs, ChangeHubLocationGQL } from 'src/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  constructor(
    private readonly logger: NGXLogger,
    private readonly createHubGQLService: CreateHubGQL,
    private readonly userHubsGQLService: UsersHubsGQL,
    private readonly usersPeopleGQLService: UsersPeopleGQL,
    private readonly commonUsersHubsGQLService: CommonUsersHubsGQL,
    private readonly editHubGQLService: EditHubGQL,
    private readonly hubGQLService: HubGQL,
    private readonly inviteUserToHubGQLService: InviteUserToHubGQL,
    private readonly deleteHubGQLService: DeleteHubGQL,
    private readonly changeHubImageGQLService: ChangeHubImageGQL,
    private readonly setHubStarredGQLService: SetHubStarredGQL,
    private readonly setHubNotStarredGQLService: SetHubNotStarredGQL,
    private readonly enteredHubGeofenceGQLService: EnteredHubGeofenceGQL,
    private readonly exitedHubGeofenceGQLService: ExitedHubGeofenceGQL,
    private readonly activateHubGQLService: ActivateHubGQL,
    private readonly deactivateHubGQLService: DeactivateHubGQL,
    private readonly microChatToHubGQLService: MicroChatToHubGQL,
    private readonly createMicroChatGQLService: CreateMicroChatGQL,
    private readonly deleteMicroChatGQLService: DeleteMicroChatGQL,
    private readonly invitesByHubGQLService: InvitesByHubGQL,
    private readonly deleteInviteGQLService: DeleteInviteGQL,
    private readonly inviteGQLService: InviteGQL,
    private readonly invitesByUserGQLService: InvitesByUserGQL,
    private readonly acceptHubInviteGQLService: AcceptHubInviteGQL,
    private readonly leaveHubGQLService: LeaveHubGQL,
    private readonly changeHubLocationGQLService: ChangeHubLocationGQL
  ) { }

  async createHub(name: string, description: string, image: string, latitude: number, longitude: number) {
    const result = await this.createHubGQLService.mutate({
      name,
      description,
      image,
      latitude,
      longitude
    }, {
      update: (proxy, { data: { createHub } }) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: UsersHubsDocument,
        }) as UsersHubsQuery;

        //Add new hub to userHubs array
        data.usersHubs.push(createHub);

        // Write our data back to the cache.
        proxy.writeQuery({
          query: UsersHubsDocument,
          data
        });
      }
    }).toPromise();

    const response = result.data.createHub;

    if (response) {
      this.logger.log("createHub successful.");
    } else {
      this.logger.log("createHub failure");
    }

    return response;
  }

  async usersHubs(fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.userHubsGQLService.fetch(null, {
      fetchPolicy
    }).toPromise();

    const response = result.data.usersHubs;

    if (response) {
      this.logger.log("usersHubs successful.");
    } else {
      this.logger.log("usersHubs failure");
    }

    return response;
  }

  watchUserHubs(fetchPolicy: FetchPolicy = "cache-first") {
    return this.userHubsGQLService.watch(null, {
      fetchPolicy
    });
  }

  watchUsersPeople(fetchPolicy: FetchPolicy = "cache-first") {
    return this.usersPeopleGQLService.watch(null, {
      fetchPolicy
    });
  }

  async usersPeople(fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.usersPeopleGQLService.fetch(null, {
      fetchPolicy
    }).toPromise();

    const response = result.data.usersPeople;

    if (response) {
      this.logger.log("usersPeople successful.");
    } else {
      this.logger.log("usersPeople failure");
    }

    return response;
  }

  async commonUsersHubs(otherUsersId: Scalars['ID'], fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.commonUsersHubsGQLService.fetch({
      otherUsersId
    },
      {
        fetchPolicy
      }).toPromise();

    const response = result.data.commonUsersHubs;

    if (response) {
      this.logger.log("commonUsersHubs successful.");
    } else {
      this.logger.log("commonUsersHubs failure");
    }

    return response;
  }

  async editHub(hubId: Scalars['ID'], name: string, description: string) {
    const result = await this.editHubGQLService.mutate({
      hubId,
      name,
      description
    }).toPromise();

    const response = result.data.editHub;

    if (response) {
      this.logger.log("editHub successful.");
    } else {
      this.logger.log("editHub failure");
    }

    return response;
  }

  async changeHubLocation(hubId: Scalars['ID'], latitude: number, longitude: number) {
    const result = await this.changeHubLocationGQLService.mutate({
      hubId,
      latitude,
      longitude
    }).toPromise();

    const response = result.data.changeHubLocation;

    if (response) {
      this.logger.log(`${this.changeHubLocation.name} successful.`);
    } else {
      this.logger.log(`${this.changeHubLocation.name} failure.`)
    }

    return response;
  }

  async hub(id: Scalars['ID'], fetchPolicy: FetchPolicy = "cache-first") {
    const result = await this.hubGQLService.fetch({
      id
    },
      {
        fetchPolicy
      }).toPromise();

    const response = result.data.hub;

    if (response) {
      this.logger.log("got hub successful.");
    } else {
      this.logger.log("hub query failure");
    }

    return response;
  }

  watchHub(id: Scalars['ID'], fetchPolicy: FetchPolicy = "cache-first") {
    return this.hubGQLService.watch({
      id
    },
      {
        fetchPolicy
      });
  }

  watchInvite(hubId: Scalars['ID'], fetchPolicy: FetchPolicy = 'cache-first') {
    return this.inviteGQLService.watch({
        hubId
      }, {
        fetchPolicy
      });
  }

  watchInvitesByHub(hubId: Scalars['ID'], includeAccepted: boolean, fetchPolicy: FetchPolicy = 'cache-first') {
    return this.invitesByHubGQLService.watch({
      hubId,
      includeAccepted
    } as QueryInvitesByHubArgs, {
      fetchPolicy
    });
  }

  watchInvitesByUser(fetchPolicy: FetchPolicy = 'cache-first') {
    return this.invitesByUserGQLService.watch(null,
      {
        fetchPolicy
      });
  }

  async inviteUserToHub(hubId: Scalars['ID'], inviteesEmail: string) {
    const result = await this.inviteUserToHubGQLService.mutate({
      hubId,
      inviteesEmail
    }, {
      refetchQueries: [
        { query: InvitesByHubDocument, variables: { hubId, includeAccepted: false } as InvitesByHubQueryVariables }
      ]
    }).toPromise();

    const response = result.data.inviteUserToHub;
    return response;
  }

  async acceptHubInvite(inviteId: Scalars['ID']) {
    const result = await this.acceptHubInviteGQLService.mutate({
      inviteId
    }, {
      refetchQueries: [
        { query: UsersHubsDocument },
        { query: InvitesByUserDocument }
      ]
    }).toPromise();
  }

  async deleteInvite(hubId: any, inviteId: any) {
    const result = await this.deleteInviteGQLService.mutate({
      hubId,
      inviteId
    }, {
      refetchQueries: [
        { query: InvitesByHubDocument, variables: { hubId } as InvitesByHubQueryVariables },
        { query: InvitesByUserDocument }
      ]
    }).toPromise();

    return result.data.deleteInvite;
  }

  async leaveHub(hubId: Scalars['ID']) {
    const result = await this.leaveHubGQLService.mutate({ 
      hubId
     }, {
       refetchQueries: [
         { query: UsersHubsDocument }
       ]
     }).toPromise();
  }

  async deleteHub(id: Scalars['ID']): Promise<boolean> {
    const result = await this.deleteHubGQLService.mutate({
      id
    }, {
      update: (proxy, { data: { deleteHub } }) => {
        // Read the data from our cache for this query.
        const hubQueryData = proxy.readQuery({
          query: HubDocument,
          variables: { id } as HubQueryVariables
        }) as HubQuery;

        //Delete hub
        delete hubQueryData.hub

        // Write our data back to the cache.
        proxy.writeQuery({
          query: HubDocument,
          variables: { id: id } as HubQueryVariables,
          data: hubQueryData
        });

        //TODO would it be more robust to recurse through the RootQuery document tree and delete that way?
        const userHubsData = proxy.readQuery({
          query: UsersHubsDocument
        }) as UsersHubsQuery;

        //Delete Hub
        const userHub = userHubsData.usersHubs.find(x => x.hubId == id);
        userHubsData.usersHubs.splice(
          userHubsData.usersHubs.indexOf(userHub), 1
        );

        proxy.writeQuery({
          query: UsersHubsDocument,
          data: userHubsData
        });
      }
    }).toPromise();

    const response = result.data.deleteHub;
    return response;
  }

  async changeHubImage(id: Scalars['ID'], image: string): Promise<boolean> {
    const result = await this.changeHubImageGQLService.mutate({
      id,
      image
    }).toPromise();

    const response = result.data.changeHubImage;
    return (response) ? true : false;
  }

  async setHubStarred(hubId: Scalars['ID']) {
    const result = await this.setHubStarredGQLService.mutate({
      hubId
    }).toPromise();

    const response = result.data.setHubStarred;
    return response;
  }

  async setHubNotStarred(hubId: Scalars['ID']) {
    const result = await this.setHubNotStarredGQLService.mutate({
      hubId
    }).toPromise();

    const response = result.data.setHubNotStarred;
    return response;
  }

  async enteredHubGeofence(hubId: Scalars['ID']) {
    const result = await this.enteredHubGeofenceGQLService.mutate({
      hubId
    }).toPromise();

    this.logger.log(`enteredHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }

  async exitedHubGeofence(hubId: Scalars['ID']) {
    const result = await this.exitedHubGeofenceGQLService.mutate({
      hubId
    }).toPromise();

    this.logger.log(`exitedHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }

  async activateHub(hubId: Scalars['ID']) {
    const result = await this.activateHubGQLService.mutate({
      hubId
    }).toPromise();
    return result;
  }

  async deactivateHub(hubId: Scalars['ID']) {
    const result = await this.deactivateHubGQLService.mutate({
      hubId
    }).toPromise();

    return result;
  }

  async sendMicroChat(hubId: Scalars['ID'], microChatId: Scalars['ID']) {
    const result = await this.microChatToHubGQLService.mutate({
      hubId,
      microChatId
    }).toPromise();

    const response = result.data.microChatToHub;
    return response;
  }

  async createMicroChat(hubId: Scalars['ID'], microChatText: string) {
    const result = await this.createMicroChatGQLService.mutate({
      hubId,
      microChatText
    },
      {
        update: (proxy, { data: { createMicroChat } }) => {
          // Read the data from our cache for this query.
          const data = proxy.readQuery({
            query: HubDocument,
            variables: { id: hubId } as HubQueryVariables
          }) as HubQuery;

          //Add new micro-chat to hub's array of micro-chats
          data.hub.hub.microChats.push(createMicroChat);

          // Write our data back to the cache.
          proxy.writeQuery({
            query: HubDocument,
            variables: { id: hubId } as HubQueryVariables,
            data
          });
        }
      }).toPromise();
    return result.data.createMicroChat;
  }

  async deleteMicroChat(hubId: Scalars['ID'], microChatId: Scalars['ID']) {
    const result = await this.deleteMicroChatGQLService.mutate({
      hubId,
      microChatId
    },
      {
        update: (proxy, { data: { deleteMicroChat } }) => {
          // Read the data from our cache for this query.
          const data = proxy.readQuery({
            query: HubDocument,
            variables: { id: hubId } as HubQueryVariables
          }) as HubQuery;

          //Remove micro-chat from hub's array of micro-chats
          const microChat = data.hub.hub.microChats.find(x => x.id == microChatId);
          data.hub.hub.microChats.splice(
            data.hub.hub.microChats.indexOf(microChat), 1
          );

          // Write our data back to the cache.
          proxy.writeQuery({
            query: HubDocument,
            variables: { id: hubId } as HubQueryVariables,
            data
          });
        }
      }).toPromise();
    return result.data.deleteMicroChat;
  }
}
