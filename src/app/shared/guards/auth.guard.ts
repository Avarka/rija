import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise((resolve) => {
    authService
      .isUserLoggedIn()
      .pipe(take(1))
      .subscribe((user) => {
        if (!user) {
          authService.logout();
          router.navigate(['/login']);
          return resolve(false);
        }
        return resolve(true);
      });
  });
};
