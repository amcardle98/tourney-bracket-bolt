import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TournamentBracketComponent } from './components/tournament-bracket/tournament-bracket.component';
import { PlayerSetupComponent } from './components/player-setup/player-setup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TournamentBracketComponent, PlayerSetupComponent],
  template: `
    <div class="container">
      <h1>Tournament Bracket</h1>

      <div *ngIf="!tournamentStarted">
        <app-player-setup
          (setupComplete)="startTournament($event)"
        ></app-player-setup>
      </div>

      <div *ngIf="tournamentStarted">
        <app-tournament-bracket></app-tournament-bracket>
        <button class="reset-button" (click)="resetTournament()">
          Reset Tournament
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 2rem;
      }

      h1 {
        margin-bottom: 2rem;
        text-align: center;
      }

      .reset-button {
        display: block;
        margin: 2rem auto;
        padding: 0.75rem 1.5rem;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
      }

      .reset-button:hover {
        background-color: #c82333;
      }
    `,
  ],
})
export class AppComponent {
  tournamentStarted = false;

  startTournament(players: string[]) {
    this.tournamentStarted = true;
    // The tournament bracket component will handle the player data
    localStorage.setItem('tournamentPlayers', JSON.stringify(players));
  }

  resetTournament() {
    this.tournamentStarted = false;
    localStorage.removeItem('tournamentPlayers');
  }
}
