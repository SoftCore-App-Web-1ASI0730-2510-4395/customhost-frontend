import { createRouter, createWebHistory } from 'vue-router';

// Import del composable de autenticación
function isAuthenticated() {
    const userData = localStorage.getItem('userData');
    if (!userData) return false;
    
    try {
        const parsed = JSON.parse(userData);
        return !!(parsed && parsed.token && parsed.username);
    } catch (error) {
        return false;
    }
}




const preferencesComponent = () => import("../profiles/pages/preferencesComponent.vue");
const iotDevicesComponent = () => import("../guest-experience/pages/iot-room-configuration-page.component.vue");
const MyBookingsComponent = () => import("../crm/pages/my-booking.component.vue");
const requestStaffComponent = () => import("../crm/pages/requestStaffComponent.vue");
const customerRequestsComponent = () => import("../crm/pages/customerRequestsComponent.vue");
const adminComponent = () => import("../billing/pages/adminComponent.vue");
const bookingsTrackerComponent = () => import("../crm/pages/bookingsTrackerComponent.vue");
const customerServiceComponent = () => import("../crm/pages/guests/create-service-request.component.vue");
const loginComponent = () => import("../iam/pages/login.component.vue");
const registerComponent = () => import("../iam/pages/register.component.vue");
const notFoundComponent = () => import("../public/pages/page-not-found.component.vue");
const profileComponent = () => import("../profiles/pages/profileComponent.vue");
const registerHotelComponent = () => import("../iam/pages/registerHotel.component.vue");
const RoomsListComponent = () => import("../crm/pages/rooms-listComponent.vue");
const HotelRoomSelection = () => import("../crm/pages/guests/hotel-rooms-selection.component.vue");
const RoomPreferencesComponent = () => import("../guest-experience/pages/guest-room-preference.component.vue");
const notificationComponent = () => import("../crm/pages/guests/notification.component.vue");
const PaymentComponent = () => import("../billing/pages/payment.component.vue");
const SelectDatesComponent = () => import("../crm/pages/guests/select-date.component.vue");
const guestHomePage = () => import("../public/pages/guest-home-page.component.vue");
const staffHomePage = () => import("../public/pages/staff-home-page.component.vue");

// Rutas organizadas por dominio (bounded contexts)
const routes = [

    // STAFF HOME
    {
        path: '/staff-home',
        name: 'StaffHome',
        component: staffHomePage,
        meta: { title: 'StaffHome', requiresAuth: true }
    },

    // GUEST HOME

    {
        path: '/guest-home',
        name: 'GuestHome',
        component: guestHomePage,
        meta: { title: 'GuestHome', requiresAuth: true }
    },
    {
        path: '/iam',
        name: 'Iam',
        redirect: '/iam/login',
        children: [
            {
                path: 'login',
                name: 'Login',
                component: loginComponent,
                meta: { title: 'Login', public: true }
            },
            {
                path: 'register',
                name: 'Register',
                component: registerComponent,
                meta: { title: 'Register', public: true }
            },
            {
                path: 'register-hotel',
                name: 'RegisterHotel',
                component: registerHotelComponent,
                meta: { title: 'Register Hotel', public: true }
            }
        ]
    },
    {
        path: '/profiles',
        name: 'Profiles',
        redirect: '/home',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'profile',
                name: 'Profile',
                component: profileComponent,
                meta: { title: 'Profile', requiresAuth: true }
            },
            {
                path: '/preferences',
                name: 'Preferences',
                component: preferencesComponent,
                meta: { title: 'Preferences', requiresAuth: true }
            }
        ]
    },

    {
        path: '/crm',
        name: 'CRM',
        redirect: '/home',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'rooms',
                name: 'rooms',
                component: RoomsListComponent,
                meta: { title: 'rooms', requiresAuth: true }
            },
            {
                path: 'guest/hotel-room-selection',
                name: 'hotel-room-selection',
                component: HotelRoomSelection,
                meta: { title: 'hotel-room-selection', requiresAuth: true }
            },

            {
                path: 'my-bookings',
                name: 'MyBookings',
                component: MyBookingsComponent,
                meta: { title: 'MyBookings', requiresAuth: true }
            },

            {
                path: 'guest/notifications',
                name: 'notifications',
                component: notificationComponent,
                meta: { title: 'notifications', requiresAuth: true }
            },
            {
                path: 'customer-service',
                name: 'CustomerService',
                component: customerServiceComponent,
                meta: { title: 'Customer Service', requiresAuth: true }
            },
            {
                path: 'customer-requests',
                name: 'CustomerRequests',
                component: customerRequestsComponent,
                meta: { title: 'Customer Requests', requiresAuth: true }
            },
            {
                path: 'request-staff',
                name: 'RequestStaff',
                component: requestStaffComponent,
                meta: { title: 'Request Staff', requiresAuth: true }
            },
            {
                path: 'bookings-tracker',
                name: 'BookingsTracker',
                component: bookingsTrackerComponent,
                meta: { title: 'Bookings Tracker', requiresAuth: true }
            },
            {
                path: 'rooms',
                name: 'Rooms',
                component: RoomsListComponent,
                meta: { title: 'Rooms', requiresAuth: true }
            },
            {
                path: 'selectDates',
                name: 'SelectDatesPage',
                component: SelectDatesComponent,
                meta: { title: 'SelectDatesPage', requiresAuth: true }
            }

        ]
    },

    // Guest Experience context
    {
        path: '/guest-experience',
        name: 'GuestExperience',
        redirect: '/home',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'staff-devices',
                name: 'IotDevices',
                component: iotDevicesComponent,
                meta: { title: 'IoT Devices', requiresAuth: true }
            },
            {
                path: 'preferences',
                name: 'preferences',
                component: RoomPreferencesComponent,
                meta: { title: 'preferences', requiresAuth: true }
            }
        ]
    },
    {
        path: '/billing',
        name: 'Billing',
        redirect: '/home',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'admin',
                name: 'Admin',
                component: adminComponent,
                meta: { title: 'Admin', requiresAuth: true }
            },
            {
                path: 'paymentPage',
                name: 'PaymentPage',
                component: PaymentComponent,
                meta: { title: 'PaymentPage', requiresAuth: true }
            },
            {
                path: 'credit-card',
                name: 'CreditCardPayment',
                component: () => import('../billing/pages/credit-card-payment.component.vue'),
                meta: { title: 'Pago con Tarjeta', requiresAuth: true }
            }

        ]
    },
    {
        path: '/',
        redirect: '/guest-home',
        meta: { requiresAuth: true }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: notFoundComponent,
        meta: { title: 'Page Not Found', requiresAuth: true }
    }
];


export const router = createRouter({
    history: createWebHistory(),
    routes,
})
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'Custom Host';
    document.title = `${baseTitle} | ${to.meta['title']}`;
    
    // Verificar si la ruta es pública
    const isPublicRoute = to.meta?.public === true;
    
    // Si es una ruta pública, permitir acceso
    if (isPublicRoute) {
        next();
        return;
    }
    
    // Para rutas protegidas, verificar autenticación
    if (!isAuthenticated()) {
        console.log('Usuario no autenticado, redirigiendo a login');
        next('/iam/login');
        return;
    }
    
    // Usuario autenticado, permitir acceso
    next();
});

export default router;