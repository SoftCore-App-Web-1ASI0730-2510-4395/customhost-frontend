// src/crm/model/notification.entity.js

export default class Notification {
    constructor({
                    id,
                    userId,
                    title,
                    message,
                    type,
                    read = false,
                    createdAt
                }) {
        if (!id) throw new Error("Notification must have an ID");

        this.id = id;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type; // info, alert, success, warning
        this.read = read;
        this.createdAt = new Date(createdAt);
    }

    get formattedDate() {
        return this.createdAt.toLocaleDateString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    get severity() {
        switch (this.type) {
            case 'alert':
                return 'danger';
            case 'success':
                return 'success';
            case 'warning':
                return 'warn';
            default:
                return 'info';
        }
    }
}