import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Summoner Comparisons';
  public kda = '';
  public accountId = 0;
  public proStatsRequestUrl = 'http://api.lolesports.com/api/v2/tournamentPlayerStats' +
    '?groupName=play_in_groups&tournamentId=a246d0f8-2b5c-4431-af4c-b872c8dee023';
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.http.get('riotApi/proStats', ['test']).subscribe(data => {
      console.log(data);
    });
  }
  
  getKDA(summonerName: string) {
    this.http.get('riotApi/recentMatchIds/' + summonerName).subscribe(data => {
      console.log(data);
      let matches = data['matches'];
      this.accountId = data['accountId'];
      let gameIds = [];
      for (let match of matches) {
        gameIds.push(match['gameId']);
      }
      console.log(gameIds);
      this.calculateKDA(gameIds);
    });
  }
  
  private calculateKDA(gameIds: number[]) {
    this.http.get('riotApi/recentMatches/' + gameIds).subscribe(data => {
      console.log(data);
      for (let i = 0; i < Object.keys(data).length; i++) {
        let match = data[i];
        let participantIdentities = match['participantIdentities'];
        let playerId;
        for (let index in participantIdentities) {
          let participant = participantIdentities[index];
          if (participant.player.accountId === this.accountId) {
            playerId = participant.participantId;
            break;
          }
        }
        
        let playerStats = match.participants[playerId + 1].stats;
        console.log(playerStats);
        console.log('gameIndex: ' + i + ' playerId: ' + playerId);
      }
    });
  }
  
}


