import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ShareServices } from '../../services/share-services';
import { AdminService } from '../../../features/admin/services/admin-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';


interface UserProfile {
  name: string;
  role: 'Employee' | 'Manager' | 'Admin';
  department: string;
}

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  description: string;
}

export interface TodoTask {
  taskId: number;
  title: string;
  description: string;
  assignedToUserId: number;
  assignedByUserId: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
  createdDate: string;
  updatedDate: string | null;
  Assignee: UserSummary;
  Creator: UserSummary;
}
export interface UserSummary {
  userId: number;
  FullName: string;
  email: string;
}



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule,MatTableModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  shareService = inject(ShareServices)
  router = inject(Router)
  adminService = inject(AdminService)
  snakebar = inject(MatSnackBar)

  currentUser: UserProfile = {
    name: 'Alex Mercer',
    role: 'Employee',
    department: 'Engineering'
  };

  logOut() {
    this.shareService.logout(localStorage.getItem("refreshToken")!).subscribe(res => {
      this.snakebar.open(res.message,"Close", {
        duration: 3000
      });
    })
    localStorage.clear()
    this.shareService.userDetails.set(null)
    this.router.navigate(["/auth/login"])
  }
  displayedColumns: string[] = ['Id','name', 'weight'];
  displayedColumns2: string[] = ['date','dayName','Present', 'Absent','OnLeave'];

  currentTimeGreeting: string = 'Good Day';
  stats: StatCard[] = [];

  ngOnInit(): void {
    this.setGreeting();
    this.shareService.fetchTodos();
    console.log(this.shareService.userDetails())
    if(this.shareService.userDetails()?.role==="Admin" || this.shareService.userDetails()?.role==="Manager"){
      this.shareService.getAttendencByStatus()
    }
  }

  private setGreeting(): void {
    const hours = new Date().getHours();
    if (hours < 12) this.currentTimeGreeting = 'Good Morning';
    else if (hours < 18) this.currentTimeGreeting = 'Good Afternoon';
    else this.currentTimeGreeting = 'Good Evening';
  }

  isLoading = signal<boolean>(true);



  markAs(task: TodoTask, status: 'Pending' | 'In Progress' | 'Completed'): void {
    const updatedPayload: TodoTask = {
      ...task,
      status,
      updatedDate: new Date().toISOString()
    };
    this.adminService.updateTask(updatedPayload).subscribe(res => {
      this.shareService.fetchTodos()
    })
  }

}