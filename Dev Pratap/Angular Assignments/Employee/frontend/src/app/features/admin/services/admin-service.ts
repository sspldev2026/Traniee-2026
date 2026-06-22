import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '../../../Environment';
import { Employee2 } from '../components/employee-list/employee-list';
import { toSignal } from '@angular/core/rxjs-interop';
import { CreateTask, CreateTaskRequest } from '../components/create-task/create-task';
import { TaskDetails } from '../components/task-list-admin/task-list-admin';
import { ShareServices } from '../../../shared/services/share-services';


export interface Role {
  roleName: string;
}
export interface Employee {
  userId: number;
  FullName: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
  Roles: Role[];
}

export interface UserInfo {
  userId: number;
  FullName: string;
  email: string;
}

export interface Task {
  taskId: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  createdDate: string;
  updatedDate: string | null;
  Assignee: UserInfo;
  Creator: UserInfo;
}

export interface GetTaskResponse {
  success: boolean;
  data: Task;
}

export interface LeaveRequest {
  LeaveRequestsID: number;
  userId: number;
  managerId: number;
  startDate: string;
  endDate: string;
  reason: string;
  Status: 'Pending' | 'Approved' | 'Rejected';
  CreatedAt: string;
  UpdatedAt: string;
  Employee: {
    FullName: string;
    Email: string;
  };
  Manager: {
    FullName: string;
  }
  ;
}



@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private shareService = inject(ShareServices)
  http = inject(HttpClient)
  Employees = signal<Employee[]>([])
  task = signal<TaskDetails[]>([])
  leaveRequests = signal<LeaveRequest[]>([])

  updateTaskSingnal() {
    this.getAllTask().subscribe(res => this.task.set(res.data))
  }

  updateEmpSingnal() {
    this.getAllUser().subscribe(res => this.Employees.set(res))
  }

  updateReqSignal() {
    if (this.shareService.userDetails()?.role === 'Admin') {
      this.getAllLeaveReq().subscribe(res => this.leaveRequests.set(res))
    }
    if (this.shareService.userDetails()?.role === 'Manager') {
      this.getAllLeaveReqByManger(this.shareService.userDetails()!.userId).subscribe(res => this.leaveRequests.set(res))
    }

  }

  // employee here
  deleteEmployee(userId: number) {
    return this.http.delete<{ message: string }>(`${env.URL}admin/api/${userId}`)
  }

  getAllUser() {
    return this.http.get<Employee[]>(`${env.URL}admin/api`)
  }

  updateUser(data: Employee2) {
    return this.http.patch(`${env.URL}admin/api/${data.userId}`, data)
  }

  // task here

  getAllTask() {
    return this.http.get<{ success: boolean, count: number, data: TaskDetails[] }>(`${env.URL}task`)
  }

  createTask(data: CreateTaskRequest) {
    return this.http.post<{ success: boolean, message: string }>(`${env.URL}task`, data)
  }

  deleteTask(id: number) {
    return this.http.delete(`${env.URL}task/${id}`)
  }

  getTaskById(id: number) {
    return this.http.get<GetTaskResponse>(`${env.URL}task/${id}`)
  }

  updateTask(data: Task) {
    return this.http.patch<GetTaskResponse>(`${env.URL}task/${data.taskId}`, data)
  }

  // all the leave request here
  getAllLeaveReq() {
    return this.http.get<LeaveRequest[]>(`${env.URL}admin/api/requests/leave`)
  }

  getAllLeaveReqByManger(managerId: number) {
    return this.http.post<LeaveRequest[]>(`${env.URL}admin/api/Manger-requests/leave`, { managerId })
  }

  updateStatusLeaveReq(LeaveRequestsID: number, Status: string) {

    const previousRequests = this.leaveRequests();


    this.leaveRequests.update(requests =>
      requests.map(req =>
        req.LeaveRequestsID === LeaveRequestsID
          ? { ...req, Status: Status as 'Pending' | 'Approved' | 'Rejected' }
          : req
      )
    );


    this.http.patch(`${env.URL}leaveRequest/${LeaveRequestsID}`, { Status }).subscribe({
      next: (res) => {
        this.shareService.snakeBarFunc("Updated");
      },
      error: (err) => {
        console.error(err);
        this.shareService.snakeBarFunc("Something went wrong. Rolling back...");

        this.leaveRequests.set(previousRequests);
      }
    });
    
  }

  deleteLeaveReq(LeaveRequestsID: number) {

    const previousRequests = this.leaveRequests();


    this.leaveRequests.update(requests =>
      requests.filter(req =>
        req.LeaveRequestsID != LeaveRequestsID
      )
    );


    // this.http.patch(`${env.URL}leaveRequest/${LeaveRequestsID}`, { Status }).subscribe({
    //   next: (res) => {
    //     this.shareService.snakeBarFunc("Updated");
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.shareService.snakeBarFunc("Something went wrong. Rolling back...");

    //     this.leaveRequests.set(previousRequests);
    //   }
    // });

    this.http.delete(`${env.URL}leaveRequest/${LeaveRequestsID}`).subscribe({
      next: (res) => {
        this.shareService.snakeBarFunc("deleted");
      },
      error: (err) => {
        console.error(err);
        this.shareService.snakeBarFunc("Something went wrong. Rolling back...");
        this.leaveRequests.set(previousRequests);
      }
    });
    
  }



}
