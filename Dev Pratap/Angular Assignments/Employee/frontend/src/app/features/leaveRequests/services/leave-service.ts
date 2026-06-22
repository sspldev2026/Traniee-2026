import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { env } from "../../../Environment";
import { ICreateLeaveRequest } from "../components/create-leave-Request/create-task";
import { ShareServices } from "../../../shared/services/share-services";
import { computeMsgId } from "@angular/compiler";

export interface ImanagerLeave{
    UserID: number,
    FullName: string,
    Email: string
} 
export interface IManager {
  FullName: string;
  Email: string;
}

export interface ILeaveRequest {
  LeaveRequestsID: number;
  userId: number;
  managerId: number;
  startDate: string;
  endDate: string;
  reason: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
  Manager: IManager;
}


@Injectable({
  providedIn: "root",
})
export class LeaveService {
  http = inject(HttpClient)
  shareService = inject(ShareServices)
  managers = signal<null | ImanagerLeave[] >(null)

  setManger(){
    this.http.get<ImanagerLeave[]>(`${env.URL}leaveRequest/getManager`).subscribe({
      error:(err)=>{
        console.log(err)
      },
      next:(res)=>{
        this.managers.set(res)
      }
    })
  }

  leaveReqCreating(leaveReq:ICreateLeaveRequest){
    this.http.post(`${env.URL}leaveRequest/request`,leaveReq).subscribe({
      error:(err)=>{
        this.shareService.snakeBarFunc("Already reqest pending")
      },
      next:(res)=>{
        this.shareService.snakeBarFunc("Reqest sent Successfully")
        console.log(res)
      }
    })
  }

   myleaveRequests = signal<ILeaveRequest[]>([])

   updateMyLeaveRequestSignal(){
    this.setMyLeaveRequest().subscribe(res=>{
      this.myleaveRequests.set(res.leaveReequests)
      console.log(this.myleaveRequests())
    })
   }

  setMyLeaveRequest(){
    return this.http.post<{leaveReequests:ILeaveRequest[]}>(`${env.URL}leaveRequest/myLeaveRequests`,{userId:this.shareService.userDetails()!.userId})
  }
}

