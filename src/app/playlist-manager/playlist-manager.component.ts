import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-playlist-manager',
  templateUrl: './playlist-manager.component.html',
  styleUrls: ['./playlist-manager.component.css'],
})
export class PlaylistManagerComponent implements OnInit {
  public playlists: any[] = [];
  public newPlaylistName: string = '';
  public newPlaylistDescription: string = '';
  public userId: string = 'smedjan'; 

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.loadUserPlaylists();
  }

  async loadUserPlaylists() {
    try {
      const fetchedPlaylists = await this.spotifyService.getUserPlaylists(
        this.userId
      );
      this.playlists = fetchedPlaylists || []; 
    } catch (error) {
      console.error('Error loading user playlists:', error);
    }
  }

  async createPlaylist() {
    try {
      const newPlaylist = await this.spotifyService.createPlaylist(
        this.userId,
        this.newPlaylistName,
        this.newPlaylistDescription
      );
      this.playlists.push(newPlaylist);
      this.newPlaylistName = '';
      this.newPlaylistDescription = '';
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  }
}
