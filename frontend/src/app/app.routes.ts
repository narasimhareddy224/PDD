import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'analysis',
    loadComponent: () => import('./features/image-analysis/image-analysis.component').then((m) => m.ImageAnalysisComponent),
    canActivate: [authGuard],
  },
  {
    path: 'recommendations',
    loadComponent: () => import('./features/recommendations/recommendations.component').then((m) => m.RecommendationsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'outfits/:id',
    loadComponent: () => import('./features/outfits/outfit-detail/outfit-detail.component').then((m) => m.OutfitDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'shopping',
    loadComponent: () => import('./features/shopping/shopping-hub/shopping-hub.component').then((m) => m.ShoppingHubComponent),
    canActivate: [authGuard],
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites.component').then((m) => m.FavoritesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'calendar',
    loadComponent: () => import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
    canActivate: [authGuard],
  },
  {
    path: 'assistant',
    loadComponent: () => import('./features/assistant/assistant.component').then((m) => m.AssistantComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then((m) => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
