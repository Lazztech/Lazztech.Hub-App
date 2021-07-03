import { Injectable } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  async getStatus(): Promise<ConnectionStatus> {
    return await Network.getStatus();
  }

  async isConnected(): Promise<boolean> {
    const status = await this.getStatus();
    return status.connected;
  }

}
