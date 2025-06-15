// src/crm/model/service-request.entity.js

export default class ServiceRequest {
    constructor({
                    id,
                    userId,
                    hotelId,
                    roomId,
                    type,
                    description,
                    status,
                    priority,
                    createdAt,
                    assignedTo = null,
                    completedAt = null,
                    history = []
                }) {
        if (!id) throw new Error("Service request must have an ID");

        this.id = id;
        this.userId = userId;
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.type = type; // Ej: "Limpieza", "Reparación", "Soporte"
        this.description = description || '';
        this.status = status; // Ej: "Pending", "Assigned", "Resolved"
        this.priority = priority; // Ej: "normal", "urgent"
        this.createdAt = new Date(createdAt);
        this.assignedTo = assignedTo; // staffId
        this.completedAt = completedAt ? new Date(completedAt) : null;
        this.history = history;

        // Relaciones externas (opcional)
        this.user = null;
        this.staff = null;
        this.room = null;
    }

    get isUrgent() {
        return this.priority === 'Urgente';
    }

    get formattedCreatedAt() {
        return this.createdAt.toLocaleDateString('es-ES');
    }

    get isCompleted() {
        return this.status === 'Resolved';
    }
}