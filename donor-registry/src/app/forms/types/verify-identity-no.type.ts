
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {GeneralService, getDonorServiceHost} from '../../services/general/general.service';
@Component({
  selector: 'verify-identity-code',
  styleUrls: ["../forms.component.scss"],
  template: `
      <div>
        <span class="fw-bold p12">{{ to.label }}*</span> <br>
         <div class="d-flex">
              <input id="{{field.key}}"
              [formControl]="formControl"
              [formlyAttributes]="field" pattern ="[9]{1}[1]{1}[0-9]{12}" [ngClass]="(isIdentityNo) ? 'form-control' : 'form-control is-invalid'" required >
              <span class="text-primary fw-bold p-1 p14 pointer" *ngIf="!isVerify"  (click)="verifyOtp(field.key)" data-toggle="modal" data-target="#verifyOtp">Verify</span>
              <span class="text-success verifyIcon fw-bold p-1" *ngIf="isVerify">
                  <i class="fa fa-check-circle" aria-hidden="true"></i>
              </span>
       </div>
     
            <div *ngIf="isIdentityNo" class="modal fade" id="verifyOtp" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="p-4 modal-content">
                      <div class="modal-body">
                        
                          <h3 class="fw-bold mb-3">Confirm OTP</h3>
                          <p class="p14">Enter the code sent to mobile number associated with your ID </p>
                          <span class="fw-bold p12"> Enter OTP</span> <br>
                          <input type="input" [(ngModel)]="optVal" name="optVal" class="form-control" />
                          <button data-dismiss="modal" class="btn my-3 w-100 fw-bold text-dark p12 btn-bg nav-link-color btn-sec-bg mb-2">Please enter OTP sent to registered number</button> <br>
                          <button id=""  data-toggle="modal" data-dismiss="modal"m type="submit" (click)="submitOtp()" class="btn btn-primary w-100 submit-button mb-2">Verify</button>
                      
                      </div>
                  </div>
                </div>
            </div>
    </div>
    `,
})

export class VerifyIndentityCode extends FieldType {
  data: any;
  res = "Verify";
  isVerify: boolean = false;
  optVal: string;
  number: string;
  isIdentityNo: boolean = true;
  transactionId:string
  model1:any;
  errorMessage:any;
  data1:any;
 // @Output() sendData1 = new EventEmitter<any>();
  model2:any;
  constructor( private http: HttpClient, public generalService: GeneralService) {
    super();
  }
  ngOnInit(): void {
  }


  async verifyOtp(value){

    this.number = (<HTMLInputElement>document.getElementById(value)).value;;
    if (this.number) {
      this.isIdentityNo = true;
     
   
      this.model1 = {
        "healthId": this.number
     
    }
      await  this.http.post<any>(`${getDonorServiceHost()}/auth/sendOTP`, this.model1).subscribe({
        next: data => {
          console.log(data);
            this.transactionId = data.txnId;
        },
        error: error => {
            this.errorMessage = error.message;

            if(localStorage.getItem('formtype') != 'recipient' &&  localStorage.getItem('formtype') != 'livedonor')
            {
              alert(this.errorMessage);
            }
           
            this.isIdentityNo = true;
            console.error('There was an error!', error);
        }
    })

    }else{
      this.isIdentityNo = false;
    }
}

  submitOtp() {
   
    if (this.optVal) {
      
      this.model2={
        "transactionId":this.transactionId,
        "otp":this.optVal
      }

      this.isVerify = true;

      this.http.post<any>(`${getDonorServiceHost()}/auth/verifyOTP`, this.model2).subscribe({
        next: data => {
          console.log(data);
            this.data1 = data;
          //this.sendData1.emit(this.data1);
          const healthIdNumber = this.data1.healthIdNumber.replaceAll('-','');
          // console.log(this.data1.healthIdNumber);
         localStorage.setItem(healthIdNumber, JSON.stringify(this.data1));
         
         localStorage.setItem('isVerified', JSON.stringify(this.isVerify));

        },
        error: error => {
            this.errorMessage = error.message;
              alert(this.errorMessage);
            this.isIdentityNo = true;
            console.error('There was an error!', error);
        }
    })
    
    }
  }

}

