import { Component, OnInit } from '@angular/core';
import { TareasService } from "../../services/tareas.service";
import { AlertController } from '@ionic/angular';
import { AuthService } from "../../services/auth.service";


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  tareas: any = [];
  tarea: any;
  userId: string;

  constructor(private tareaService: TareasService, private alertController: AlertController, private authSvc: AuthService) {
    this.userId = authSvc.getUser().uid;
  }

  ngOnInit(): void {
    this.tareaService.getTareas(this.userId).subscribe(
      res => {
        this.tareas = res;
      },
      err => console.log(err)
    )
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.tareaService.getTareas(this.userId).subscribe(
      res => {
        this.tareas = res;
        event.target.complete();
        console.log('Async operation has ended');
      },
      err => console.log(err)
    )
  }

  refresh() {
    this.tareaService.getTareas(this.userId).subscribe(
      res => {
        this.tareas = res;
        console.log('Async operation has ended');
      },
      err => console.log(err)
    )
  }

  async finalizar() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Estas seguro que deseas finalizar esta tarea?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            //this.tareaService.updateTarea()
          }
        }
      ]
    });

    await alert.present();
  }

  async editar(id) {
    await this.tareaService.getTarea(id).subscribe(
      async res => {
        this.tarea = res;
        console.log(res)
        const alert = await this.alertController.create({
          header: 'Edita tu tarea!',
          inputs: [
            {
              name: 'nombre',
              type: "text",
              value: this.tarea.nombre,
              placeholder: 'Nombre'
            },
            {
              name: 'cargo',
              type: "text",
              value: this.tarea.cargo,
              placeholder: 'Materia'
            },
            {
              name: 'descripcion',
              type: "text",
              value: this.tarea.descripcion,
              placeholder: 'Descripcion'
            }
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Guardar',
              handler: async data => {
                console.log('Confirm Ok', data);
                await this.actualizar(this.tarea.id, data)
                this.refresh();
              }
            }
          ]
        });

        await alert.present();
      },
      err => console.log(err)
    )
    
  }

  async actualizar(id, data) {
    await this.tareaService.updateTarea(id, data).subscribe(
      res =>{
        console.log(res)
        return res
      },
      err => {
        console.log(err)
        return err
      }
    ) 
  }

  async delete(id) {
    const alert = await this.alertController.create({
      header: 'Eliminar!',
      message: 'Se eliminara la tarea, estas seguro?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Tarea no eliminada');
          }
        }, {
          text: 'Si',
          handler: async () => {
            console.log('Eliminando');
            await this.tareaService.deleteTarea(id).subscribe(
              async res => {
                console.log(res)
                await this.tareaService.getTareas(this.userId).subscribe(
                  res => {
                    this.tareas = res;
                    console.log('Cargando...');
                  },
                  err => console.log(err)
                )
              },
              err => {
                console.log(err)
              }
            )
          }
        }
        
      ]
    });
    await alert.present();
  }
}
