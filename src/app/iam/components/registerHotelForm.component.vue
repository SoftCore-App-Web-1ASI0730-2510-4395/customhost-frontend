<script>
// Nuevo componente: c:\Users\halli\OneDrive\Documentos\customhost\wa\src\iam\components\registerHotelForm.component.vue
export default {
  name: "RegisterHotelForm",
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },  data() {
    return {
      hotelName: '',
      username: '',
      email: '',
      password: '',
      passwordRepeat: '',
      submitted: false, // Manejo local de "submitted" para validación de campos
      formErrorMessage: '' // Mensaje de error específico del formulario (ej. contraseñas no coinciden)
    };
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      this.formErrorMessage = '';

      if (!this.hotelName || !this.username || !this.email || !this.password || !this.passwordRepeat) {
        // Los mensajes de error individuales se mostrarán bajo cada campo
        return;
      }

      if (this.password !== this.passwordRepeat) {
        this.formErrorMessage = 'Las contraseñas no coinciden.';
        // Podríamos añadir la clase p-invalid directamente aquí si es necesario,
        // pero los mensajes de error ya son bastante claros.
        // if (this.$refs.passwordRepeatInputHotelForm && this.$refs.passwordRepeatInputHotelForm.$el) {
        //    this.$refs.passwordRepeatInputHotelForm.$el.classList.add('p-invalid');
        // }
        return;
      }
      
      // Emitir los datos del formulario al componente padre
      this.$emit('submit-registration', {
        hotelName: this.hotelName,
        username: this.username,
        email: this.email,
        password: this.password
      });
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="register-hotel-form">
    <div class="field">
      <label for="hotelNameForm" class="block">Nombre del Hotel</label>
      <pv-input-text 
        id="hotelNameForm" 
        v-model="hotelName" 
        :class="{'p-invalid': submitted && !hotelName}" 
        aria-describedby="hotelNameForm-error"
        class="w-full"
        placeholder="Ej: Gran Hotel Vista Hermosa"
      />
      <small id="hotelNameForm-error" class="p-error" v-if="submitted && !hotelName">El nombre del hotel es obligatorio.</small>
    </div>

    <div class="field mt-4">
      <label for="usernameHotelForm" class="block">Usuario Administrador</label>
      <pv-input-text 
        id="usernameHotelForm" 
        v-model="username" 
        :class="{'p-invalid': submitted && !username}" 
        aria-describedby="usernameHotelForm-error"
        class="w-full"
        placeholder="Crea un nombre de usuario para el administrador"
      />
      <small id="usernameHotelForm-error" class="p-error" v-if="submitted && !username">El nombre de usuario es obligatorio.</small>
    </div>

    <div class="field mt-4">
      <label for="emailHotelForm" class="block">Email de Contacto del Hotel</label>
      <pv-input-text 
        id="emailHotelForm" 
        v-model="email" 
        type="email"
        :class="{'p-invalid': submitted && !email}" 
        aria-describedby="emailHotelForm-error"
        class="w-full"
        placeholder="ejemplo@hotel.com"
      />
      <small id="emailHotelForm-error" class="p-error" v-if="submitted && !email">El email de contacto es obligatorio.</small>
    </div>

    <div class="field mt-4">
      <label for="passwordHotelForm" class="block">Contraseña de Administrador</label>
      <pv-password 
        id="passwordHotelForm" 
        v-model="password" 
        :class="{'p-invalid': submitted && !password}"
        :feedback="false"
        toggleMask
        aria-describedby="passwordHotelForm-error"
        class="w-full"
        placeholder="Crea una contraseña segura"
      />
      <small id="passwordHotelForm-error" class="p-error" v-if="submitted && !password">La contraseña es obligatoria.</small>
    </div>

    <div class="field mt-4">
      <label for="passwordRepeatHotelForm" class="block">Repetir Contraseña</label>
      <pv-password 
        id="passwordRepeatHotelForm" 
        v-model="passwordRepeat"
        ref="passwordRepeatInputHotelForm" 
        :class="{'p-invalid': (submitted && !passwordRepeat) || (submitted && password !== passwordRepeat && passwordRepeat)}"
        :feedback="false"
        toggleMask
        aria-describedby="passwordRepeatHotelForm-error"
        class="w-full"
        placeholder="Confirma la contraseña"
      />
      <small id="passwordRepeatHotelForm-error" class="p-error" v-if="submitted && !passwordRepeat">Por favor, repite la contraseña.</small>
      <small id="passwordMismatchHotelForm-error" class="p-error" v-if="submitted && password !== passwordRepeat && passwordRepeat">Las contraseñas no coinciden.</small>
    </div>
    
    <!-- Mensaje de error específico del formulario (ej. contraseñas no coinciden) -->
    <pv-message severity="error" v-if="formErrorMessage" class="mt-3">{{ formErrorMessage }}</pv-message>
    
    <div class="flex justify-content-end align-items-center mt-4">
      <pv-button 
        type="submit" 
        label="Enviar Solicitud de Registro"
        icon="pi pi-check"
        :loading="loading" 
        :disabled="loading"
        class="register-hotel-button" 
      />
    </div>
    
    <div class="text-center mt-4">
      <p>¿Tu hotel ya está registrado? <router-link to="/auth/login">Accede aquí</router-link></p>
    </div>
  </form>
</template>

<style scoped>
/* Estilos específicos del formulario que estaban en registerHotelComponent.vue */
.register-hotel-form {
  padding: 0.5rem 0; /* Padding del formulario ajustado */
}

.field {
  margin-bottom: 1rem; /* Espacio estándar entre campos */
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.p-error {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.register-hotel-button {
  min-width: 220px; /* Botón más ancho para el texto largo */
  padding: 0.8rem 1.5rem; /* Padding del botón */
}

/* Ajustes para el campo de contraseña pv-password */
.register-hotel-form .field :deep(.p-password.w-full) {
  display: flex; 
}

.register-hotel-form .field :deep(.p-password.w-full .p-password-input) {
  flex-grow: 1; 
}

.mt-3 {
  margin-top: 0.75rem; /* PrimeFlex like utility */
}
.mt-4 {
  margin-top: 1rem; /* PrimeFlex like utility */
}
.w-full {
  width: 100%;
}
.block {
  display: block;
}
.flex {
  display: flex;
}
.justify-content-end {
  justify-content: flex-end;
}
.align-items-center {
  align-items: center;
}
.text-center {
  text-align: center;
}
</style>
