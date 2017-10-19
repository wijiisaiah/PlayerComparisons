import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Temporary Title';
  public proStatsRequestUrl = 'http://api.lolesports.com/api/v2/tournamentPlayerStats' +
    '?groupName=play_in_groups&tournamentId=a246d0f8-2b5c-4431-af4c-b872c8dee023';
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    const httpRequest = this.proStatsRequestUrl;
    this.http.get(httpRequest, ['test']).subscribe(data => {
      console.log(data);
    });
  }
  

}


