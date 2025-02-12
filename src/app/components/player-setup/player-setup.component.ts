import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="setup-container">
      <div class="input-group">
        <label for="playerCount">Number of Players:</label>
        <input 
          type="number" 
          id="playerCount" 
          [(ngModel)]="playerCount" 
          min="2" 
          max="32"
          (change)="updatePlayerInputs()"
        >
      </div>

      <div class="players-list">
        <div *ngFor="let player of players; let i = index" class="player-input">
          <label for="player{{i}}">Player {{i + 1}}:</label>
          <input 
            type="text" 
            id="player{{i}}" 
            [(ngModel)]="players[i]"
            placeholder="Enter player name"
          >
        </div>
      </div>

      <button 
        (click)="startTournament()" 
        [disabled]="!isValid()"
        class="start-button"
      >
        Start Tournament
      </button>
    </div>
  `,
  styles: [`
    .setup-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 1rem;
    }

    .input-group {
      margin-bottom: 1.5rem;
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .input-group label {
      min-width: 120px;
    }

    .input-group input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 80px;
    }

    .players-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      max-height: 400px;
      overflow-y: auto;
    }

    .player-input {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .player-input label {
      min-width: 80px;
    }

    .player-input input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .start-button {
      width: 100%;
      padding: 0.75rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .start-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .start-button:hover:not(:disabled) {
      background-color: #45a049;
    }
  `]
})
export class PlayerSetupComponent {
  @Output() setupComplete = new EventEmitter<string[]>();
  
  playerCount: number = 8;
  players: string[] = Array(8).fill('').map((_, i) => `Player ${i + 1}`);

  updatePlayerInputs() {
    const newCount = Math.min(Math.max(2, this.playerCount), 32);
    this.playerCount = newCount;
    
    if (newCount > this.players.length) {
      // Add new players
      const toAdd = newCount - this.players.length;
      for (let i = 0; i < toAdd; i++) {
        this.players.push(`Player ${this.players.length + 1}`);
      }
    } else if (newCount < this.players.length) {
      // Remove excess players
      this.players = this.players.slice(0, newCount);
    }
  }

  isValid(): boolean {
    return this.players.every(name => name.trim() !== '') && 
           this.players.length >= 2 &&
           this.players.length <= 32;
  }

  startTournament() {
    if (this.isValid()) {
      this.setupComplete.emit(this.players);
    }
  }
}
