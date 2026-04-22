import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends ApiService {
  
  getProjects(featured?: boolean, category?: string): Observable<{success: boolean, data: Project[]}> {
    let params: any = {};
    if (featured !== undefined) params.featured = featured;
    if (category) params.category = category;
    
    return this.http.get<{success: boolean, data: Project[]}>('/projects', { params });
  }

  getProject(id: string): Observable<{success: boolean, data: Project}> {
    return this.http.get<{success: boolean, data: Project}>(`/projects/${id}`);
  }
}
