import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

//import { User } from '@/_models';
//import { UserService, AuthenticationService } from '@/_services';
import { User } from '../_models';
import { AuthenticationService, UserService } from '../_services';
import { PoModalComponent, PoModalAction, PoTableColumn, PoTableAction } from '@po-ui/ng-components';
import { TranslateService } from '@ngx-translate/core';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    @ViewChild(PoModalComponent, {static: false}) poModal: PoModalComponent;
    currentUser: User;
    users = [];

     public item: User[] = []
   
    public modalTitle: string;
    public modalText: string;
    public modalActions: {
        primary: PoModalAction;
        secondary: PoModalAction;
      } = {
        primary: {
          label: this.translateService.instant('Confirm'),
          action: () => {},
        },
        secondary: {
          label: this.translateService.instant('Cancel'),
          action: () => {
            this.poModal.close();
          }
        },
      };

      //SERÁ IMPLEMENTADO DEPOIS

      // readonly columns: PoTableColumn[] = [
      //   {
      //     property: 'firstName',
      //     label: this.translateService.instant('First Name'),
      //     width: '30%'
      //   },
      //   {
      //     property: 'lastName',
      //     label: this.translateService.instant('Last name'),
      //     width: '30%'
      //   },
      //   {
      //     property: 'username',
      //     label: this.translateService.instant('Username'),
      //     width: '30%'
      //   }
      // ]

      // readonly actions: PoTableAction[] = [
      //   {
      //     action: (user: User) => this.openDeleteModal(user),
      //     icon: 'po-icon po-icon-delete',
      //     label: this.translateService.instant('Delete'),
      //   }
      // ]

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private translateService: TranslateService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllUsers();
        this.fetchItems();
    }

    fetchItems() {
      this.userService.getAll().subscribe(res => {
        this.item = res;
      });
    }

    deleteUser(id) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
            this.poModal.close();
           
    }

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    openDeleteModal(user: User) {
        this.modalTitle = this.translateService.instant('Delete user');
        this.modalText = this.translateService.instant(
          'Are you sure you want to exclude the user? This action cannot be undone.');
        this.modalActions.primary.danger = true;
        this.modalActions.primary.action = () => this.deleteUser(user.id);
        this.poModal.open();
      }
}