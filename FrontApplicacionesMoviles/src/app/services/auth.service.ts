import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "../shared/user.class";
import { Storage } from '@ionic/storage';
import { isDefined } from '@angular/compiler/src/util';
import { Router } from "@angular/router";
import { auth } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthService{

  public isLogged: any = false;
  public token: any;

  constructor(public afAuth: AngularFireAuth, private storage: Storage, private router: Router) {
    afAuth.authState.subscribe(user => {
      this.isLogged = user
    });
  }

  getUser() {
    var userId = this.afAuth.auth.currentUser;
    if (userId != null) {
      return userId;
    }
  }
  async onLogin(user: User) {
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
    } catch(error) {
      return error;
    }
  }

  async onRegister(user: User) {
    try {
      return await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
    } catch (error) {
      return error;
    }
  }

  async tokenValidation() {
    await this.storage.get('token').then((val) => {
      this.token = val;
    });

    if(this.token) {
      return this.token;
    } else {
      return this.token;
    }
  }
}

