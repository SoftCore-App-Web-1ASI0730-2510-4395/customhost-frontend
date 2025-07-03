import { ref, computed } from 'vue';
import AuthService from '../../iam/services/auth.service';

// Estado global de autenticación
const user = ref(null);
const isLoading = ref(false);

export function useAuth() {
  // Computed properties
  const isAuthenticated = computed(() => {
    return user.value && user.value.token;
  });

  const userRole = computed(() => {
    return user.value ? user.value.role : null;
  });

  const isGuest = computed(() => {
    return userRole.value === 'GUEST';
  });

  const isStaff = computed(() => {
    return userRole.value === 'STAFF';
  });

  const isAdmin = computed(() => {
    return userRole.value === 'ADMIN';
  });

  // Methods
  const loadUserFromStorage = () => {
    const userData = AuthService.getCurrentUser();
    if (userData) {
      user.value = userData;
    }
  };

  const login = async (credentials) => {
    isLoading.value = true;
    try {
      const userData = await AuthService.signIn(credentials);
      user.value = userData;
      return userData;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    AuthService.signOut();
    user.value = null;
  };

  const registerUser = async (userData) => {
    isLoading.value = true;
    try {
      return await AuthService.signUpUser(userData);
    } finally {
      isLoading.value = false;
    }
  };

  const registerHotel = async (hotelData) => {
    isLoading.value = true;
    try {
      return await AuthService.signUpHotel(hotelData);
    } finally {
      isLoading.value = false;
    }
  };

  // Inicializar al cargar el composable
  if (!user.value) {
    loadUserFromStorage();
  }

  return {
    // State
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    
    // Computed
    isAuthenticated,
    userRole,
    isGuest,
    isStaff,
    isAdmin,
    
    // Methods
    login,
    logout,
    registerUser,
    registerHotel,
    loadUserFromStorage
  };
}
