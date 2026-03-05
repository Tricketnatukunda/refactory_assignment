// centralise constants and remove magic numbers
const TAX_RATE = 0.07;
const US_SHIPPING_COST = 5;
const INTL_SHIPPING_COST = 15;
const LARGE_ORDER_QTY_THRESHOLD = 100;


class OrderProcessor {
  constructor(user, items, discountCode, shippingAddress, billingAddress) {
    this.user = user;
    this.items = items;
    this.discountCode = discountCode;
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
  }

  process() {
    const itemsTotal = this.calculateItemsTotal();
    const shippingTotal = this.calculateShippingCosts();
    const discountedTotal = this.applyDiscount(itemsTotal + shippingTotal);
    const finalTotal = this.applyTax(discountedTotal);

    this.debugEligibleUsers();
    this.saveOrder(this.buildOrderPayload(finalTotal));
    this.sendConfirmationEmail(this.user.email, finalTotal);
    this.handleBulkOrder();
    this.updateInventory();
    this.logAudit(this.user.id, this.items, finalTotal);
  }

  calculateItemsTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  calculateShippingCosts() {
    return (
      this.getShippingCostForAddress(this.shippingAddress) +
      this.getShippingCostForAddress(this.billingAddress)
    );
  }

  getShippingCostForAddress(address) {
    return address.country === "US"
      ? US_SHIPPING_COST
      : INTL_SHIPPING_COST;
  }

  applyDiscount(total) {
    const discountRates = {
      SUMMER10: 0.9,
      VIP: 0.8,
    };

    if (!this.discountCode) return total;

    return total * (discountRates[this.discountCode] || 0.95);
  }

  applyTax(total) {
    return total + total * TAX_RATE;
  }

  debugEligibleUsers() {
    const isAdult = this.user.age > 18;
    const isActive = this.user.status === "active";
    const isUSUser = this.user.country === "US";

    if (isAdult && isActive && isUSUser) {
      console.log("Ready to process order for eligible US user");
    }
  }

  buildOrderPayload(total) {
    return {
      userId: this.user.id,
      items: this.items,
      discount: this.discountCode,
      shipping: this.shippingAddress,
      billing: this.billingAddress,
      total,
    };
  }

  handleBulkOrder() {
    if (this.items.length > 10) {
      console.log("Applying bulk order bonus");
    }
  }

  updateInventory() {
    this.items.forEach((item) => {
      if (item.quantity > LARGE_ORDER_QTY_THRESHOLD) {
        console.warn("Large quantity order for item:", item.id);
      }
      this.decreaseInventory(item.id, item.quantity);
    });
  }

  saveOrder(orderData) {
    console.log("Saving order data", orderData);
  }

  sendConfirmationEmail(email, amount) {
    console.log(`Sending confirmation email to ${email} for amount $${amount}`);
  }

  decreaseInventory(itemId, qty) {
    console.log(`Decreasing inventory for ${itemId} by ${qty}`);
  }

  logAudit(userId, items, amount) {
    console.log(`Audit log: user ${userId}, items ${items.length}, amount ${amount}`);
  }
}

module.exports = OrderProcessor
