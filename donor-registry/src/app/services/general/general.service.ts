import { Injectable } from '@angular/core';
import { DataService } from '../data/data-request.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  baseUrl = this.config.getEnv('baseUrl');
  domainName = this.config.getEnv('domainName');
  translatedString: string;
  constructor(public dataService: DataService,
    public keycloak: KeycloakService,
    private http: HttpClient, public config: AppConfig, public translate: TranslateService) {
      localStorage.setItem('domainName', this.domainName);
    }

  postData(apiUrl, data) {
    var url;
    if (apiUrl.indexOf('http') > -1) {
      url = apiUrl
    } else {
      if (apiUrl.charAt(0) == '/') {
        url = `${this.baseUrl}${apiUrl}`
      }
      else {
        url = `${this.baseUrl}/${apiUrl}`;
      }
    }

    const req = {
      url: url,
      data: data
    };

    return this.dataService.post(req);
  }

  getDocument(url: string): Observable<any> {
    return this.dataService.getDocument(url);
  }


  getData(apiUrl, outside: boolean = false) {
    var url;
    if (outside) {
      url = apiUrl;
    }
    else {
      url = `${this.baseUrl}/${apiUrl}`;
    }
    url.replace('//', '/');
    const req = {
      url: url
    };
    return this.dataService.get(req);
  }

  getPrefillData(apiUrl) {
    var url = apiUrl;
    let headers = new HttpHeaders();
    url.replace('//', '/');
    const req = {
      url: url,
      headers: headers
    };

    return this.dataService.get(req);
  }

  postPrefillData(apiUrl, data) {
    apiUrl.replace('//', '/');
    const req = {
      url: apiUrl,
      data: data
    };

    return this.dataService.post(req);
  }

  putData(apiUrl, id, data) {
    var url;
    if (apiUrl.charAt(0) == '/') {
      url = `${this.baseUrl}${apiUrl}/${id}`
    }
    else {
      url = `${this.baseUrl}/${apiUrl}/${id}`;
    }
    const req = {
      url: url,
      data: data
    };
    return this.dataService.put(req);
  }

  // Configurations
  getConfigs() {
    let url = "./assets/config/config.json";
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  updateclaims(apiUrl, data) {
    let url = `${this.baseUrl}${apiUrl}`;
    const req = {
      url: url,
      data: data
    };
    return this.dataService.put(req);
  }

  translateString(constantStr){
    this.translate.get(constantStr).subscribe((val)=>{
       this.translatedString = val;
    });
    return this.translatedString;
  }

  attestationReq(apiUrl, data) {
    let url = `${this.baseUrl}${apiUrl}`;
    const req = {
      url: url,
      data: data
    };
    return this.dataService.put(req);
  }


  openPDF(url){
    url = `${this.baseUrl}` + '/' + `${url}`;

    let requestOptions = { responseType: 'blob' as 'blob' };
    // post or get depending on your requirement
    this.http.get(url, requestOptions).pipe(map((data: any) => {

        let blob = new Blob([data], {
            type: 'application/pdf' // must match the Accept type
            // type: 'application/octet-stream' // for excel
        });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);

        window.open(link.href, '_blank')
       // link.download =  'temp.pdf';
       // link.click();
       // window.URL.revokeObjectURL(link.href);

    })).subscribe((result: any) => {
    });
  }


 async isUserLoggedIn()
  {
   await this.keycloak.isLoggedIn().then((res)=>{
      console.log(res);
      return res;
    })
  }
  
}

export function getDonorServiceHost(): string {
//    return  localStorage.getItem('domainName') + '/donor-service';
  if (window.location.host === 'localhost:4200') {
 return  localStorage.getItem('domainName') + '/donor-service';    
//return 'https://demo-nha-donor-registry.xiv.in/donor-service';
  } else {
    return '/donor-service';
  }
}
