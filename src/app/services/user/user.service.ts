import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  async blockUser(userId: any) {
    throw Error('not yet implemented');
  }

  async unblockUser(userId: any) {
    throw Error('not yet implemented');
  }
}
