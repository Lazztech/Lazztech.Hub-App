import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MomentModule } from 'ngx-moment';
import { DirectivesModule } from '../directives/directives.module';
import { MicroChatAddPage } from '../pages/micro-chat-add/micro-chat-add.page';
import { PipesModule } from '../pipes/pipes.module';
import { ActivityDotComponent } from './activity-dot/activity-dot.component';
import { EventCardComponent } from './event-card/event-card.component';
import { HubCardComponent } from './hub-card/hub-card.component';
import { HubProfileComponent } from './hub-profile/hub-profile.component';
import { InviteComponent } from './invite/invite.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { MicroChatComponent } from './micro-chat/micro-chat.component';
import { ProfileComponent } from './profile/profile.component';
import { MaplibreComponent } from './maplibre/maplibre.component';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';

@NgModule({
    declarations: [
        HubCardComponent,
        ActivityDotComponent,
        ProfileComponent,
        MicroChatComponent,
        MicroChatAddPage,
        HubProfileComponent,
        LeafletMapComponent,
        EventCardComponent,
        InviteComponent,
        MaplibreComponent,
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule,
        PipesModule,
        MomentModule,
        NgxMapLibreGLModule
    ],
    exports: [
        HubCardComponent,
        ActivityDotComponent,
        ProfileComponent,
        MicroChatComponent,
        HubProfileComponent,
        LeafletMapComponent,
        EventCardComponent,
        InviteComponent,
        MaplibreComponent,
    ]
})
export class ComponentsModule {

}
