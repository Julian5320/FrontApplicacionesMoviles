import { Component, OnInit, ViewChild, Inject, LOCALE_ID  } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AuthService } from "../../services/auth.service";
import { TareasService } from "../../services/tareas.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  event = {
    title: '',
    descr: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
 
  minDate = new Date().toISOString();
 
  eventSource: any = {};
  viewTitle;
  userId: string;
 
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
 
  @ViewChild(CalendarComponent, {static: false}) myCal: CalendarComponent;
 
  constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string, private tareaService: TareasService, private authSvc: AuthService) { 
    this.userId = authSvc.getUser().uid;
  }
 
  ngOnInit() {
    this.resetEvent();
    this.tareaService.getEventos(this.userId).subscribe(
      res => {
        this.eventSource = res;
        for(let i = 0; i <= this.eventSource.length; i++){
          this.eventSource[i].startTime = new Date(this.eventSource[i].startTime);
          this.eventSource[i].endTime = new Date(this.eventSource[i].endTime);
        }
        this.myCal.loadEvents();
      },
      err => console.log(err)
    )
  }

  async doRefresh(event) {
    await this.tareaService.getEventos(this.userId).subscribe(
      res => {        
        this.eventSource = res;
        event.target.complete();
        for(let i = 0; i <= this.eventSource.length; i++){
          this.eventSource[i].startTime = new Date(this.eventSource[i].startTime);
          this.eventSource[i].endTime = new Date(this.eventSource[i].endTime);
        }
        this.myCal.loadEvents();
        
      },
      err => console.log(err)
    )
  }
 
  resetEvent() {
    this.event = {
      title: '',
      descr: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }
  next() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.descr,
      message: 'Desde: ' + start + '<br><br>Hasta: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

}
