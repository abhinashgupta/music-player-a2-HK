import { Injectable } from '@angular/core';
import axios from 'axios';
import * as qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private clientId = '3922b61dc64842779e72a509ca734ef0';
  private clientSecret = '0a899872a36944909f96e29f4a9ebbd0';
  private accessToken: String =
    'BQCp_cmTncUE8218Xokxe_fc1r4w5JPr53uBHWleFux-faceqGH8WyAOEGCpCvuJguEF84IARIhkH4MyiQPdCceor_KuQxnrS_YUPkhAmQ_OkggQ8OY';

  constructor() {
    this.authenticate();
  }

  private async authenticate() {
    const encodedData = btoa(`${this.clientId}:${this.clientSecret}`);
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify({
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            Authorization: `Basic ${encodedData}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      this.accessToken = response.data.access_token;
      console.log('Access Token:', this.accessToken);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  }

  public async getPlaylist(playlistId: string) {
    if (!playlistId) {
      console.error('Playlist ID is not provided');
      return;
    }

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  }

  public async createPlaylist(
    userId: string,
    name: string,
    description: string = ''
  ) {
    try {
      const response = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: name,
          description: description,
          public: false, // Set to true if you want the playlist to be public
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  }


  public async getUserPlaylists(userId: string) {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
      return response.data.items;
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  }
}
