import axios from 'axios'
import { StaffMember } from '../model/request-staff.entity.js'

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1'

export const staffService = {
    async getAllStaffMembers() {
        const response = await axios.get(`${API_URL}/staff-members`)
        return response.data.map(data => new StaffMember(data))
    },

    async getStaffForAssignment() {
        const members = await this.getAllStaffMembers()
        return members.map(member => ({
            id: member.id,
            name: member.fullName,
            role: member.department
        }))
    },

    async deleteStaffMember(id) {
        await axios.delete(`${API_URL}/staff-members/${id}`)
        return true
    },

    async getStaffNames() {
        const response = await this.getAllStaffMembers()
        return response.map(member => ({
            id: member.id,
            name: `${member.firstName} ${member.lastName}`
        }))
    },

    async getStaffMemberById(id) {
        const response = await axios.get(`${API_URL}/staff-members/${id}`);
        return new StaffMember(response.data);
    },

    async getStaffMap() { // Útil para mapear IDs a nombres
        const members = await this.getAllStaffMembers();
        return new Map(members.map(member => [member.id, member.fullName]));
    },

    async createStaffMember(staffData) {
        try {
            const response = await axios.post(`${API_URL}/staff-members`, {
                ...staffData,
                createdAt: new Date().toISOString(),
                status: 'Active'
            });
            return new StaffMember(response.data);
        } catch (error) {
            console.error('Error creating staff member:', error);
            throw error;
        }
    },

    async updateStaffMember(id, staffData) {
        try {
            const response = await axios.put(`${API_URL}/staff-members/${id}`, staffData);
            return new StaffMember(response.data);
        } catch (error) {
            console.error('Error updating staff info', error);
            throw error;
        }
    }
}