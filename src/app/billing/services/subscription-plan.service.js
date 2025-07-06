import apiClient from '../../shared/services/api-service.js';
import SubscriptionPlan from '../model/subscription-plan.entity.js';

const API_URL = '/api/v1/subscription-plan';

export const getSubscriptionPlans = async () => {
  try {
    const response = await apiClient.get(API_URL);
    return response.data.map(plan => new SubscriptionPlan(plan));
  } catch (error) {
    console.error('Error al obtener planes de suscripción:', error);
    throw error;
  }
};

export const getSubscriptionPlanById = async (id) => {
  try {
    console.log('Buscando plan de suscripción por id:', id);
    const response = await apiClient.get(`${API_URL}/${id}`);
    console.log('Respuesta del backend para el plan:', response.data);
    return new SubscriptionPlan(response.data);
  } catch (error) {
    console.error('Error al obtener el plan de suscripción por id:', error);
    throw error;
  }
};
