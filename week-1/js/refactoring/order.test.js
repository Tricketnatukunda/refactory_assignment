 const OrderProcessor = require('./order');
//const OrderProcessor = require("./order-refactored")

describe('OrderProcessor', () => {
    let user, items, shippingAddress, billingAddress;
    beforeEach(() => {
        user = {
            id: 1,
            age: 25, 
            status: "active",
            country: "US",
            email: 'test@refactory.academy'
        }
        items = [
            { id: "A", price: 10, quantity: 2 }, // total: 20
            { id: "B", price: 5, quantity: 4 }   // total: 20
        ];

        shippingAddress = { country: "US" };
        billingAddress = { country: "US" };
    })

     test("process() calculates total including tax, shipping, and discount", () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

        const processor = new OrderProcessor(
            user,
            items,
            "SUMMER10",
            shippingAddress,
            billingAddress
        );

        processor.process();

        // Can't directly get total, but we can read console logs from saveOrder
        const saveOrderCall = logSpy.mock.calls.find(call =>
        call[0] === "Saving order data"
        );

        expect(saveOrderCall).toBeTruthy();

        const orderData = saveOrderCall[1];

        // Breakdown:
        // Items total = 40
        // Shipping: US ($5) + US ($5) = $10
        // Subtotal = 50
        // SUMMER10 = 10% off → 45
        // Tax = 7% → 48.15

        expect(orderData.total).toBeCloseTo(48.15, 2);

        logSpy.mockRestore();
        warnSpy.mockRestore();
    });

    test("process() applies VIP discount", () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        const processor = new OrderProcessor(
        user,
        items,
        "VIP",
        shippingAddress,
        billingAddress
        );

        processor.process();

        const saveOrderCall = logSpy.mock.calls.find(call =>
        call[0] === "Saving order data"
        );

        const total = saveOrderCall[1].total;

        // Base = 40 + 10 shipping = 50
        // VIP → 20% price (80% discount) → 40
        // Tax 7% → 42.8
        expect(total).toBeCloseTo(42.8, 2);

        logSpy.mockRestore();
    });

     test("process() applies default 5% discount for unknown codes", () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        const processor = new OrderProcessor(
        user,
        items,
        "UNKNOWN",
        shippingAddress,
        billingAddress
        );

        processor.process();

        const total = logSpy.mock.calls.find(call =>
        call[0] === "Saving order data"
        )[1].total;

        // Base = 50
        // Unknown discount = 5% → 47.5
        // Tax → 50.825
        expect(total).toBeCloseTo(50.825, 3);

        logSpy.mockRestore();
    });

    test("logs large quantity warning during inventory update", () => {
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

        items.push({ id: "C", price: 1, quantity: 150 });

        const processor = new OrderProcessor(
        user,
        items,
        null,
        shippingAddress,
        billingAddress
        );

        processor.process();

        expect(warnSpy).toHaveBeenCalledWith(
        "Large quantity order for item:",
        "C"
        );

        warnSpy.mockRestore();
    });

    test("logs confirmation email and audit log", () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        const processor = new OrderProcessor(
        user,
        items,
        null,
        shippingAddress,
        billingAddress
        );

        processor.process();

        expect(
        logSpy.mock.calls.some(call =>
            call[0].includes("Sending confirmation email")
        )
        ).toBe(true);

        expect(
        logSpy.mock.calls.some(call =>
            call[0].includes("Audit log:")
        )
        ).toBe(true);

        logSpy.mockRestore();
    });

    test("bulk order bonus triggers when item count > 10", () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        const bigList = new Array(11).fill({ id: "X", price: 1, quantity: 1 });

        const processor = new OrderProcessor(
        user,
        bigList,
        null,
        shippingAddress,
        billingAddress
        );

        processor.process();

        expect(
        logSpy.mock.calls.some(call =>
            call[0] === "Applying bulk order bonus"
        )
        ).toBe(true);

        logSpy.mockRestore();
    });
});
