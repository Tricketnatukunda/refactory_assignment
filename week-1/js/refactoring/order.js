class OrderProcessor {
  constructor(user, items, discountCode, shippingAddress, billingAddress) {
    this.user = user;
    this.items = items;
    this.discountCode = discountCode;
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
  }

  process() {
    // magic number
    const TAX_RATE = 0.07;
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      total += item.price * item.quantity;
    }

    // duplicate code with shipping and billing
    if (this.shippingAddress.country === "US") {
      total += 5; // flat shipping US
    } else {
      total += 15; // flat shipping elsewhere
    }

    if (this.billingAddress.country === "US") {
      total += 5;
    } else {
      total += 15;
    }

    if (this.discountCode) {
      if (this.discountCode === "SUMMER10") {
        total = total * 0.90;
      } else if (this.discountCode === "VIP") {
        total = total * 0.80;
      } else {
        total = total * 0.95;
      }
    }

    const tax = total * TAX_RATE;
    total += tax;

    // inline variable example
    if (this.user.age > 18 && this.user.status === "active" && this.user.country === "US") {
      console.log("Ready to process order for active adult US user");
    }

    // long method continues
    this.saveOrder({
      userId: this.user.id,
      items: this.items,
      discount: this.discountCode,
      shipping: this.shippingAddress,
      billing: this.billingAddress,
      total: total
    });

    this.sendConfirmationEmail(this.user.email, total);

    if (this.items.length > 10) {
      this.applyBulkOrderBonus();
    }

    // more logic for inventory update, audit logging, etc.
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      // magic number again
      if (item.quantity > 100) {
        console.warn("Large quantity order for item:", item.id);
      }
      this.decreaseInventory(item.id, item.quantity);
    }

    this.logAudit(this.user.id, this.items, total);
  }

  saveOrder(orderData) {
    // imagine DB call
    console.log("Saving order data", orderData);
  }

  sendConfirmationEmail(email, amount) {
    console.log(`Sending confirmation email to ${email} for amount $${amount}`);
  }

  applyBulkOrderBonus() {
    console.log("Applying bulk order bonus");
  }

  decreaseInventory(itemId, qty) {
    console.log(`Decreasing inventory for ${itemId} by ${qty}`);
  }

  logAudit(userId, items, amount) {
    console.log(`Audit log: user ${userId}, items ${items.length}, amount ${amount}`);
  }
}

module.exports = OrderProcessor
