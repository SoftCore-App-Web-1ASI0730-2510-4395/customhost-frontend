import apiClient from '../../shared/services/api-service.js';
import Profile from '../model/profile.entity.js';

const API_URL = '/api/v1/profiles';

export const getProfilesByEmail = async (email) => {
  const response = await apiClient.get(`${API_URL}/email/${email}`);
  if (Array.isArray(response.data)) {
    return response.data.map(p => new Profile(p));
  }
  return response.data ? [new Profile(response.data)] : [];
};

export const getProfilesByUserId = async (userId) => {
  const response = await apiClient.get(`${API_URL}/${userId}`);
  return response.data ? new Profile(response.data) : null;
};
