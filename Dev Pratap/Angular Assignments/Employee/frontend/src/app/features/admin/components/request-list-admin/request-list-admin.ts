import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "../../services/admin-service";
import { CommonModule } from "@angular/common";
import { ShareServices } from "../../../../shared/services/share-services";

@Component({
  selector: "app-request-list-admin",
  imports: [CommonModule],
  templateUrl: "./request-list-admin.html",
  styleUrl: "./request-list-admin.css",
})
export class RequestListAdmin implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  adminService = inject(AdminService);
  shareService = inject(ShareServices)

  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.adminService.updateReqSignal()
  }

  onUpdate(id:number,status:string){
    this.adminService.updateStatusLeaveReq(id,status)
  }

   navigateToCreate(): void {
    this.router.navigate(['/admin/taskList']);
  }
}
