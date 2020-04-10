import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { appRoutingModule } from './app.routing';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AlertComponent } from './_components';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
//import { CoreModule } from './core/core.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { PoModule } from '@po-ui/ng-components'

export function createTranslateLoad(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule,
        //CoreModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoad,
                deps: [HttpClient]
            }
        }),
        PoModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: LOCALE_ID, useValue: 'pt' },

        // provider used to create fake backend
        //fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { 
constructor(private translateService: TranslateService) {
    translateService.addLangs(['en', 'pt']);
        translateService.setDefaultLang['en'];
        const browserLang = translateService.getBrowserLang();
        translateService.use(browserLang.match(/en|pt/) ? browserLang : 'en');
}

};