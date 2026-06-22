import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ShareServices } from '../../../../shared/services/share-services';
import { LeaveService } from '../../services/leave-service';

export interface ICreateLeaveRequest {
  UserId: number;
  Reason: string;
  ManagerId: number;
  StartDate: string;
  EndDate: string;
}

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './create-leave-Request.html',
  styleUrl: './create-leave-Request.css',
})
export class createleaveRequest implements OnInit {
  taskForm!: FormGroup;
  fb = inject(FormBuilder)
  leaveService = inject(LeaveService)
  sharedServie = inject(ShareServices)
  router = inject(Router)

  ngOnInit() {
    this.taskForm = this.fb.group({
      UserId: [this.sharedServie.userDetails()?.userId, [Validators.required]],
      Reason: ['', [Validators.required, Validators.minLength(5)]],
      manager: ['', [Validators.required]],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
    });
    this.leaveService.updateMyLeaveRequestSignal()

    this.leaveService.setManger()

  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  onSubmit() {
    const task: ICreateLeaveRequest = {
      UserId: this.sharedServie.userDetails()!.userId,
      Reason: this.taskForm.value.Reason,
      ManagerId: parseInt(this.taskForm.value.manager),
      StartDate: this.taskForm.value.StartDate,
      EndDate: this.taskForm.value.EndDate,
    };
    this.leaveService.leaveReqCreating(task)
    this.router.navigate(["/dashboard"])
  }
}
