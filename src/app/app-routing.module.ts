import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaylistManagerComponent } from './playlist-manager/playlist-manager.component';
import { MusicPlayerComponent } from './music-player/music-player.component';


const routes: Routes = [
  { path: '', component: MusicPlayerComponent },
  { path: 'playlist-manager', component: PlaylistManagerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
