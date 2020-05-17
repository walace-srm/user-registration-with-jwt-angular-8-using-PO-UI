import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map, switchMap } from 'rxjs/operators';
import { AuthenticationService, UserService, AlertService } from '../_services';
import { TranslateService } from '@ngx-translate/core';
import { markControlAsDirty } from 'src/libs/util';
import { PoNotificationService, PoToasterOrientation } from '@po-ui/ng-components';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { SearchCepService } from '../_services/search-cep.service';
import { User } from '../_models';

//import { AlertService, UserService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private translateService: TranslateService,
        private poNotificationService: PoNotificationService,
        private searchCep: SearchCepService,
        private route: ActivatedRoute
    ) {
        // redirect to home if already logged in
        // if (this.authenticationService.currentUserValue) {
        //     this.router.navigate(['/']);
        // }

    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            addres: this.formBuilder.group({
                cep: [''],
                number: [''],
                complement: [''],
                street: [''],
                neighborhood: [''],
                city: [''],
                state: ['']
            })
        });

        //PRECISO VERIFICAR LOOP NA TELA DE CADASTRO

        // this.route.params.pipe(
        //     map((params: User) => params['id']),
        //     switchMap(id => this.userService.getById(id))).subscribe(user => this.updateForm(user));
    }
    

    updateForm(user) {
        this.registerForm.patchValue({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            //email: user.email,
            password: user.password,
            cep: user.cep,
            number: user.number,
            street: user.logradouro,
            neighborhood: user.bairro,
            city: user.localidade,
            state: user.uf
        });
    }

    loadDataForm(data) {
        this.registerForm.patchValue({
            addres: {
                street: data.logradouro,
                number: '',
                complement: data.complement,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf
            }
        });
    }

    fetchCep() {
        let cep = this.registerForm.get('addres.cep').value;
        if (cep != null && cep !== '') {
            this.searchCep.getCep(cep).subscribe(data => {
                this.loadDataForm(data)
            });
        }
    }

    //convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            markControlAsDirty(this.registerForm);
            return this.poNotificationService.warning({
                message: this.translateService.instant('Verify the required fields'),
                orientation: PoToasterOrientation.Top
            });
        }
        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.poNotificationService.success({
                        message: this.translateService.instant('Registration successful'),
                        orientation: PoToasterOrientation.Top
                    })
                    this.router.navigate(['/login']);
                },
                error => {
                   this.poNotificationService.warning({
                       message: this.translateService.instant(error),
                       orientation: PoToasterOrientation.Top
                   })
                    this.loading = false;
                });
    }
}
