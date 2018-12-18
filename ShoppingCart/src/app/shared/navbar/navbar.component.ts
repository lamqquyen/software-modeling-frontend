import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { NgbModal } from 'node_modules/@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.css' ]
})
export class NavbarComponent implements OnInit {
  auth: boolean;
  listener: EventEmitter<any>;
  navSearchForm: FormGroup;
  username: string;
  numberOfProducts = 0;
  constructor(private accountService: AccountService, private productService: ProductService, private router: Router) {
    const self = this;
    self.listener = accountService.listener;
    self.listener.subscribe(() => {
      self.auth = self.accountService.isLoggedIn();
    });
  }

  logout() {
    const self = this;
    self.auth = !self.auth;
    self.accountService.logout();
    self.router.navigate([ '/login' ]);
  }

  ngOnInit() {
    const self = this;
    self.auth = self.accountService.isLoggedIn();
    self.username = self.accountService.getUsername();
    self.numberOfProducts = self.productService.getCart().total;
    self.navSearchForm = new FormGroup({
      search: new FormControl('', null)
    });
    self.productService.cartChange.subscribe(() => {
      self.numberOfProducts = self.productService.getCart().total;
    });
  }

  search(value) {
    const self = this;
    if (value.search !== '') {
      self.router.navigate([ '/products' ]);
      self.productService.searchByNavbar = value.search;
      self.productService.searchNavBarEvent.emit();
      self.navSearchForm.controls['search'].setValue('');
    }
  }
}
