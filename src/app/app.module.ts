import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SQLite } from '@ionic-enterprise/secure-storage/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { UnauthInterceptor } from './interceptors/unauth-interceptor';
import { SessionVaultService } from './services/session-vault.service';

const appInitFactory =
  (sessionVault: SessionVaultService): (() => Promise<void>) =>
  () =>
    sessionVault.init();

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [SessionVaultService],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
