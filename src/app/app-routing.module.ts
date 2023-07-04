import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SetupGuard } from './guards/setup.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard, SetupGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  { path: 'landing',
    loadChildren: () => import('./pages/auth/landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterPageModule)
  },
  { path: 'password-reset',
    loadChildren: () => import('./pages/auth/password-reset/password-reset.module').then(m => m.PasswordResetPageModule),
  },
  {
    path: 'reset-pin',
    loadChildren: () => import('./pages/auth/reset-pin/reset-pin.module').then(m => m.ResetPinPageModule),
  },
  {
    path: 'privacy',
    loadChildren: () => import('./pages/profile/privacy/privacy.module').then(m => m.PrivacyPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'people',
    loadChildren: () => import('./pages/people/people.module').then(m => m.PeoplePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'hub',
    loadChildren: () => import('./pages/hub/hub.module').then(m => m.HubPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-hub',
    loadChildren: () => import('./pages/add-hub/add-hub.module').then(m => m.AddHubPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'person',
    loadChildren: () => import('./pages/people/person/person.module').then(m => m.PersonPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/profile/settings/settings.module').then(m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/profile/settings/change-password/change-password.module').then(m => m.ChangePasswordPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'delete-account',
    loadChildren: () => import('./pages/profile/settings/delete-account/delete-account.module').then(m => m.DeleteAccountPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'map', loadChildren: () => import('./pages/map/map.module').then(m => m.MapPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-hub',
    loadChildren: () => import('./pages/hub/admin-hub/admin-hub.module').then(m => m.AdminHubPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'status',
    loadChildren: () => import('./pages/status/status.module').then(m => m.StatusPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'qr',
    loadChildren: () => import('./pages/qr/qr.module').then(m => m.QrPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'preview-hub',
    loadChildren: () => import('./pages/hub/preview-hub/preview-hub.module').then(m => m.PreviewHubPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then( m => m.EventsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'event',
    loadChildren: () => import('./pages/event/event.module').then( m => m.EventPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'create-event',
    loadChildren: () => import('./pages/create-event/create-event.module').then( m => m.CreateEventPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-event',
    loadChildren: () => import('./pages/admin-event/admin-event.module').then( m => m.AdminEventPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'upload',
    loadChildren: () => import('./pages/upload/upload.module').then(m => m.UploadPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'gallery',
    loadChildren: () => import('./pages/upload-gallery/upload-gallery.module').then(m => m.UploadGalleryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'image-modal',
    loadChildren: () => import('./pages/image-modal/image-modal.module').then(m => m.ImageModalPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-uploads',
    loadChildren: () => import('./pages/manage-uploads/manage-uploads.module').then(m => m.ManageUploadsPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
