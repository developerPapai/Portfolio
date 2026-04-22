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

  createProject(projectData: any): Observable<{success: boolean, data: Project}> {
    return this.http.post<{success: boolean, data: Project}>('/projects', projectData);
  }

  updateProject(id: string, projectData: any): Observable<{success: boolean, data: Project}> {
    return this.http.put<{success: boolean, data: Project}>(`/projects/${id}`, projectData);
  }

  deleteProject(id: string): Observable<{success: boolean, data: any}> {
    return this.http.delete<{success: boolean, data: any}>(`/projects/${id}`);
  }

  uploadImage(file: File): Observable<{success: boolean, url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{success: boolean, url: string}>('/upload', formData);
  }
}
