import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import {
    Button,
    Card,
    Checkbox,
    Column,
    ConfirmDialog,
    DataTable,
    Dialog, Drawer,
    FileUpload, FloatLabel, IconField, InputIcon, InputNumber, InputText, Menu,
    Rating, Row, Select,
    SelectButton, Tag, Textarea, Toast, Toolbar
} from "primevue";
import i18n from "./i18n.js";

const app = createApp(App)

app.use(i18n)
    .use(PrimeVue,{
        theme:{
            preset: Aura,
            ripple: true,
            options:{
                darkModeSelector: false,
            }
        },
    })
    .component('pv-drawer', Drawer)
    .component('pv-button', Button)
    .component('pv-toolbar', Toolbar)
    .component('pv-selectButton', SelectButton)
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-checkbox', Checkbox)
    .component('pv-data-table', DataTable)
    .component('pv-dialog', Dialog)
    .component('pv-select', Select)
    .component('pv-select-button', SelectButton)
    .component('pv-file-upload', FileUpload)
    .component('pv-float-label', FloatLabel)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-text', InputText)
    .component('pv-input-number', InputNumber)
    .component('pv-menu', Menu)
    .component('pv-rating', Rating)
    .component('pv-row', Row)
    .component('pv-drawer', Drawer)
    .component('pv-tag', Tag)
    .component('pv-textarea', Textarea)
    .component('pv-toolbar', Toolbar)
    .component('pv-toast', Toast)
    .mount('#app')

