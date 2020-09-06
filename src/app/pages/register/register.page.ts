import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { User } from "../../shared/user.class";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user: User = new User();

  constructor(private authSvc: AuthService, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  async onRegister() {
    const user = await this.authSvc.onRegister(this.user);
    if (!user.message) {
      console.log('Registro completado con exito');
      this.router.navigateByUrl('/');
    } else { 
        var val = {
        header: 'Error',
        subHeader: '',
        message: user.message,
      }
      this.presentAlert(val);
    } 
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
