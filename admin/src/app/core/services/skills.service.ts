import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SkillsService extends ApiService {
  
  getSkills(category?: string): Observable<{success: boolean, data: Skill[]}> {
    let params: any = {};
    if (category) params.category = category;
    
    return this.http.get<{success: boolean, data: Skill[]}>('/skills', { params });
  }

  createSkill(skillData: any): Observable<{success: boolean, data: Skill}> {
    return this.http.post<{success: boolean, data: Skill}>('/skills', skillData);
  }

  updateSkill(id: string, skillData: any): Observable<{success: boolean, data: Skill}> {
    return this.http.put<{success: boolean, data: Skill}>(`/skills/${id}`, skillData);
  }

  deleteSkill(id: string): Observable<{success: boolean, data: any}> {
    return this.http.delete<{success: boolean, data: any}>(`/skills/${id}`);
  }
}
