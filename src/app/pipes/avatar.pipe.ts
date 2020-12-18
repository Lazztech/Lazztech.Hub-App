import { Pipe, PipeTransform } from '@angular/core';
import { SERVER_URL } from 'src/environments/environment';

@Pipe({
  name: 'avatar'
})
export class AvatarPipe implements PipeTransform {
  serverUrl = SERVER_URL;
  transform(id: unknown, ...args: unknown[]): unknown {
    return `${this.serverUrl}avatars/285/${id}.png`;
  }

}
