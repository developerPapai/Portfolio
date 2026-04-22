import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project, ProjectsService } from '../../../core/services/projects.service';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-dialog.component.html'
})
export class ProjectDialogComponent implements OnInit {
  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private projectsService = inject(ProjectsService);

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading = false;
  
  projectForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    longDescription: [''],
    techStack: [''], // Will be split by comma
    githubUrl: [''],
    liveUrl: [''],
    imageUrl: [''],
    category: ['fullstack', Validators.required],
    featured: [false],
    visible: [true]
  });

  ngOnInit() {
    if (this.project) {
      this.projectForm.patchValue({
        ...this.project,
        techStack: this.project.techStack ? this.project.techStack.join(', ') : ''
      });
      if (this.project.imageUrl) {
        this.previewUrl = this.project.imageUrl;
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    let imageUrl = this.projectForm.value.imageUrl;

    if (this.selectedFile) {
      this.isUploading = true;
      try {
        const res = await this.projectsService.uploadImage(this.selectedFile).toPromise();
        if (res?.success) {
          imageUrl = res.url;
        }
      } catch (err) {
        console.error('Upload failed:', err);
        // Handle error (e.g., show message)
      } finally {
        this.isUploading = false;
      }
    }

    const formValue = this.projectForm.value;
    const projectData = {
      ...formValue,
      imageUrl,
      techStack: formValue.techStack.split(',').map((t: string) => t.trim()).filter((t: string) => t)
    };

    this.save.emit(projectData);
  }

  onClose() {
    this.close.emit();
  }
}
