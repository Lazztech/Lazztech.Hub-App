import { Injectable } from '@angular/core';
import { BlockUserGQL, ReportUserAsInappropriateGQL, UnblockUserGQL } from 'src/graphql/graphql';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly blockUserGQLService: BlockUserGQL,
    private readonly unblockUserGQLService: UnblockUserGQL,
    private readonly reportUserAsInappropriate: ReportUserAsInappropriateGQL,
  ) { }

  async blockUser(userId: any) {
    const result = await this.blockUserGQLService.mutate({
      toUserId: userId
    }).toPromise();
  }

  async unblockUser(userId: any) {
    const result = await this.unblockUserGQLService.mutate({
      toUserId: userId
    }).toPromise();
  }

  async reportAsInappropriate(userId: any) {
    const result = await this.reportUserAsInappropriate.mutate({
      toUserId: userId
    }).toPromise();
  }
}
