import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css'],
})
export class MusicPlayerComponent implements OnInit, AfterViewInit {
  private playlistId = '37i9dQZF1DXcBWIGoYBM5M';
  private currentTrackIndex = 0;
  public tracks: any[] = [];
  public currentTrack: any;
  private audio: HTMLAudioElement = new Audio();
  volume: number = 0.5;
  currentTime: number = 0;
  duration: number = 0;
  searchQuery: string = '';
  filteredTracks: any[] = [];
  isShuffled: boolean = false;
  originalTracks: any[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      this.authService.alertIfTokenExpired();
      const playlist = await this.spotifyService.getPlaylist(this.playlistId);
      this.tracks = playlist.tracks.items.map((item: any) => item.track);
      this.originalTracks = [...this.tracks];
      this.filteredTracks = this.tracks;
      this.setCurrentTrack();
    } catch (error) {
      console.error('Error loading playlist:', error);
    }
  }

  ngAfterViewInit(): void {
    this.updateVolume();

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
    });

    this.audio.addEventListener('ended', () => {
      this.skip();
    });
  }

  updateVolume() {
    this.audio.volume = this.volume;
  }

  setCurrentTrack() {
    if (this.filteredTracks.length) {
      this.currentTrack = this.filteredTracks[this.currentTrackIndex];
      if (this.currentTrack.preview_url) {
        this.audio.src = this.currentTrack.preview_url;
        this.audio.load();
      }
    }
  }

  play() {
    if (this.currentTrack && this.currentTrack.preview_url) {
      this.audio.play();
    } else {
      this.skip();
    }
  }

  pause() {
    this.audio.pause();
  }

  skip() {
    if (this.filteredTracks.length) {
      this.currentTrackIndex =
        (this.currentTrackIndex + 1) % this.filteredTracks.length;
      this.setCurrentTrack();
      this.play();
    }
  }

  shuffle() {
    if (this.isShuffled) {
      this.filteredTracks = [...this.originalTracks];
      this.isShuffled = false;
    } else {
      for (let i = this.filteredTracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.filteredTracks[i], this.filteredTracks[j]] = [
          this.filteredTracks[j],
          this.filteredTracks[i],
        ];
      }
      this.isShuffled = true;
    }
    this.currentTrackIndex = 0;
    this.setCurrentTrack();
    this.play();
  }

  onProgressChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.audio.currentTime = Number(target.value);
  }

  getTrackDuration(duration_ms: number): string {
    const minutes = Math.floor(duration_ms / 60000);
    const seconds = Math.floor((duration_ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  search() {
    if (this.searchQuery.trim() === '') {
      this.filteredTracks = this.tracks;
    } else {
      const searchQueryLower = this.searchQuery.toLowerCase();
      this.filteredTracks = this.tracks.filter(
        (track) =>
          track.name.toLowerCase().includes(searchQueryLower) ||
          track.artists[0].name.toLowerCase().includes(searchQueryLower)
      );
    }
    this.currentTrackIndex = 0;
    this.setCurrentTrack();
  }

  goToPlaylistManager() {
    this.router.navigate(['/playlist-manager']);
  }
}
