import { createRouter, createWebHistory } from 'vue-router';

import profileComponent from "../profiles/pages/profileComponent.vue";

const preferencesComponent = () => import("../profiles/pages/preferencesComponent.vue");
const bookComponent = () => import("../crm/pages/bookComponent.vue");
const myBookingsComponent = () => import("../crm/pages/myBookingsComponent.vue");
const iotDevicesComponent = () => import("../guest-experience/pages/iotDevicesComponent.vue");
const requestStaffComponent = () => import("../crm/pages/requestStaffComponent.vue");
const customerRequestsComponent = () => import("../crm/pages/customerRequestsComponent.vue");
const adminComponent = () => import("../auth/pages/adminComponent.vue");
const bookingsTrackerComponent = () => import("../crm/pages/bookingsTrackerComponent.vue");
const customerServiceComponent = () => import("../crm/pages/customerServiceComponent.vue");
const loginComponent = () => import("../auth/pages/loginComponent.vue");
const registerComponent = () => import("../auth/pages/registerComponent.vue");


const routes = [
    {
        name: "Auth",
        path: "/auth",
        children: [
            {
                name: "Login",
                path: "/auth/login",
                component: loginComponent,
                meta: { title: 'Login' }
            },
            {
                name: "Register",
                path: "/auth/register",
                component: registerComponent,
                meta: { title: 'Register' }
            }
        ]
    },
    {
        name: "Profile",
        path: '/home',
        component: profileComponent,
        meta: { title: 'Home' }
    },
    {
        name: "Admin",
        path: '/admin',
        component: adminComponent,
        meta: { title: 'Admin' }
    },
    {
        name: "Preferences",
        path: '/preferences',
        component: preferencesComponent,
        meta: { title: 'Preferences' }
    },
    {
        name: "Book",
        path: '/book',
        component: bookComponent,
        meta: { title: 'Book' }
    },
    {
        name: "MyBookings",
        path: '/my-bookings',
        component: myBookingsComponent,
        meta: { title: 'My Bookings' }
    },
    {
        name: "CustomerService",
        path: '/customer-service',
        component: customerServiceComponent,
        meta: { title: 'Customer Service' }
    },
    {
        name: "IotDevices",
        path: '/iot-devices',
        component: iotDevicesComponent,
        meta: { title: 'IoT Devices' }
    },
    {
        name: "BookingsTracker",
        path: '/bookings-tracker',
        component: bookingsTrackerComponent,
        meta: { title: 'Bookings Tracker' }
    },
    {
        name: "CustomerRequests",
        path: '/customer-requests',
        component: customerRequestsComponent,
        meta: { title: 'Customer Requests' }
    },
    {
        name: "RequestStaff",
        path: '/request-staff',
        component: requestStaffComponent,
        meta: { title: 'Request Staff' }
    },
    {
        path: '/', redirect: '/home',
    },
    //Todo: Not found component
    // {
    //     name: "NotFound",
    //     path: "/:pathMatch(.*)*",
    //     component: notFoundComponent,
    //
    // }


]

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