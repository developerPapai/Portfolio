import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillsService, Skill } from '../../core/services/skills.service';
import { SkillDialogComponent } from './skill-dialog/skill-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, SkillDialogComponent],
  templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnInit {
  private skillsService = inject(SkillsService);
  skills: Skill[] = [];
  categories: string[] = [];
  isLoading = true;

  showDialog = false;
  selectedSkill: Skill | null = null;

  ngOnInit() {
    this.loadSkills();
  }

  loadSkills() {
    this.isLoading = true;
    this.skillsService.getSkills().subscribe({
      next: (res) => {
        this.skills = res.data;
        this.categories = [...new Set(this.skills.map(s => s.category))];
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  getSkillsByCategory(category: string): Skill[] {
    return this.skills.filter(s => s.category === category);
  }

  openAddDialog() {
    this.selectedSkill = null;
    this.showDialog = true;
  }

  openEditDialog(skill: Skill) {
    this.selectedSkill = skill;
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.selectedSkill = null;
  }

  saveSkill(skillData: any) {
    if (this.selectedSkill && this.selectedSkill._id) {
      this.skillsService.updateSkill(this.selectedSkill._id, skillData).subscribe({
        next: () => {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Skill updated', showConfirmButton: false, timer: 3000 });
          this.closeDialog();
          this.loadSkills();
        },
        error: (err) => Swal.fire('Error', err.error?.message || 'Failed to update skill', 'error')
      });
    } else {
      this.skillsService.createSkill(skillData).subscribe({
        next: () => {
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Skill created', showConfirmButton: false, timer: 3000 });
          this.closeDialog();
          this.loadSkills();
        },
        error: (err) => Swal.fire('Error', err.error?.message || 'Failed to create skill', 'error')
      });
    }
  }

  deleteSkill(id: string) {
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
        this.skillsService.deleteSkill(id).subscribe({
          next: () => {
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Skill deleted', showConfirmButton: false, timer: 3000 });
            this.loadSkills();
          },
          error: (err) => Swal.fire('Error', err.error?.message || 'Failed to delete skill', 'error')
        });
      }
    });
  }
}
