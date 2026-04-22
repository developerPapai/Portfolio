import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService, Profile } from '../../core/services/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);

  profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    title: ['', Validators.required],
    bio: ['', Validators.required],
    heroTagline: ['', Validators.required],
    heroTaglines: [''], // Will handle as newline-separated string in UI
    location: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    github: [''],
    linkedin: [''],
    twitter: [''],
    yearsOfExperience: [0, Validators.min(0)],
    availableForWork: [false]
  });

  isLoading = true;
  isSaving = false;
  profileImageUrl: string | undefined;
  resumeUrl: string | undefined;

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (res) => {
        if (res.data) {
          const data: any = { ...res.data };
          if (data.heroTaglines) {
            data.heroTaglines = data.heroTaglines.join('\n');
          }
          this.profileForm.patchValue(data);
          this.profileImageUrl = res.data.profileImageUrl;
          this.resumeUrl = res.data.resumeUrl;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load profile', 'error');
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const profileData: any = { ...this.profileForm.value };
    // Convert newline-separated string back to array
    if (typeof profileData.heroTaglines === 'string') {
      profileData.heroTaglines = profileData.heroTaglines
        .split('\n')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    }

    this.isSaving = true;
    this.profileService.updateProfile(profileData).subscribe({
      next: () => {
        this.isSaving = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Profile updated successfully',
          showConfirmButton: false,
          timer: 3000
        });
      },
      error: () => {
        this.isSaving = false;
        Swal.fire('Error', 'Failed to update profile', 'error');
      }
    });
  }
}
