import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match, Participant } from '../../models/tournament.model';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="match">
      <div 
        class="participant" 
        [class.winner]="match.winner?.id === match.participant1?.id"
        [class.clickable]="isClickable(match.participant1)"
        [class.bye]="isBye()"
        (click)="selectWinner(match.participant1)"
      >
        <span>{{ match.participant1?.name || 'TBD' }}</span>
        <span *ngIf="isBye()" class="bye-label">(Bye)</span>
      </div>
      <div 
        class="participant"
        [class.winner]="match.winner?.id === match.participant2?.id"
        [class.clickable]="isClickable(match.participant2)"
        (click)="selectWinner(match.participant2)"
      >
        <span>{{ match.participant2?.name || 'TBD' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .match {
      border: 1px solid #ccc;
      border-radius: 4px;
      overflow: hidden;
      background: white;
      margin: 0.5rem 0;
    }
    
    .participant {
      padding: 0.75rem;
      border-bottom: 1px solid #ccc;
      background: #f8f8f8;
      user-select: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .participant:last-child {
      border-bottom: none;
    }
    
    .clickable {
      cursor: pointer;
      background-color: #f0f0f0;
    }
    
    .clickable:hover {
      background-color: #e0e0e0;
    }
    
    .winner {
      background-color: #e6ffe6;
      font-weight: bold;
    }

    .bye {
      background-color: #f8f8f8;
    }

    .bye-label {
      font-size: 0.8em;
      color: #666;
      font-style: italic;
    }
  `]
})
export class MatchComponent {
  @Input() match!: Match;
  @Output() winnerSelected = new EventEmitter<Match>();

  isClickable(participant?: Participant): boolean {
    if (!participant) return false;
    // Allow clicking even in bye matches
    return true;
  }

  isBye(): boolean {
    return !!(this.match.participant1 && !this.match.participant2);
  }

  selectWinner(participant?: Participant) {
    if (!participant) return;
    
    const updatedMatch: Match = {
      ...this.match,
      winner: participant
    };
    
    this.winnerSelected.emit(updatedMatch);
  }
}
