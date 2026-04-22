import { Component, OnInit, inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import gsap from 'gsap';

import { ProjectsService, Project } from '../../core/services/projects.service';
import { ProjectCardComponent } from '../../shared/project-card/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectCardComponent],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  private projectsService = inject(ProjectsService);
  private platformId = inject(PLATFORM_ID);
  private meta = inject(Meta);
  private title = inject(Title);

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  loading = true;
  activeCategory = 'all';

  categories = [
    { label: 'All', value: 'all' },
    { label: 'Full Stack', value: 'fullstack' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
    { label: 'Other', value: 'other' }
  ];

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.title.setTitle('Project Archive | Papai');
    this.meta.updateTag({ name: 'description', content: 'A complete collection of my software development projects.' });

    this.projectsService.getProjects().subscribe({
      next: (res) => {
        this.projects = res.data;
        this.filteredProjects = this.projects;
        this.loading = false;

        if (this.isBrowser) {
          setTimeout(() => this.animateCards(), 50);
        }
      },
      error: () => this.loading = false
    });
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
  }

  setCategory(category: string) {
    this.activeCategory = category;
    if (category === 'all') {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter(p => p.category === category);
    }

    if (this.isBrowser) {
      setTimeout(() => this.animateCards(), 50);
    }
  }

  private animateCards() {
    gsap.fromTo('.gsap-project-item',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }
}
