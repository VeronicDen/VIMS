import {Injectable} from '@angular/core';
import * as Leaflet from "leaflet";

/**
 * Сервис для работы с OSM
 */
@Injectable()
export class OpenStreetMapService {

  /** Элемент карты */
  osmElementsMap = new Map<string, Leaflet.Map>();

  /**
   * Инициирует карту
   * @param mapId идентификатор карты
   * @param zoom приближение
   * @param center координаты центра
   */
  initMap(mapId: string, zoom = 16, center: number[] = [0, 0]): Leaflet.Map {
    return new Leaflet.Map(mapId, {
      layers: [new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')],
      zoom,
      center: new Leaflet.LatLng(center[0], center[1]),
    });
  }

  /**
   * Создает маркер
   * @param latLng координаты карты
   * @param isUsers флаг маркера положения пользователя
   */
  createMarker(latLng: Leaflet.LatLng, isUsers: boolean = false): Leaflet.Marker {
    return new Leaflet.Marker(latLng, {
      icon: new Leaflet.Icon({
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        iconUrl: isUsers ? '../../assets/icons/user-map-marker.svg' : '../../assets/icons/map-marker.svg',
      }),
    } as Leaflet.MarkerOptions);
  }
}
