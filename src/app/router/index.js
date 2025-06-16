import { createRouter, createWebHistory } from 'vue-router';

import HomeComponent from "../public/pages/homeComponent.vue";

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
const notFoundComponent = () => import("../public/pages/notFoundComponent.vue");
const profileComponent = () => import("../profiles/pages/profileComponent.vue");
const registerHotelComponent = () => import("../iam/pages/registerHotel.component.vue");
const RoomsListComponent = () => import("../crm/pages/rooms-listComponent.vue");
const HotelRoomSelection = () => import("../crm/pages/guests/hotel-rooms-selection.component.vue");
const RoomPreferencesComponent = () => import("../guest-experience/pages/room-preference.component.vue");
const notificationComponent = () => import("../crm/pages/guests/notification.component.vue");


// Rutas organizadas por dominio (bounded contexts)
const routes = [
    {
        path: '/home',
        name: 'Home',
        component: HomeComponent,
        meta: { title: 'Home' }
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
                meta: { title: 'Login' }
            },
            {
                path: 'register',
                name: 'Register',
                component: registerComponent,
                meta: { title: 'Register' }
            },
            {
                path: 'register-hotel',
                name: 'RegisterHotel',
                component: registerHotelComponent,
                meta: { title: 'Register Hotel' }
            }
        ]
    },
    {
        path: '/profiles',
        name: 'Profiles',
        redirect: '/home',
        children: [
            {
                path: 'profile',
                name: 'Profile',
                component: profileComponent,
                meta: { title: 'Profile' }
            },
            {
                path: '/preferences',
                name: 'Preferences',
                component: preferencesComponent,
                meta: { title: 'Preferences' }
            }
        ]
    },

    {
        path: '/crm',
        name: 'CRM',
        redirect: '/home',
        children: [
            {
                path: 'rooms',
                name: 'rooms',
                component: RoomsListComponent,
                meta: { title: 'rooms' }
            },
            {
                path: 'guest/hotel-room-selection',
                name: 'hotel-room-selection',
                component: HotelRoomSelection,
                meta: { title: 'hotel-room-selection' }
            },

            {
                path: 'my-bookings',
                name: 'MyBookings',
                component: MyBookingsComponent,
                meta: { title: 'My Bookings' }
            },

            {
                path: 'guest/notifications',
                name: 'notifications',
                component: notificationComponent,
                meta: { title: 'notifications' }
            },
            {
                path: 'customer-service',
                name: 'CustomerService',
                component: customerServiceComponent,
                meta: { title: 'Customer Service' }
            },
            {
                path: 'customer-requests',
                name: 'CustomerRequests',
                component: customerRequestsComponent,
                meta: { title: 'Customer Requests' }
            },
            {
                path: 'request-staff',
                name: 'RequestStaff',
                component: requestStaffComponent,
                meta: { title: 'Request Staff' }
            },
            {
                path: 'bookings-tracker',
                name: 'BookingsTracker',
                component: bookingsTrackerComponent,
                meta: { title: 'Bookings Tracker' }
            },
            {
                path: 'rooms',
                name: 'Rooms',
                component: RoomsListComponent,
                meta: { title: 'Rooms' }
            }
        ]
    },

    // Guest Experience context
    {
        path: '/guest-experience',
        name: 'GuestExperience',
        redirect: '/home',
        children: [
            {
                path: 'iot-devices',
                name: 'IotDevices',
                component: iotDevicesComponent,
                meta: { title: 'IoT Devices' }
            },
            {
                path: 'preferences',
                name: 'preferences',
                component: RoomPreferencesComponent,
                meta: { title: 'preferences' }
            }
        ]
    },
    {
        path: '/billing',
        name: 'Billing',
        redirect: '/home',
        children: [
            {
                path: 'admin',
                name: 'Admin',
                component: adminComponent,
                meta: { title: 'Admin' }
            }
        ]
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: notFoundComponent,
        meta: { title: 'Page Not Found' }
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
    next();
});

export default router;