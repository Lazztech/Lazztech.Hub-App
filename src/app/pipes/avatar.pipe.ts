import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'avatar'
})
export class AvatarPipe implements PipeTransform {
  transform(id: unknown, ...args: unknown[]): unknown {
    return `${environment.serverUrl}avatars/285/${id}.png`;
  }

}
