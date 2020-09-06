import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { User } from "../../shared/user.class";
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: User = new User();

  constructor(private authSvc: AuthService, private router: Router, private storage: Storage, private alertController: AlertController) { 
    //this.authSvc.tokenValidation();
  }

  ngOnInit() {
  }

  async onLogin() {
    const user = await this.authSvc.onLogin(this.user);

    if(!user.message) {
      this.storage.set('token' , user.user.refreshToken);
      this.router.navigateByUrl('/tabs/tab1');
      console.log('Logueado con exito');
    } else {
      var val = {
        header: 'Error',
        subHeader: '',
        message: user.message,
      }
      this.presentAlert(val);
    }
  }
  data() {
    this.storage.get('token').then((val) => {
      this.presentAlert(val);
    });
  }

  async presentAlert(val) {
    const alert = await this.alertController.create({
      header: val.header,
      subHeader: val.subHeader,
      message: val.message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
