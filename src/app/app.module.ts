import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiInterceptor } from './com/annaniks/yev-yev/core/interseptors/api.interseptors';
import { registerLocaleData } from '@angular/common';
import { en_US, hy_AM, NZ_I18N } from 'ng-zorro-antd/i18n';
import hy from '@angular/common/locales/hy';
import { LoaderInterceptor } from './com/annaniks/yev-yev/core/interseptors/loader.interceptor';

registerLocaleData(hy);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [CookieService,
    {
      provide: 'BASE_URL',
      useValue: environment.API_URL,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    { provide: NZ_I18N, useValue: hy_AM },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
