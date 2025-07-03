import { useAuth } from '../composables/useAuth.js';

// Guards de navegación
export function requireAuth(to, from, next) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated.value) {
    next('/iam/login');
  } else {
    next();
  }
}

export function requireGuest(to, from, next) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated.value) {
    // Si ya está autenticado, redirigir según su rol
    const { userRole } = useAuth();
    if (userRole.value === 'ADMIN' || userRole.value === 'STAFF') {
      next('/staff-home');
    } else {
      next('/guest-home');
    }
  } else {
    next();
  }
}

export function requireAdmin(to, from, next) {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated.value) {
    next('/iam/login');
  } else if (!isAdmin.value) {
    next('/unauthorized');
  } else {
    next();
  }
}

export function requireStaff(to, from, next) {
  const { isAuthenticated, isStaff, isAdmin } = useAuth();
  
  if (!isAuthenticated.value) {
    next('/iam/login');
  } else if (!isStaff.value && !isAdmin.value) {
    next('/unauthorized');
  } else {
    next();
  }
}
