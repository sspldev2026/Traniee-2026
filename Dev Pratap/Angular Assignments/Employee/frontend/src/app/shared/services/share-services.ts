import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, single, tap } from 'rxjs';
import { IAssignUser } from '../shareModule';
import { HttpClient } from '@angular/common/http';
import { env } from '../../Environment';
import { TodoTask } from '../components/home/home';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ImanagerLeave } from '../../features/leaveRequests/services/leave-service';
import { servicesVersion } from 'typescript';

export interface UserInfo {
  userId: number;
  FullName: string;
  email: string;
}

export interface Task {
  taskId: number;
  title: string;
  description: string;
  assignedToUserId: number;
  assignedByUserId: number;
  status: string;
  dueDate: string;
  createdDate: string;
  updatedDate: string;
  Assignee: UserInfo;
  Creator: UserInfo;
}

export interface GetTasksResponse {
  success: boolean;
  filterUsed: string;
  count: number;
  data: TodoTask[];
}

export interface attendencEmp {
  AttendanceID: number;
  Status: string;
  date: string;
  userId: number;
  Employee:UserInfo
}

export interface WeekRange {
  start: string;
  end: string;
}

export interface AttendanceSummary {
  date: string;
  dayName: string;
  Present: number;
  Absent: number;
  OnLeave: number;
}

export interface WeeklyAttendanceResponse {
  weekRange: WeekRange;
  summary: AttendanceSummary[];
}



@Injectable({
  providedIn: 'root',
})



export class ShareServices {
  userDetails = signal<IAssignUser | null>(null)
  http = inject(HttpClient)
  todos = signal<TodoTask[]>([]);
  snackBar = inject(MatSnackBar)
  router = inject(Router)
  attendenc = signal<string>("Absent")

  fetchTodos(): void {
    if (this.userDetails()) {
      this.getMyTask().subscribe({
        next: (res) => {
          this.todos.set(res.data);
        }
      });
    }
  }




  assignUser(token: string | null): void {
    if (!token) {
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          localStorage.clear();
          return;
        }

        this.getNewAccessToken(refreshToken).subscribe({
          next: (res) => {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);

            const newPayload = JSON.parse(
              atob(res.accessToken.split('.')[1])
            );

            this.userDetails.set(newPayload);
            this.fetchTodos()
          },
          error: (err) => {
            console.error('Refresh token failed', err);
            localStorage.clear()
          }
        });

        return;
      }

      this.userDetails.set(payload);

    } catch (error) {
      console.error('Invalid token', error);
      localStorage.clear()
    }
  }

  getNewAccessToken(refreshToken: string) {
    return this.http.post<{ accessToken: string, refreshToken: string }>(`${env.URL}auth/refresh`, { refreshToken })
  }

  getMyTask() {
    return this.http.get<GetTasksResponse>(`${env.URL}task/user/${this.userDetails()!.userId}`)
  }

  logout(refreshToken: string): Observable<any> {
    return this.http.post<{ message: string, success: boolean }>(
      `${env.URL}auth/logout`,
      { refreshToken }
    ).pipe(
      tap(() => {
        localStorage.clear()
        this.attendenc.set("no")
      }),
      catchError((error) => {
        console.error('Backend logout failed, clearing local session anyway', error);
        localStorage.clear()
        return of(null);
      })
    );
  }


  snakeBarFunc(message: string) {
    return this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000
      }
    );
  }

  // --------- attendance 

  updateAttendence() {
    this.http.patch(`${env.URL}attendence/${this.userDetails()?.userId}`, { status: "Present" }).subscribe({
      next: () => {
        this.snakeBarFunc("Marked you Present")
        this.updateAttSignal()
        if(this.userDetails()?.role === "Admin"||this.userDetails()?.role === "Manager"){
          this.getAttendencByStatus()
        }
      },
      error: () => this.snakeBarFunc("Some Think went Wrong")
    })
  }

  updateAttSignal() {
    this.http.get<{ AttendanceID: string, Status: string, userId: number, date: string }>(`${env.URL}attendence/${this.userDetails()?.userId}`).subscribe(res => this.attendenc.set(res.Status))
  }


  // attendenc count

  AbsentEmp = signal<attendencEmp[]>([])
  PresentEmp = signal<attendencEmp[]>([])
  OnleaveEmp = signal<attendencEmp[]>([])
  AllEmpStatus = signal<attendencEmp[]>([])
  weekStatus = signal<AttendanceSummary[] >([])

  getAttendencByStatus() {
    this.http.get<attendencEmp[]>(`${env.URL}attendence/Atendace/Absent`).subscribe(res => this.AbsentEmp.set(res))
    this.http.get<attendencEmp[]>(`${env.URL}attendence/Atendace/Present`).subscribe(res => this.PresentEmp.set(res))
    this.http.get<attendencEmp[]>(`${env.URL}attendence/Atendace/OnLeave`).subscribe(res => this.OnleaveEmp.set(res))
    this.http.get<attendencEmp[]>(`${env.URL}attendence/Atendace/All`).subscribe(res => this.AllEmpStatus.set(res))
     this.http.get<WeeklyAttendanceResponse>(`${env.URL}attendence/Details/week`).subscribe(res => this.weekStatus.set(res.summary))
  }

  testing(){
   
  }
}
