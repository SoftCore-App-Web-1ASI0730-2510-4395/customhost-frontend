// src/app/public/services/home.facade.js

import guestFacade from '../../crm/services/guest.facade.js';

/**
 * Facade para exponer funcionalidades del home del huésped
 */

export const homeFacade = {
  /**
   * Obtiene las notificaciones del huésped
   * @param {number} userId
   * @returns {Promise<Array>} Array de notificaciones ordenadas
   */
  async getGuestNotifications(userId) {
    return guestFacade.getGuestNotifications(userId);
  },

  /**
   * Obtiene las reservas del huésped
   * @param {number} userId
   * @returns {Promise<Array>} Array de reservas
   */
  async getGuestBookings(userId) {
    return guestFacade.getGuestBookings(userId);
  },

  /**
   * Obtiene las solicitudes de servicio del huésped
   * @param {number} userId
   * @returns {Promise<Array>} Array de solicitudes
   */
  async getGuestServiceRequests(userId) {
    return guestFacade.getGuestServiceRequests(userId);
  }
};

