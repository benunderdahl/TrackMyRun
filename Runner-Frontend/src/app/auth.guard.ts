import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Already logged in — let through immediately
  if (auth.currentUser() !== null) {
    return true;
  }

  // Ask backend if session exists before redirecting
  return auth.restoreSession().pipe(
    map((loggedIn) => {
      if (loggedIn) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};