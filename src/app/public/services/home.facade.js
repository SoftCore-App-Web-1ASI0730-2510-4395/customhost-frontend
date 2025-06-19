// src/app/public/services/home.facade.js

import guestFacade from '../../crm/services/guest.facade.js';
import { getRooms } from '../../crm/services/rooms.service.js';
import { RoomDeviceManagementFacade } from '../../guest-experience/services/room-device-management.facade.js';
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
   * Devuelve todas las reservas con información del huésped
   * @param {number} userId
   * @returns {Promise<Array>} - Array de reservas con nombre del huésped
   */
  async getGuestBookingsDetailed(userId) {
    const guestFacade = await import('../../crm/services/guest.facade.js');
    return guestFacade.default.getGuestBookings(userId);
  },

  /**
   * Obtiene una reserva específica con info del huésped
   * @param {number} bookingId
   * @param {number} userId
   * @returns {Promise<Object>} - Reserva con información del huésped
   */
  async getGuestBookingById(bookingId, userId) {
    const guestFacade = await import('../../crm/services/guest.facade.js');
    return guestFacade.default.getGuestBookingById(bookingId, userId);
  },

  /**
   * Elimina una reserva específica
   * @param {number} bookingId
   * @returns {Promise<void>}
   */
  async deleteGuestBooking(bookingId) {
    const guestFacade = await import('../../crm/services/guest.facade.js');
    return guestFacade.default.deleteGuestBooking(bookingId);
  },

  /**
   * Devuelve las habitaciones asociadas a los bookings del usuario
   * @param {number} userId
   * @returns {Promise<Array>} habitaciones del usuario
   */
  async getUserRooms(userId) {
    const guestFacade = await import('../../crm/services/guest.facade.js');
    return guestFacade.default.getUserRooms(userId);
  },

  /**
   * Obtiene las solicitudes de servicio del huésped
   * @param {number} userId
   * @returns {Promise<Array>} Array de solicitudes
   */
  async getGuestServiceRequests(userId) {
    return guestFacade.getGuestServiceRequests(userId);
  },

  /**
   * Prepara los datos del pago con info del usuario, hotel y habitación
   * @param {number} userId
   * @param {number} roomId
   * @param {number} hotelId
   * @returns {Promise<Object>} - Datos preparados para el pago
   */
  async preparePaymentData(userId, roomId, hotelId) {
    // Importación dinámica para evitar dependencias circulares
    const paymentFacade = await import('../../billing/services/payment.facade.js');
    return paymentFacade.default.preparePaymentData(userId, roomId, hotelId);
  },

  /**
   * Realiza el pago y crea una reserva (booking) asociada
   * @param {Object} paymentData - Datos del pago a guardar
   * @returns {Promise<Object>} - Objeto con el pago y la reserva creada
   */
  async processPayment(paymentData) {
    const paymentFacade = await import('../../billing/services/payment.facade.js');
    return paymentFacade.default.processPayment(paymentData);
  },

  /**
   * Marca una habitación como ocupada
   * @param {number} roomId
   * @returns {Promise<Object>} - Respuesta del backend
   */
  async markRoomAsOccupied(roomId) {
    const paymentFacade = await import('../../billing/services/payment.facade.js');
    return paymentFacade.default.markRoomAsOccupied(roomId);
  },

  /**
   * Obtiene todos los pagos
   * @param {any} paramurl - Parámetro opcional para filtrar pagos
   * @returns {Promise<Array>} - Lista de pagos
   */
  async getAllPayments(paramurl) {
    const paymentFacade = await import('../../billing/services/payment.facade.js');
    // Si paymentFacade.default.getAllPayments soporta paramurl, pásalo
    return paymentFacade.default.getAllPayments(paramurl);
  },

  /**
   * Obtiene todas las habitaciones disponibles (status: 'Available')
   * @returns {Promise<Array>} habitaciones disponibles
   */
  async getAvailableRooms() {
    return getRooms();
  },

  /**
   * Obtiene los dispositivos IoT con status 'maintenance' o 'inactive' y su cuarto asignado
   * @returns {Promise<Array>} Lista de dispositivos IoT problemáticos con info de habitación
   */
  async getRoomDevicesWithIssues() {
    const { RoomDeviceManagementFacade } = await import('../../guest-experience/services/room-device-management.facade.js');
    const [roomDevices, rooms, iotDevices] = await Promise.all([
      RoomDeviceManagementFacade.getAllRoomDevices ? RoomDeviceManagementFacade.getAllRoomDevices() : [],
      RoomDeviceManagementFacade.getRooms ? RoomDeviceManagementFacade.getRooms() : [],
      RoomDeviceManagementFacade.getAllIotDevices ? RoomDeviceManagementFacade.getAllIotDevices() : [],
    ]);
    return (roomDevices || [])
      .filter(rd => rd.status === 'maintenance' || rd.status === 'inactive')
      .map(rd => {
        const device = (iotDevices || []).find(d => d.id === rd.iotDeviceId) || {};
        const room = (rooms || []).find(r => r.id === rd.roomId) || {};
        return {
          roomDeviceId: rd.id,
          deviceName: device.name || `ID ${rd.iotDeviceId}`,
          status: rd.status,
          roomId: rd.roomId,
          roomNumber: room.number || rd.roomId
        };
      });
  },

  async getRoomsWithIotDevices() {
    return RoomDeviceManagementFacade.getRoomsWithDevices();
  },

  /**
   * Obtiene sólo los dispositivos de una habitación cuyo status ≠ 'Available'
   */
  async getUnavailableDevicesByRoom(roomId) {
    return RoomDeviceManagementFacade.getAvailableDevicesForRoom(roomId);
  }
};