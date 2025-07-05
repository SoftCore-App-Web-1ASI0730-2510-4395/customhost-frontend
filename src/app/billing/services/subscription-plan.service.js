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

