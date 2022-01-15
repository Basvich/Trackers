import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {map, Observable} from 'rxjs';



interface loginJwt{
  jwt:string
}

@Injectable({
  providedIn: 'root'
})
export class GstRestSrvService {
  public Host:string;
  public Jwt:string;

  constructor(private http: HttpClient) { }

  public IsGood():boolean{
    return true;
  }

  public Login(login:string, pass:string): Observable<string> {
    let path="api/Account/login";
    let url=`${this.Host}/${path}`;
    const dataIn={userName:login, password:pass};

    let resp=this.http.post<loginJwt>(url, dataIn).pipe(map(r=>r.jwt));   
    return resp;
  }
}
