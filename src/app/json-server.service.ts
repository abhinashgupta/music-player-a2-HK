import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JsonServerService {
  private apiUrl = 'http://localhost:3000/songs';
}
