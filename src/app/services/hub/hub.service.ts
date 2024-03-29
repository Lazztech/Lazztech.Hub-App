import { Injectable } from '@angular/core';
import { FetchPolicy } from '@apollo/client/core';
import { NGXLogger } from 'ngx-logger';
import {
  AcceptHubInviteGQL,
  ActivateHubGQL,
  ChangeHubLocationGQL,
  CommonUsersHubsGQL,
  CreateHubGQL,
  CreateMicroChatGQL,
  DeactivateHubGQL,
  DeleteHubGQL,
  DeleteInviteGQL,
  DeleteMicroChatGQL, DwellHubGeofenceGQL, EditHubGQL,
  EnteredHubGeofenceGQL, ExitedHubGeofenceGQL, Hub, HubDocument,
  HubGQL,
  HubQuery,
  HubQueryVariables,
  InviteGQL,
  InvitesByHubDocument,
  InvitesByHubGQL,
  InvitesByHubQueryVariables,
  InvitesByUserDocument, InviteUserToHubGQL,
  LeaveHubGQL,
  MicroChatToHubGQL,
  QueryInvitesByHubArgs, ReportHubAsInappropriateGQL, Scalars,
  SetHubNotStarredGQL,
  SetHubStarredGQL,
  UsersHubsDocument,
  UsersHubsGQL, UsersPeopleDocument, UsersPeopleGQL
} from 'src/graphql/graphql';
import { AlertService } from '../alert/alert.service';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  constructor(
    private readonly logger: NGXLogger,
    private readonly userHubsGQLService: UsersHubsGQL,
    private readonly usersPeopleGQLService: UsersPeopleGQL,
    private readonly commonUsersHubsGQLService: CommonUsersHubsGQL,
    private readonly editHubGQLService: EditHubGQL,
    private readonly hubGQLService: HubGQL,
    private readonly inviteUserToHubGQLService: InviteUserToHubGQL,
    private readonly deleteHubGQLService: DeleteHubGQL,
    private readonly setHubStarredGQLService: SetHubStarredGQL,
    private readonly setHubNotStarredGQLService: SetHubNotStarredGQL,
    private readonly enteredHubGeofenceGQLService: EnteredHubGeofenceGQL,
    private readonly dwellHubGeofenceGQLService: DwellHubGeofenceGQL,
    private readonly exitedHubGeofenceGQLService: ExitedHubGeofenceGQL,
    private readonly activateHubGQLService: ActivateHubGQL,
    private readonly deactivateHubGQLService: DeactivateHubGQL,
    private readonly microChatToHubGQLService: MicroChatToHubGQL,
    private readonly createMicroChatGQLService: CreateMicroChatGQL,
    private readonly deleteMicroChatGQLService: DeleteMicroChatGQL,
    private readonly invitesByHubGQLService: InvitesByHubGQL,
    private readonly deleteInviteGQLService: DeleteInviteGQL,
    private readonly inviteGQLService: InviteGQL,
    private readonly acceptHubInviteGQLService: AcceptHubInviteGQL,
    private readonly leaveHubGQLService: LeaveHubGQL,
    private readonly changeHubLocationGQLService: ChangeHubLocationGQL,
    private readonly reportHubAsInappropriate: ReportHubAsInappropriateGQL,
    private readonly errorService: ErrorService,
  ) { }

  async usersHubs(fetchPolicy: FetchPolicy = 'cache-first') {
    const result = await this.userHubsGQLService.fetch(null, {
      fetchPolicy
    }).toPromise();

    const response = result.data.usersHubs;

    if (response) {
      this.logger.log('usersHubs successful.');
    } else {
      this.logger.log('usersHubs failure');
    }

    return response;
  }

  watchUsersPeople(fetchPolicy: FetchPolicy = 'cache-first', pollInterval = 0) {
    return this.usersPeopleGQLService.watch(null, {
      fetchPolicy,
      pollInterval
    });
  }

  async usersPeople(fetchPolicy: FetchPolicy = 'network-only') {
    const result = await this.usersPeopleGQLService.fetch(null, {
      fetchPolicy
    }).toPromise();

    const response = result.data.usersPeople;

    if (response) {
      this.logger.log('usersPeople successful.');
    } else {
      this.logger.log('usersPeople failure');
    }

    return response;
  }

  async commonUsersHubs(otherUsersId: Scalars['ID']['output'], fetchPolicy: FetchPolicy = 'network-only') {
    const result = await this.commonUsersHubsGQLService.fetch({
      otherUsersId
    },
      {
        fetchPolicy
      }).toPromise();

    const response = result.data.commonUsersHubs;

    if (response) {
      this.logger.log('commonUsersHubs successful.');
    } else {
      this.logger.log('commonUsersHubs failure');
    }

    return response;
  }

  async editHub(hubId: Scalars['ID']['output'], name: string, description: string) {
    const result = await this.editHubGQLService.mutate({
      hubId,
      name,
      description
    }).toPromise();

    const response = result.data.editHub;

    if (response) {
      this.logger.log('editHub successful.');
    } else {
      this.logger.log('editHub failure');
    }

    return response;
  }

  async changeHubLocation(hubId: Scalars['ID']['output'], latitude: number, longitude: number) {
    const result = await this.changeHubLocationGQLService.mutate({
      hubId,
      latitude,
      longitude
    }).toPromise();

    const response = result.data.changeHubLocation;

    if (response) {
      this.logger.log(`${this.changeHubLocation.name} successful.`);
    } else {
      this.logger.log(`${this.changeHubLocation.name} failure.`);
    }

    return response;
  }

  async hub(id: Scalars['ID']['output'], fetchPolicy: FetchPolicy = 'cache-first') {
    const result = await this.hubGQLService.fetch({
      id
    },
      {
        fetchPolicy
      }).toPromise();

    const response = result.data.hub;

    if (response) {
      this.logger.log('got hub successful.');
    } else {
      this.logger.log('hub query failure');
    }

    return response;
  }

  watchHub(id: Scalars['ID']['output'], fetchPolicy: FetchPolicy = 'cache-first', pollInterval = 0) {
    return this.hubGQLService.watch({
      id
    },
      {
        pollInterval,
        fetchPolicy
      });
  }

  watchInvite(inviteId: Scalars['ID']['output'], fetchPolicy: FetchPolicy = 'cache-first') {
    return this.inviteGQLService.watch({
        inviteId
      }, {
        fetchPolicy
      });
  }

  watchInvitesByHub(hubId: Scalars['ID']['output'], includeAccepted: boolean, fetchPolicy: FetchPolicy = 'cache-first') {
    return this.invitesByHubGQLService.watch({
      hubId,
      includeAccepted
    } as QueryInvitesByHubArgs, {
      fetchPolicy
    });
  }

  async inviteUserToHub(hubId: Scalars['ID']['output'], shareableId: string) {
    try {
      const result = await this.inviteUserToHubGQLService.mutate({
        hubId,
        inviteesShareableId: shareableId
      }, {
        refetchQueries: [
          { query: InvitesByHubDocument, variables: { hubId, includeAccepted: false } as InvitesByHubQueryVariables },
          { query: UsersPeopleDocument },
        ]
      }).toPromise();

      const response = result?.data?.inviteUserToHub;
      return response;
    } catch (error) {
      this.errorService.handleError(error);
    }
  }

  async acceptHubInvite(inviteId: Scalars['ID']['output']) {
    const result = await this.acceptHubInviteGQLService.mutate({
      inviteId
    }, {
      refetchQueries: [
        { query: UsersHubsDocument },
        { query: InvitesByUserDocument },
      ],
      awaitRefetchQueries: true,
    }).toPromise();
  }

  async deleteInvite(hubId: any, inviteId: any) {
    const result = await this.deleteInviteGQLService.mutate({
      hubId,
      inviteId
    }, {
      refetchQueries: [
        { query: UsersHubsDocument },
        { query: InvitesByHubDocument, variables: { hubId, includeAccepted: false } as InvitesByHubQueryVariables },
        { query: UsersPeopleDocument },
      ],
      awaitRefetchQueries: true,
    }).toPromise();

    return result.data.deleteInvite;
  }

  async leaveHub(hubId: Scalars['ID']['output']) {
    const result = await this.leaveHubGQLService.mutate({
      hubId
     }, {
       refetchQueries: [
         { query: UsersHubsDocument }
       ]
     }).toPromise();
  }

  async deleteHub(id: Scalars['ID']['output']): Promise<boolean> {
    const result = await this.deleteHubGQLService.mutate({
      id
    }, {
      update: (cache, { data: { deleteHub } }) => {
       const normalizedId = cache.identify({id, __typename: 'Hub', } as Hub);
       cache.evict({id: normalizedId});
       cache.gc();
      }
    }).toPromise();

    const response = result.data.deleteHub;
    return response;
  }

  async setHubStarred(hubId: Scalars['ID']['output']) {
    const result = await this.setHubStarredGQLService.mutate({
      hubId
    }).toPromise();

    const response = result.data.setHubStarred;
    return response;
  }

  async setHubNotStarred(hubId: Scalars['ID']['output']) {
    const result = await this.setHubNotStarredGQLService.mutate({
      hubId
    }).toPromise();

    const response = result.data.setHubNotStarred;
    return response;
  }

  async enteredHubGeofence(hubId: Scalars['ID']['output']) {
    const result = await this.enteredHubGeofenceGQLService.mutate({
      hubId
    }).toPromise();

    this.logger.log(`enteredHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }

  async dwellHubGeofence(hubId: Scalars['ID']['output']) {
    const result = await this.dwellHubGeofenceGQLService.mutate({
      hubId
    }).toPromise();

    this.logger.log(`dwellHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }

  async exitedHubGeofence(hubId: Scalars['ID']['output']) {
    const result = await this.exitedHubGeofenceGQLService.mutate({
      hubId
    }).toPromise();

    this.logger.log(`exitedHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }

  async activateHub(hubId: Scalars['ID']['output']) {
    const result = await this.activateHubGQLService.mutate({
      hubId
    }).toPromise();
    return result;
  }

  async deactivateHub(hubId: Scalars['ID']['output']) {
    const result = await this.deactivateHubGQLService.mutate({
      hubId
    }).toPromise();

    return result;
  }

  async sendMicroChat(hubId: Scalars['ID']['output'], microChatId: Scalars['ID']['output']) {
    const result = await this.microChatToHubGQLService.mutate({
      hubId,
      microChatId
    }).toPromise();

    const response = result.data.microChatToHub;
    return response;
  }

  async createMicroChat(hubId: Scalars['ID']['output'], microChatText: string) {
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

          // Add new micro-chat to hub's array of micro-chats
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

  async deleteMicroChat(hubId: Scalars['ID']['output'], microChatId: Scalars['ID']['output']) {
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

          // Remove micro-chat from hub's array of micro-chats
          const microChat = data.hub.hub.microChats.find(x => x.id === microChatId);
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

  async reportAsInappropriate(hubId: any) {
    const result = await this.reportHubAsInappropriate.mutate({
      hubId
    }).toPromise();
  }
}
