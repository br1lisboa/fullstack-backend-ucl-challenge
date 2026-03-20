import { Team } from "../team";
import { Match } from "../match";
import { logger } from "../../../../shared/infrastructure/logger.js";

const MAX_MATCHES = 8;
const MAX_HOME = 4;
const MAX_AWAY = 4;
const MATCH_DAYS = 8;
const MAX_COUNTRY_OPPONENTS = 2;
const MAX_RETRY_ATTEMPTS = 50;
const MAX_BACKTRACKS_PER_DAY = 200;

type TeamState = {
  opponents: Set<number>;
  matches: number;
  home: number;
  away: number;
  matchDays: Set<number>;
  opponentCountries: Map<number, number>;
};

type PairingSnapshot = {
  teamAId: number;
  teamBId: number;
  isHome: boolean;
};

export class DrawService {
  static generateMatches(
    teams: Team[],
    potAssignments: Map<number, number>,
    drawId: number
  ): Match[] {

    for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
      const result = this.tryGenerateMatches(teams, potAssignments, drawId);

      const allTeamsComplete = teams.every(team => {
        const teamMatches = result.filter(m =>
          m.homeTeamId === team.id || m.awayTeamId === team.id
        );
        return teamMatches.length === MAX_MATCHES;
      });

      if (result.length === 144 && allTeamsComplete) {
        return result;
      }

      logger.warn({ attempt: attempt + 1, matchesGenerated: result.length }, "Draw generation attempt failed, retrying");
    }

    throw new Error(`Could not generate a valid draw after ${MAX_RETRY_ATTEMPTS} attempts`);
  }

  /**
   * Counts valid opponents for a team given the current state.
   * Used as the MRV (Minimum Remaining Values) heuristic to prioritize
   * the most constrained teams first during pairing.
   */
  private static countValidOpponents(
    team: Team,
    availableTeams: Team[],
    currentPaired: Set<number>,
    excludedPairs: Set<string>,
    states: Map<number, TeamState>
  ): number {
    return this.getValidCandidates(team, availableTeams, currentPaired, excludedPairs, states).length;
  }

  /**
   * Returns all valid opponent candidates for a team, filtering by:
   * - Not already paired this day
   * - Not an excluded pair (from backtracking)
   * - Not same country
   * - Max 2 opponents from same country (both directions)
   * - Home/away slot availability
   */
  private static getValidCandidates(
    teamA: Team,
    availableTeams: Team[],
    currentPaired: Set<number>,
    excludedPairs: Set<string>,
    states: Map<number, TeamState>
  ): Team[] {
    const stateA = states.get(teamA.id)!;

    return availableTeams.filter(teamB => {
      if (teamB.id === teamA.id) return false;
      if (currentPaired.has(teamB.id)) return false;
      if (excludedPairs.has(this.pairKey(teamA.id, teamB.id))) return false;

      const stateB = states.get(teamB.id)!;
      if (stateB.matches >= MAX_MATCHES) return false;
      if (stateA.opponents.has(teamB.id)) return false;
      if (teamA.country.id === teamB.country.id) return false;

      const aCountFromB = stateA.opponentCountries.get(teamB.country.id) || 0;
      const bCountFromA = stateB.opponentCountries.get(teamA.country.id) || 0;
      if (aCountFromB >= MAX_COUNTRY_OPPONENTS || bCountFromA >= MAX_COUNTRY_OPPONENTS) {
        return false;
      }

      const canHome = stateA.home < MAX_HOME && stateB.away < MAX_AWAY;
      const canAway = stateA.away < MAX_AWAY && stateB.home < MAX_HOME;
      return canHome || canAway;
    });
  }

  /** Creates a normalized key for a pair of teams (order-independent). */
  private static pairKey(idA: number, idB: number): string {
    return idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`;
  }

  /** Applies a pairing: updates both team states and marks them as paired for the day. */
  private static applyPairing(
    teamAId: number,
    teamBId: number,
    isHome: boolean,
    matchDay: number,
    paired: Set<number>,
    states: Map<number, TeamState>,
    teams: Team[]
  ): void {
    const stateA = states.get(teamAId)!;
    const stateB = states.get(teamBId)!;
    const teamA = teams.find(t => t.id === teamAId)!;
    const teamB = teams.find(t => t.id === teamBId)!;

    stateA.opponents.add(teamBId);
    stateB.opponents.add(teamAId);
    stateA.matchDays.add(matchDay);
    stateB.matchDays.add(matchDay);
    stateA.matches++;
    stateB.matches++;

    if (isHome) {
      stateA.home++;
      stateB.away++;
    } else {
      stateA.away++;
      stateB.home++;
    }

    const aCountB = stateA.opponentCountries.get(teamB.country.id) || 0;
    stateA.opponentCountries.set(teamB.country.id, aCountB + 1);
    const bCountA = stateB.opponentCountries.get(teamA.country.id) || 0;
    stateB.opponentCountries.set(teamA.country.id, bCountA + 1);

    paired.add(teamAId);
    paired.add(teamBId);
  }

  /** Reverts a pairing: restores both team states and removes them from paired set. */
  private static revertPairing(
    teamAId: number,
    teamBId: number,
    isHome: boolean,
    matchDay: number,
    paired: Set<number>,
    states: Map<number, TeamState>,
    teams: Team[]
  ): void {
    const stateA = states.get(teamAId)!;
    const stateB = states.get(teamBId)!;
    const teamA = teams.find(t => t.id === teamAId)!;
    const teamB = teams.find(t => t.id === teamBId)!;

    stateA.opponents.delete(teamBId);
    stateB.opponents.delete(teamAId);
    stateA.matchDays.delete(matchDay);
    stateB.matchDays.delete(matchDay);
    stateA.matches--;
    stateB.matches--;

    if (isHome) {
      stateA.home--;
      stateB.away--;
    } else {
      stateA.away--;
      stateB.home--;
    }

    const aCountB = stateA.opponentCountries.get(teamB.country.id) || 0;
    stateA.opponentCountries.set(teamB.country.id, aCountB - 1);
    const bCountA = stateB.opponentCountries.get(teamA.country.id) || 0;
    stateB.opponentCountries.set(teamA.country.id, bCountA - 1);

    paired.delete(teamAId);
    paired.delete(teamBId);
  }

  private static tryGenerateMatches(
    teams: Team[],
    potAssignments: Map<number, number>,
    drawId: number
  ): Match[] {
    const states = new Map<number, TeamState>();
    const matches: Match[] = [];

    for (const team of teams) {
      states.set(team.id, {
        opponents: new Set(),
        matches: 0,
        home: 0,
        away: 0,
        matchDays: new Set(),
        opponentCountries: new Map(),
      });
    }

    for (let matchDay = 1; matchDay <= MATCH_DAYS; matchDay++) {
      const availableTeams = teams.filter(team => !states.get(team.id)!.matchDays.has(matchDay));
      const paired = new Set<number>();
      const pairingStack: PairingSnapshot[] = [];
      const excludedPairs = new Set<string>();
      let backtracks = 0;

      while (paired.size < availableTeams.length) {
        const unpaired = availableTeams.filter(t => {
          const state = states.get(t.id)!;
          return !paired.has(t.id) && state.matches < MAX_MATCHES;
        });

        if (unpaired.length === 0) break;

        // MRV heuristic: pick the most constrained team first
        const sorted = unpaired.sort((a, b) => {
          return this.countValidOpponents(a, availableTeams, paired, excludedPairs, states)
            - this.countValidOpponents(b, availableTeams, paired, excludedPairs, states);
        });

        const minCount = this.countValidOpponents(sorted[0], availableTeams, paired, excludedPairs, states);
        const mostConstrained = sorted.filter(
          t => this.countValidOpponents(t, availableTeams, paired, excludedPairs, states) === minCount
        );
        const teamA = mostConstrained[Math.floor(Math.random() * mostConstrained.length)];

        // Get valid candidates excluding backtracked pairs
        const candidates = this.getValidCandidates(teamA, availableTeams, paired, excludedPairs, states);

        if (candidates.length === 0) {
          // BACKTRACK: undo last pairing and exclude it
          if (pairingStack.length === 0 || backtracks >= MAX_BACKTRACKS_PER_DAY) break;

          const lastPairing = pairingStack.pop()!;
          matches.pop();
          this.revertPairing(
            lastPairing.teamAId, lastPairing.teamBId, lastPairing.isHome,
            matchDay, paired, states, teams
          );
          excludedPairs.add(this.pairKey(lastPairing.teamAId, lastPairing.teamBId));
          backtracks++;
          continue;
        }

        // Pick most constrained opponent (MRV on candidates)
        const sortedCandidates = candidates.sort((a, b) => {
          return this.countValidOpponents(a, availableTeams, paired, excludedPairs, states)
            - this.countValidOpponents(b, availableTeams, paired, excludedPairs, states);
        });

        const minOpponentCount = this.countValidOpponents(sortedCandidates[0], availableTeams, paired, excludedPairs, states);
        const mostConstrainedOpponents = sortedCandidates.filter(
          t => this.countValidOpponents(t, availableTeams, paired, excludedPairs, states) === minOpponentCount
        );
        const teamB = mostConstrainedOpponents[Math.floor(Math.random() * mostConstrainedOpponents.length)];

        const stateA = states.get(teamA.id)!;
        const stateB = states.get(teamB.id)!;

        // Determine home/away based on need
        const canHome = stateA.home < MAX_HOME && stateB.away < MAX_AWAY;
        const canAway = stateA.away < MAX_AWAY && stateB.home < MAX_HOME;

        let isHome: boolean;
        if (canHome && canAway) {
          const aHomeNeed = MAX_HOME - stateA.home;
          const aAwayNeed = MAX_AWAY - stateA.away;
          isHome = aHomeNeed > aAwayNeed;
        } else {
          isHome = canHome;
        }

        // Apply pairing and record match
        this.applyPairing(teamA.id, teamB.id, isHome, matchDay, paired, states, teams);

        matches.push(
          Match.create(
            0, // Placeholder — IDs assigned sequentially after generation
            drawId,
            isHome ? teamA.id : teamB.id,
            isHome ? teamB.id : teamA.id,
            matchDay
          )
        );

        pairingStack.push({ teamAId: teamA.id, teamBId: teamB.id, isHome });
      }
    }

    // Assign sequential match IDs (1..N) after generation is complete
    return matches.map((match, index) =>
      Match.create(index + 1, match.drawId, match.homeTeamId, match.awayTeamId, match.matchDay)
    );
  }
}
