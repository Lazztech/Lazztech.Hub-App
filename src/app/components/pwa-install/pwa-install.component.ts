import { Component } from '@angular/core';
import { Config } from '@ionic/angular';
import { DebuggerService } from 'src/app/services/debugger/debugger.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-pwa-install',
  templateUrl: './pwa-install.component.html',
  styleUrls: ['./pwa-install.component.css']
})
export class PwaInstallComponent {

  public mode: string;

  constructor(
    readonly debugService: DebuggerService,
    private readonly config: Config,
    public readonly themeService: ThemeService,
  ) {
    this.mode = this.config.get("mode");
  }

}
