import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tournament, Match } from '../../models/tournament.model';
import { TournamentService } from '../../services/tournament.service';
import { MatchComponent } from '../match/match.component';

@Component({
  selector: 'app-tournament-bracket',
  standalone: true,
  imports: [CommonModule, MatchComponent],
  template: `
    <div class="tournament-bracket">
      <div *ngFor="let round of rounds" class="round">
        <div class="round-header">Round {{round}}</div>
        <div class="matches">
          <app-match
            *ngFor="let match of getMatchesByRound(round)"
            [match]="match"
            (winnerSelected)="onWinnerSelected($event)"
          ></app-match>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tournament-bracket {
      display: flex;
      gap: 2rem;
      padding: 2rem;
      overflow-x: auto;
    }
    
    .round {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 200px;
    }
    
    .round-header {
      font-weight: bold;
      text-align: center;
      padding: 0.5rem;
      background: #f0f0f0;
      border-radius: 4px;
    }
    
    .matches {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      justify-content: space-around;
      height: 100%;
      padding: 1rem 0;
    }
  `]
})
export class TournamentBracketComponent implements OnInit {
  tournament?: Tournament;
  rounds: number[] = [];

  constructor(private tournamentService: TournamentService) {
    this.tournamentService.tournament$.subscribe(tournament => {
      if (tournament) {
        this.tournament = tournament;
        this.rounds = Array(tournament.rounds).fill(0).map((_, i) => i + 1);
      }
    });
  }

  ngOnInit() {
    const playersJson = localStorage.getItem('tournamentPlayers');
    if (playersJson) {
      const players = JSON.parse(playersJson);
      this.tournament = this.tournamentService.createTournament(players);
    }
  }

  getMatchesByRound(round: number): Match[] {
    return this.tournament?.matches.filter(match => match.round === round) || [];
  }

  onWinnerSelected(match: Match) {
    this.tournamentService.updateMatch(match);
  }
}
