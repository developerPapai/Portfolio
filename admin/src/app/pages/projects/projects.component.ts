import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService, Project } from '../../core/services/projects.service';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectDialogComponent],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  projects: Project[] = [];
  isLoading = true;

  showDialog = false;
  selectedProject: Project | null = null;

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading = true;
    this.projectsService.getProjects().subscribe({
      next: (res) => {
        this.projects = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  openAddDialog() {
    this.selectedProject = null;
    this.showDialog = true;
  }

  openEditDialog(project: Project) {
    this.selectedProject = project;
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.selectedProject = null;
  }

  saveProject(projectData: any) {
    if (this.selectedProject && this.selectedProject._id) {
      this.projectsService.updateProject(this.selectedProject._id, projectData).subscribe({
        next: () => {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Project updated', showConfirmButton: false, timer: 3000 });
          this.closeDialog();
          this.loadProjects();
        },
        error: (err) => Swal.fire('Error', err.error?.message || 'Failed to update project', 'error')
      });
    } else {
      this.projectsService.createProject(projectData).subscribe({
        next: () => {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Project created', showConfirmButton: false, timer: 3000 });
          this.closeDialog();
          this.loadProjects();
        },
        error: (err) => Swal.fire('Error', err.error?.message || 'Failed to create project', 'error')
      });
    }
  }

  deleteProject(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectsService.deleteProject(id).subscribe({
          next: () => {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Project deleted', showConfirmButton: false, timer: 3000 });
            this.loadProjects();
          },
          error: (err) => Swal.fire('Error', err.error?.message || 'Failed to delete project', 'error')
        });
      }
    });
  }
}
