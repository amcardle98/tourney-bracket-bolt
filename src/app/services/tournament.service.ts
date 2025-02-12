import { Injectable } from '@angular/core';
import { Tournament, Match, Participant } from '../models/tournament.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private tournament = new BehaviorSubject<Tournament | null>(null);
  tournament$ = this.tournament.asObservable();

  createTournament(participantNames: string[]): Tournament {
    const participants: Participant[] = participantNames.map((name, index) => ({
      id: index + 1,
      name
    }));

    // For 9 players, we need 5 first-round matches
    const firstRoundMatches = Math.ceil(participants.length / 2);
    const matches: Match[] = [];
    let matchId = 1;

    // Create first round matches
    let remainingParticipants = [...participants];
    for (let i = 0; i < firstRoundMatches; i++) {
      const participant1 = remainingParticipants.shift();
      const participant2 = remainingParticipants.shift();
      
      matches.push({
        id: matchId,
        round: 1,
        position: i + 1,
        participant1: participant1,
        participant2: participant2,
        nextMatchId: Math.floor(i / 2) + firstRoundMatches + 1
        // Remove automatic winner assignment for bye matches
      });
      matchId++;
    }

    // Rest of the tournament creation code remains the same...
    // Create second round matches
    const secondRoundMatches = Math.ceil(firstRoundMatches / 2);
    for (let i = 0; i < secondRoundMatches; i++) {
      matches.push({
        id: matchId,
        round: 2,
        position: i + 1,
        nextMatchId: Math.floor(i / 2) + matchId + secondRoundMatches
      });
      matchId++;
    }

    // Create third round matches
    const thirdRoundMatches = Math.ceil(secondRoundMatches / 2);
    for (let i = 0; i < thirdRoundMatches; i++) {
      matches.push({
        id: matchId,
        round: 3,
        position: i + 1,
        nextMatchId: matchId + thirdRoundMatches
      });
      matchId++;
    }

    // Create remaining rounds until we have a final match
    let currentRoundMatches = thirdRoundMatches;
    let currentRound = 4;
    
    while (currentRoundMatches > 1) {
      const nextRoundMatches = Math.ceil(currentRoundMatches / 2);
      for (let i = 0; i < nextRoundMatches; i++) {
        matches.push({
          id: matchId,
          round: currentRound,
          position: i + 1,
          nextMatchId: nextRoundMatches === 1 ? undefined : matchId + nextRoundMatches
        });
        matchId++;
      }
      currentRoundMatches = nextRoundMatches;
      currentRound++;
    }

    // If we haven't added the final match yet, add it
    if (matches[matches.length - 1].nextMatchId !== undefined) {
      matches.push({
        id: matchId,
        round: currentRound,
        position: 1
      });
    }

    const newTournament = {
      id: 1,
      name: 'Tournament',
      participants,
      matches,
      rounds: currentRound
    };

    this.tournament.next(newTournament);
    return newTournament;
  }

  updateMatch(match: Match): void {
    const currentTournament = this.tournament.getValue();
    if (!currentTournament) return;

    const updatedMatches = [...currentTournament.matches];
    const matchIndex = updatedMatches.findIndex(m => m.id === match.id);
    
    if (matchIndex !== -1) {
      updatedMatches[matchIndex] = { ...match };

      // Update next match if exists
      if (match.nextMatchId && match.winner) {
        const nextMatchIndex = updatedMatches.findIndex(m => m.id === match.nextMatchId);
        if (nextMatchIndex !== -1) {
          const nextMatch = { ...updatedMatches[nextMatchIndex] };
          const isEvenPosition = match.position % 2 === 0;
          
          if (isEvenPosition) {
            nextMatch.participant2 = match.winner;
          } else {
            nextMatch.participant1 = match.winner;
          }
          
          // Reset winner of next match when participants change
          nextMatch.winner = undefined;
          
          updatedMatches[nextMatchIndex] = nextMatch;
        }
      }
    }

    this.tournament.next({
      ...currentTournament,
      matches: updatedMatches
    });
  }
}
