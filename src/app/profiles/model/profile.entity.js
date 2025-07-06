export default class Profile {
  constructor({ id, email, role, hotel, firstName, lastName, phone }) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.hotel = hotel; // Puede ser un objeto hotel o null
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
  }
}
