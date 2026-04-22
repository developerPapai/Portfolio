import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Login | Admin'
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard | Admin'
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent),
    title: 'Projects | Admin'
  },
  {
    path: 'skills',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/skills/skills.component').then(m => m.SkillsComponent),
    title: 'Skills | Admin'
  },
  {
    path: 'messages',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent),
    title: 'Messages | Admin'
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    title: 'Profile | Admin'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
