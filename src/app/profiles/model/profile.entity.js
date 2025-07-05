export default class Profile {
  constructor({ id, email, role, hotel }) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.hotel = hotel; // Puede ser un objeto hotel o null
  }
}

