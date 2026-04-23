import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService, Profile } from '../../core/services/profile.service';
import { inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  private profileService = inject(ProfileService);
  
  currentYear = new Date().getFullYear();
  profile: Profile | null = null;

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data;
      }
    });
  }
}
