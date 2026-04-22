import { Component, OnInit, inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ProfileService, Profile } from '../../core/services/profile.service';
import { ProjectsService, Project } from '../../core/services/projects.service';
import { SkillsService, Skill } from '../../core/services/skills.service';
import { MessagesService } from '../../core/services/messages.service';
import { ProjectCardComponent } from '../../shared/project-card/project-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ProjectCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
  private profileService = inject(ProfileService);
  private projectsService = inject(ProjectsService);
  private skillsService = inject(SkillsService);
  private messagesService = inject(MessagesService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  private meta = inject(Meta);
  private title = inject(Title);

  profile: Profile | null = null;
  featuredProjects: Project[] = [];
  skills: Skill[] = [];
  skillCategories: string[] = [];

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', Validators.required]
  });

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  isLoadingProjects = true;

  heroTaglines: string[] = [];

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.title.setTitle('Papai | Full Stack Developer');

    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data;
        if (this.profile?.heroTaglines && this.profile.heroTaglines.length > 0) {
          this.heroTaglines = [...this.profile.heroTaglines];
        } else if (this.profile?.heroTagline) {
          this.heroTaglines = [this.profile.heroTagline];
        } else {
          // Absolute fallback
          this.heroTaglines = ['Building things that live on the internet.'];
        }
        this.updateMetaTags(this.profile);
      }
    });

    this.projectsService.getProjects(true).subscribe({
      next: (res) => {
        this.featuredProjects = res.data.slice(0, 3);
        this.isLoadingProjects = false;
      },
      error: () => this.isLoadingProjects = false
    });

    this.skillsService.getSkills().subscribe({
      next: (res) => {
        this.skills = res.data;
        this.skillCategories = [...new Set(this.skills.map(s => s.category))];
      }
    });
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    gsap.registerPlugin(ScrollTrigger);

    setTimeout(() => {
      this.initAnimations();
      this.initTypewriter();
      this.initHeroTypewriter();
    }, 100);
  }

  initHeroTypewriter() {
    if (!this.isBrowser) return;

    const container = document.querySelector('.js-hero-typewriter');
    if (!container) return;

    let taglineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const type = () => {
      const currentTagline = this.heroTaglines[taglineIndex];
      
      if (isDeleting) {
        container.textContent = currentTagline.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        container.textContent = currentTagline.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentTagline.length) {
        isDeleting = true;
        typeSpeed = 2000; // Wait before starting to delete
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        taglineIndex = (taglineIndex + 1) % this.heroTaglines.length;
        typeSpeed = 500; // Wait before starting to type next
      }

      setTimeout(type, typeSpeed);
    };

    // Start after the hero elements have faded in
    setTimeout(type, 1500);
  }

  initTypewriter() {
    if (!this.isBrowser) return;

    const snippets = [
      `<span class="hl-tag">@Component</span>({
  <span class="hl-attr">selector</span>: <span class="hl-string">'app-root'</span>,
  <span class="hl-attr">standalone</span>: <span class="hl-keyword">true</span>,
  <span class="hl-attr">imports</span>: [CommonModule],
  <span class="hl-attr">template</span>: <span class="hl-string">\`&lt;h1&gt;Hello World&lt;/h1&gt;\`</span>
})
<span class="hl-keyword">export class</span> <span class="hl-func">AppComponent</span> {
  count = <span class="hl-func">signal</span>(<span class="hl-attr">0</span>);
  
  <span class="hl-func">increment</span>() {
    <span class="hl-keyword">this</span>.count.<span class="hl-func">update</span>(c => c + <span class="hl-attr">1</span>);
  }
}`,
      `<span class="hl-keyword">export const</span> <span class="hl-func">appConfig</span>: ApplicationConfig = {
  <span class="hl-attr">providers</span>: [
    <span class="hl-func">provideRouter</span>(routes),
    <span class="hl-func">provideAnimations</span>(),
    <span class="hl-func">provideHttpClient</span>()
  ]
};`,
      `<span class="hl-keyword">interface</span> <span class="hl-func">Developer</span> {
  <span class="hl-attr">name</span>: <span class="hl-string">string</span>;
  <span class="hl-attr">skills</span>: <span class="hl-string">string[]</span>;
  <span class="hl-attr">passionate</span>: <span class="hl-keyword">boolean</span>;
}

<span class="hl-keyword">const</span> <span class="hl-attr">me</span>: Developer = {
  <span class="hl-attr">name</span>: <span class="hl-string">'Papai'</span>,
  <span class="hl-attr">skills</span>: [<span class="hl-string">'Angular'</span>, <span class="hl-string">'Node.js'</span>, <span class="hl-string">'GSAP'</span>],
  <span class="hl-attr">passionate</span>: <span class="hl-keyword">true</span>
};`
    ];

    const container = document.querySelector('.js-typewriter');
    if (!container) return;

    let snippetIndex = 0;

    const typeSnippet = () => {
      const currentSnippet = snippets[snippetIndex];
      let i = 0;
      let isTag = false;
      let currentHTML = '';

      const type = () => {
        if (!this.isBrowser) return;
        
        if (i < currentSnippet.length) {
          const char = currentSnippet[i];
          
          if (char === '<') isTag = true;
          currentHTML += char;
          if (char === '>') isTag = false;

          if (isTag) {
            i++;
            type(); 
            return;
          }

          container.innerHTML = currentHTML.replace(/\n/g, '<br>');
          i++;
          // Faster typing for smoother feel
          setTimeout(type, Math.random() * 15 + 5); 
        } else {
          // Wait after finishing a snippet before starting the next
          setTimeout(() => {
            snippetIndex = (snippetIndex + 1) % snippets.length;
            typeSnippet();
          }, 4000);
        }
      };

      type();
    };

    setTimeout(typeSnippet, 1500);
  }

  initAnimations() {
    gsap.fromTo('.gsap-hero-element',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', clearProps: 'all' }
    );

    gsap.utils.toArray<HTMLElement>('.gsap-fade-up').forEach((el) => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }
      );
    });

    gsap.utils.toArray<HTMLElement>('.gsap-fade-left').forEach((el) => {
      gsap.fromTo(el,
        { x: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }
      );
    });

    ScrollTrigger.batch('.gsap-skill-category', {
      start: 'top 85%',
      onEnter: (elements) => {
        gsap.fromTo(elements,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
        );
      }
    });

    ScrollTrigger.batch('.gsap-project-card', {
      start: 'top 85%',
      onEnter: (elements) => {
        gsap.fromTo(elements,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
        );
      }
    });
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isBrowser) return;

    const { clientX, clientY } = event;
    const section = event.currentTarget as HTMLElement;
    const rect = section.getBoundingClientRect();
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    gsap.to('.js-mouse-glow', {
      x: x,
      y: y,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.to('.glow-1', {
      x: (x - rect.width / 2) * 0.05,
      y: (y - rect.height / 2) * 0.05,
      duration: 2,
      ease: 'power2.out'
    });

    gsap.to('.glow-2', {
      x: (x - rect.width / 2) * -0.03,
      y: (y - rect.height / 2) * -0.03,
      duration: 2.5,
      ease: 'power2.out'
    });
  }

  getSkillsByCategory(cat: string): Skill[] {
    return this.skills.filter(s => s.category === cat);
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.messagesService.sendMessage(this.contactForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.isSubmitting = false;
        this.contactForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.successMessage = '';
  }

  private updateMetaTags(profile: Profile) {
    this.meta.updateTag({ name: 'description', content: profile.bio });
    this.meta.updateTag({ property: 'og:title', content: `${profile.name} | ${profile.title}` });
    this.meta.updateTag({ property: 'og:description', content: profile.bio });
    if (profile.profileImageUrl) {
      this.meta.updateTag({ property: 'og:image', content: profile.profileImageUrl });
    }
  }
}
