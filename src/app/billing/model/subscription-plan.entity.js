export default class SubscriptionPlan {
  constructor({ id, name, maxRooms, maxStaffMembers, maxDevices, price, currency }) {
    this.id = id;
    this.name = name;
    this.maxRooms = maxRooms;
    this.maxStaffMembers = maxStaffMembers;
    this.maxDevices = maxDevices;
    this.price = price;
    this.currency = currency;
  }
}
