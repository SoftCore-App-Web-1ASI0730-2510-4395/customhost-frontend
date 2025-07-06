<script setup>
import { ref } from 'vue';
import LanguageSwitcher from '../../public/components/languageSwitcher.component.vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-registration']);

const hotelName = ref('');
const username = ref('');
const password = ref('');
const passwordRepeat = ref('');
const submitted = ref(false);
const formErrorMessage = ref('');

function handleSubmit() {
  submitted.value = true;
  formErrorMessage.value = '';

  if (!hotelName.value || !username.value || !password.value || !passwordRepeat.value) {
    formErrorMessage.value = $t('registerHotel.allFieldsRequired');
    return;
  }

  if (password.value !== passwordRepeat.value) {
    formErrorMessage.value = $t('registerHotel.passwordsDontMatch');
    return;
  }

  if (password.value.length < 6) {
    formErrorMessage.value = $t('registerHotel.passwordMinLength');
    return;
  }

  emit('submit-registration', {
    hotelName: hotelName.value,
    username: username.value,
    password: password.value
  });
}
</script>

<template>
  <div class="register-hotel-form-wrapper">
    <div class="register-hotel-lang-switcher">
      <language-switcher />
    </div>
    <form @submit.prevent="handleSubmit" class="register-hotel-form">
      <div class="field">
        <label for="hotelNameForm" class="block">{{$t('registerHotel.hotelNameLabel')}}</label>
        <pv-input-text
            id="hotelNameForm"
            v-model="hotelName"
            :class="{'p-invalid': submitted && !hotelName}"
            aria-describedby="hotelNameForm-error"
            class="w-full"
            :placeholder="$t('registerHotel.hotelNamePlaceholder')"
        />
        <small id="hotelNameForm-error" class="p-error" v-if="submitted && !hotelName">{{$t('registerHotel.hotelNameRequired')}}</small>
      </div>

      <div class="field mt-4">
        <label for="usernameHotelForm" class="block">{{$t('registerHotel.usernameLabel')}}</label>
        <pv-input-text
            id="usernameHotelForm"
            v-model="username"
            :class="{'p-invalid': submitted && !username}"
            aria-describedby="usernameHotelForm-error"
            class="w-full"
            :placeholder="$t('registerHotel.usernamePlaceholder')"
        />
        <small id="usernameHotelForm-error" class="p-error" v-if="submitted && !username">{{$t('registerHotel.usernameRequired')}}</small>
      </div>

      <div class="field mt-4">
        <label for="passwordHotelForm" class="block">{{$t('registerHotel.passwordLabel')}}</label>
        <pv-password
            id="passwordHotelForm"
            v-model="password"
            :class="{'p-invalid': submitted && !password}"
            aria-describedby="passwordHotelForm-error"
            class="w-full"
            :placeholder="$t('registerHotel.passwordPlaceholder')"
            toggleMask
            :feedback="false"
        />
        <small id="passwordHotelForm-error" class="p-error" v-if="submitted && !password">{{$t('registerHotel.passwordRequired')}}</small>
      </div>

      <div class="field mt-4">
        <label for="passwordRepeatHotelForm" class="block">{{$t('registerHotel.passwordRepeatLabel')}}</label>
        <pv-password
            id="passwordRepeatHotelForm"
            v-model="passwordRepeat"
            :class="{'p-invalid': submitted && !passwordRepeat}"
            aria-describedby="passwordRepeatHotelForm-error"
            class="w-full"
            :placeholder="$t('registerHotel.passwordRepeatPlaceholder')"
            toggleMask
            :feedback="false"
        />
        <small id="passwordRepeatHotelForm-error" class="p-error" v-if="submitted && !passwordRepeat">{{$t('registerHotel.passwordRepeatRequired')}}</small>
      </div>

      <pv-message severity="error" v-if="formErrorMessage" class="mt-3">{{ formErrorMessage }}</pv-message>

      <div class="button-container mt-4">
        <pv-button
            type="submit"
            :label="$t('registerHotel.button')"
            class="w-full register-hotel-button"
            :loading="loading"
            :disabled="loading"
        />
      </div>

      <div class="login-link-container mt-4">
        <p class="text-center">
          {{$t('registerHotel.alreadyHaveAccount')}}
          <router-link to="/iam/login" class="login-link">{{$t('registerHotel.loginLink')}}</router-link>
        </p>
      </div>
      <div class="alternative-registration mt-3">
        <p class="text-center">
          {{$t('registerHotel.isUser')}}
          <router-link to="/iam/register" class="user-link">{{$t('registerHotel.userLink')}}</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped>
.register-hotel-form-wrapper {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px 0 rgba(255, 107, 107, 0.13);
  padding: 2.5rem 2rem 2rem 2rem;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
}

.register-hotel-lang-switcher {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.register-hotel-form {
  width: 100%;
}

.field {
  margin-bottom: 1rem;
}

.button-container {
  margin-top: 1.5rem;
}

.register-hotel-button {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.register-hotel-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.login-link-container,
.alternative-registration {
  text-align: center;
}

.login-link,
.user-link {
  color: var(--p-primary-color);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link:hover,
.user-link:hover {
  color: var(--p-primary-600);
  text-decoration: underline;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .register-hotel-form {
    padding: 0 0.5rem;
  }
}
</style>