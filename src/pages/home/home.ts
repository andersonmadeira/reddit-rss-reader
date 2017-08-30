import { RedditService } from './../../providers/reddit-service';
import { Component } from '@angular/core';
import { NavController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public showSearchBar: boolean = false;
  public searchTerm: string = "";
  public feeds: Array<any>;
  public noFilter: Array<any>;
  public hasFilter: boolean = false;
  private url: string = "https://www.reddit.com/new.json";
  private olderPosts: string = "https://www.reddit.com/new.json?after=";
  private newerPosts: string = "https://www.reddit.com/new.json?before=";

  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController,
    public redditService: RedditService) {
    this.fetchContent();
  }

  private fetchContent(): void {
    let loading = this.loadingCtrl.create({
      content: 'Fetching content...'
    });

    loading.present();

    this.redditService.fetchData(this.url).then(data => {
      this.feeds = data;
      this.noFilter = this.feeds;
      loading.dismiss();
    });

  }

  public doInfinite(infiniteScroll) {
    let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1].data.name : "";

    this.redditService.fetchData(this.olderPosts + paramsUrl).then(data => {
      this.feeds = this.feeds.concat(data);
      this.noFilter = this.feeds;
      this.hasFilter = false;
      infiniteScroll.complete();
    });
  }

  public doRefresh(refresher) {
    let paramsUrl = this.feeds[0].data.nome;

    this.redditService.fetchData(this.newerPosts + paramsUrl).then(data => {
      this.feeds = this.feeds.concat(data);
      this.noFilter = this.feeds;
      this.hasFilter = false;
      refresher.complete();
    });
  }

  public showFilters() :void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Filter options:',
      buttons: [
        {
          text: 'Music',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() == "music");
            this.hasFilter = true;
          }
        },
        {
          text: 'Games',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "gaming");
            this.hasFilter = true;
          }
        },
        {
          text: 'Pictures',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "pics");
            this.hasFilter = true;
          }
        },
        {
          text: 'Ask Reddit',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "askreddit");
            this.hasFilter = true;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.feeds = this.noFilter;
            this.hasFilter = false;
          }
        }
      ]
    });

    actionSheet.present();
  }

  filterItems() {
    this.hasFilter = false;
    this.feeds = this.noFilter.filter((item) => {
      return item.data.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  onCancel() {
    this.showSearchBar = false;
    this.searchTerm = "";
    this.filterItems();
  }

  searchButtonClicked($event) {
    this.showSearchBar = !this.showSearchBar;
    $event.setFocus();
  }

}
