export class StaffMember {
    constructor(data) {
        this.id = data.id
        this.hotelId = data.hotelId
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.fullName = `${data.firstName} ${data.lastName}`
        this.email = data.email
        this.phone = data.phone
        this.status = data.status
        this.department = data.department
        this.createdAt = new Date(data.createdAt)
        this.status = 'Active'
    }

    get formattedCreatedAt() {
        return this.createdAt.toLocaleDateString()
    }
}