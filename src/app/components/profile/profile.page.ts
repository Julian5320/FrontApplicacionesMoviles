import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "../../services/auth.service";
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  nombre: string;

  constructor(private authSvc: AuthService, private router: Router, private afAuth: AngularFireAuth, private storage: Storage, private alertController: AlertController) { }

  ngOnInit() {
  }

  onLogout() {
    this.storage.clear();
    this.authSvc.isLogged = false;
    console.log('Sesion cerrada');
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/login');

  }

  async presentAlert(val) {
    const alert = await this.alertController.create({
      header: val,
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async getUser() {
    var user = await this.authSvc.getUser();
    console.log(user);
  }

}
