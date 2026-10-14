import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { Auth, Role } from './auth.service';

/** Needs a signed-in user; if the route has data.roles, the user must also have one of them. */
export const authGuard: CanActivateFn & CanActivateChildFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
  const roles = route.data['roles'] as Role[] | undefined;
  return auth.hasRole(roles) ? true : router.createUrlTree(['/']);
};

/** Keeps signed-in users away from the login page. */
export const guestGuard: CanActivateFn = () => {
  return inject(Auth).isLoggedIn() ? inject(Router).createUrlTree(['/']) : true;
};
