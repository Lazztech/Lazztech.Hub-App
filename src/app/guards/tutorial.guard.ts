import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TutorialGuard implements CanActivate {

  constructor(
    private storage: Storage,
    private router: Router,
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const isComplete = await this.storage.get('tutorialCompleted');

    if (!isComplete) {
      this.router.navigateByUrl('tutorial');
    }

    return isComplete;
  }
  
}
