import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService, AlertService } from '../_services';
import { TranslateService } from '@ngx-translate/core';
import { LoginForm } from '../_models/login-form';
import { PoNotificationService, PoToasterOrientation } from '@po-ui/ng-components';
import { markControlAsDirty } from 'src/libs/util';

//import { AlertService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'login.component.html',
             styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private translateService: TranslateService,
        private poNotificationService: PoNotificationService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }

    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit({value, valid}: { value: LoginForm; valid: boolean}) {
        if (!valid)  { 
            markControlAsDirty(this.loginForm);
            return this.poNotificationService.warning({
                message: this.translateService.instant('Verify the required fields'),
                orientation: PoToasterOrientation.Top
            });
        }
        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first()).subscribe(data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.poNotificationService.warning({
                    message: error,
                    orientation: PoToasterOrientation.Top
                })
            });
    }
}
