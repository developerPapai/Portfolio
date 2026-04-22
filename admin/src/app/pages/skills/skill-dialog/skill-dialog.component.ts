import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Skill } from '../../../core/services/skills.service';

@Component({
  selector: 'app-skill-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skill-dialog.component.html'
})
export class SkillDialogComponent implements OnInit {
  @Input() skill: Skill | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  
  skillForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    category: ['frontend', Validators.required],
    level: [80, [Validators.min(1), Validators.max(100)]],
    icon: [''],
    order: [0],
    visible: [true]
  });

  ngOnInit() {
    if (this.skill) {
      this.skillForm.patchValue(this.skill);
    }
  }

  onSubmit() {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.skillForm.value);
  }

  onClose() {
    this.close.emit();
  }
}
