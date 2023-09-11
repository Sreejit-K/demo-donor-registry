import { AfterContentChecked, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppConfig } from '../app.config';
import { SchemaService } from '../services/data/schema.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from "../../app/services/theme/theme.service";
import { LayoutsComponent } from '../layouts/layouts.component';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, AfterContentChecked{
  @Input() headerFor: string = 'default';
  @Input() tab: string;
  logo;
  languages: any;
  headerSchema;
  langCode: string;
  lang;
  indexPre;
  ELOCKER_THEME: string;
  loggedInUser: string;
  loggedInUserName: string;
  tcUserName: string;
  plegelogin: boolean=false;
  tclogin: boolean=false;
  temp:boolean = true;
  entity: string;
  profile: boolean = true;
  homeMenu: boolean;
  
 
  constructor(
    public router: Router, private config: AppConfig, public schemaService: SchemaService,
    public translate: TranslateService, private themeService: ThemeService
  ) { 
    
  }
  ngAfterContentChecked(): void {
    this.loggedInUserName  = localStorage.getItem('loggedInUserName'); 
    if(this.loggedInUserName){
      this.plegelogin = true;
    }
   
    this.entity  = localStorage.getItem('entity');

    this.tcUserName  = localStorage.getItem('tcUserName');
        if(this.tcUserName){
      this.tclogin = true;
    } 
  }
  
  
  async ngOnInit() {
   if(this.router.url == "/form/signup"){
    this.temp = false;
    this.homeMenu = true;
   }

   if(this.router.url == "/profile/Pledge"){
    this.profile = false;
   }
   
    this.languages = JSON.parse(localStorage.getItem('languages'));
    this.langCode = localStorage.getItem('setLanguage');
    
    this.ELOCKER_THEME = localStorage.getItem('ELOCKER_THEME');

    if (!this.ELOCKER_THEME) {
      localStorage.setItem('ELOCKER_THEME', "default");
    }

    this.logo = this.config.getEnv(localStorage.getItem('ELOCKER_THEME') + '_theme').logoPath;
    this.schemaService.getHeaderJSON().subscribe(async (HeaderSchemas) => {
      var filtered = HeaderSchemas.headers.filter(obj => {
        return Object.keys(obj)[0] === this.headerFor;
      });
      this.headerSchema = filtered[0][this.headerFor];

      if(this.headerSchema.hasOwnProperty('left') && this.headerSchema['left'].length){
        this.headerSchema['left'][0]["activeTab"] = (this.headerSchema['left'].length == 1 || (localStorage.getItem('activeTab') == null)) ? 'active' : '';
      }

      if(this.headerSchema.hasOwnProperty('right') && this.headerSchema['left'].length){
      this.headerSchema['right'][0]["activeTab"] = (this.headerSchema['right'].length == 1 || (localStorage.getItem('activeTab') == null)) ? 'active' : '';
      }

      if (localStorage.getItem('activeTab')) {
        let activeT = JSON.parse(localStorage.getItem('activeTab'));
        this.headerSchema[activeT.pos][activeT.i]["activeTab"] = 'active';

        console.log(this.headerSchema);

      }

    }, (error) => {
      console.error('headers.json not found in src/assets/config/ - You can refer to examples folder to create the file')
    });
  }

  languageChange(lang) {
    if (this.langCode != lang.target.value) {
      lang = lang.target.value;
      localStorage.setItem('setLanguage', lang);
      window.location.reload();
    }
  }

  changeTheme() {
    if (this.ELOCKER_THEME == 'default') {
      this.ELOCKER_THEME = "dark";
    } else {
      this.ELOCKER_THEME = "default";
    }
    this.themeService.setTheme(this.ELOCKER_THEME);
    localStorage.setItem('ELOCKER_THEME', this.ELOCKER_THEME);
  }

  onTabChange(index, pos) {

    localStorage.setItem('activeTab', JSON.stringify({ 'pos': pos, 'i': index }))

    // console.log(this.headerSchema);


    // this.preTitle = activeTabIs.title;

  }

}