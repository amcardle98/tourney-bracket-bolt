export interface Participant {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  round: number;
  position: number;
  participant1?: Participant;
  participant2?: Participant;
  winner?: Participant;
  nextMatchId?: number;
}

export interface Tournament {
  id: number;
  name: string;
  participants: Participant[];
  matches: Match[];
  rounds: number;
}
