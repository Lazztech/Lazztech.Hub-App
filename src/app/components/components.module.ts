import { NgModule } from '@angular/core';
import { HubCardComponent } from './hub-card/hub-card.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivityDotComponent } from './activity-dot/activity-dot.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MicroChatComponent } from './micro-chat/micro-chat.component';
import { MicroChatAddPageModule } from '../pages/micro-chat-add/micro-chat-add.module';
import { MicroChatAddPage } from '../pages/micro-chat-add/micro-chat-add.page';
import { HubProfileComponent } from './hub-profile/hub-profile.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartsModule } from 'ng2-charts';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { MomentModule } from 'ngx-moment';

@NgModule({
    declarations: [
        HubCardComponent,
        ActivityDotComponent,
        ProfileComponent,
        MicroChatComponent,
        MicroChatAddPage,
        HubProfileComponent,
        BarChartComponent,
        LeafletMapComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ChartsModule,
        DirectivesModule,
        PipesModule,
        MomentModule
    ],
    exports: [
        HubCardComponent,
        ActivityDotComponent,
        ProfileComponent,
        MicroChatComponent,
        HubProfileComponent,
        BarChartComponent,
        LeafletMapComponent
    ]
})
export class ComponentsModule {

}
