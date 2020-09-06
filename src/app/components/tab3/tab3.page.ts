import { Component, OnInit, ViewChild } from '@angular/core';
import { TareasService } from "../../services/tareas.service";
import { CalendarComponent } from "ionic2-calendar/calendar";
import { AlertController } from '@ionic/angular';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  event = {
    title: '',
    descr: '',
    startTime: '',
    endTime: '',
    allDay: false,
    id_user: this.authSvc.getUser().uid
  };

  minDate = new Date().toISOString();

  tarea = {
    nombre: '',
    cargo: '',
    descripcion: '',
    id_user: this.authSvc.getUser().uid
  };

  userId: string;
  eventSource: any = [];

  @ViewChild(CalendarComponent, {static: false}) myCal: CalendarComponent;

  constructor(private tareaService: TareasService, private alertCtrl: AlertController, private authSvc: AuthService) {
    this.userId = authSvc.getUser().uid;
  }

  ngOnInit(): void {

  }

  async addEvent() {
    let eventCopy = {
      title: this.event.title,
      descr: this.event.descr,
      startTime:  new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      id_user: this.userId
    }
 
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      //eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      //eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
 
    await this.tareaService.saveEvent(eventCopy).subscribe(
      res => {
        this.resetEvent();
      },
      err => console.log(err)
    );
    /*const alert = this.alertCtrl.create({
      header: event.title,
      subHeader: event.descr,
      message: 'Desde: ' + start + '<br><br>Hasta: ' + end,
      buttons: ['OK']
    });
    alert.present();*/
  }

  addTarea() {
    this.tareaService.saveTarea(this.tarea).subscribe(
      res => {
        console.log(res);
        this.resetTarea();
      },
      err => console.error(err)
    )
  }

  resetEvent() {
    this.event = {
      title: '',
      descr: '',
      startTime: '',
      endTime: '',
      allDay: false,
      id_user: ''
    };
  }
  resetTarea() {
    this.tarea = {
      nombre: '',
      cargo: '',
      descripcion: '',
      id_user: ''
    };
  }


}
