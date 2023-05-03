import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss']
})
export class HelpPageComponent implements OnInit {
  text: string[];

  constructor() { }

  ngOnInit(): void {
  }

  setLocation() {
    this.text = []
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position.coords)
      this.text.push('accuracy: ' + position.coords.accuracy);
      this.text.push('latitude: ' + position.coords.latitude);
      this.text.push('longitude: ' + position.coords.longitude);
    }, error => {
      const { code } = error

      switch (code) {
        case GeolocationPositionError.TIMEOUT:
          this.text.push('время получения геолокации истекло')
          break
        case GeolocationPositionError.PERMISSION_DENIED:
          this.text.push('вы запретили трекинг своей геопозиции')
          break
        case GeolocationPositionError.POSITION_UNAVAILABLE:
          this.text.push('получить местоположение не удалось')
          break
      }
    },{
      enableHighAccuracy: true
    })
  }
}
