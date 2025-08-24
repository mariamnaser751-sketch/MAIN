// require the eventBus and store from the respective files

// make order:created event listener to log the order created
// console.log the following message: [EVT] order:created #<id of the order> for <customer name who created the order> (<order item> x<qty of the item ordered>)

// make order:paid event listener to log the order paid
// if the order is not found, emit 'error' event with the message "Order not found"
// this event listener should transition the order to "paid" using store.setStatus function
// if the order is already shipped or canceled, emit 'error' event with the message "Invalid transition to paid"
// console.log the following message: [EVT] order:paid #<id of the order>
// emit "order:statusChanged" with the id and status=paid

// make order:packed event listener to log the order packed
// if the order is not found, emit 'error' event with the message "Order not found"
// if the order is not paid, emit 'error' event with the message "Pack requires status=paid"
// this event listener should transition the order to "packed" using store.setStatus function
// console.log the following message: [EVT] order:packed #<id of the order>
// emit "order:statusChanged" with the id and status=packed

// make order:shipped event listener to log the order shipped
// if the order is not found, emit 'error' event with the message "Order not found"
// if the order is not packed, emit 'error' event with the message "Ship requires status=packed"
// this event listener should transition the order to "shipped" using store.setStatus function
// console.log the following message: [EVT] order:shipped #<id of the order>
// emit "order:statusChanged" with the id and status=shipped

// make order:canceled event listener to log the order canceled
// if the order is not found, emit 'error' event with the message "Order not found"
// if the order is already shipped, emit 'error' event with the message "Cannot cancel shipped order"
// this event listener should transition the order to "canceled" using store.setStatus function
// console.log the following message: [EVT] order:canceled #<id of the order> ❌
// emit "order:statusChanged" with the id and status=canceled

// make order:statusChanged event listener to log the order status changed
// console.log the following message: [EVT] statusChanged  #<id of the order> → <status of the order>

// make error event listener to log the error
// console.log the following message: [ERR] <error message>

// Export nothing; requiring this file attaches listeners

module.exports = {};

///////////////////////////////////////////////////////////////////////////////

// listeners.js
const bus = require('./eventBus');
const store = require('./store');

// لما أوردر يتعمل
bus.on("order:created", (order) => {
    console.log(`(listener) Order #${order.id} created for ${order.customer}`);
    bus.emit("order:statusChanged", { id: order.id, status: order.status });
});

// تحديثات الحالات
const { saveOrders } = require('./persistence');
const DB_FILE = 'data/orders.json';

bus.on("order:paid", ({ id }) => {
    const res = store.updateStatus(id, "paid");
    if (!res.ok) return bus.emit("error", new Error(res.error));
    console.log(`(listener) Order #${id} marked as paid`);
    bus.emit("order:statusChanged", { id, status: "paid" });
    saveOrders(store.getAllOrders(), DB_FILE);
});

bus.on("order:packed", ({ id }) => {
    const res = store.updateStatus(id, "packed");
    if (!res.ok) return bus.emit("error", new Error(res.error));
    console.log(`(listener) Order #${id} marked as packed`);
    bus.emit("order:statusChanged", { id, status: "packed" });
    saveOrders(store.getAllOrders(), DB_FILE);
});

bus.on("order:shipped", ({ id }) => {
    const res = store.updateStatus(id, "shipped");
    if (!res.ok) return bus.emit("error", new Error(res.error));
    console.log(`(listener) Order #${id} marked as shipped`);
    bus.emit("order:statusChanged", { id, status: "shipped" });
    saveOrders(store.getAllOrders(), DB_FILE);
});

bus.on("order:canceled", ({ id }) => {
    const res = store.updateStatus(id, "canceled");
    if (!res.ok) return bus.emit("error", new Error(res.error));
    console.log(`(listener) Order #${id} marked as canceled`);
    bus.emit("order:statusChanged", { id, status: "canceled" });
    saveOrders(store.getAllOrders(), DB_FILE);
});

// status changed log
bus.on("order:statusChanged", ({ id, status }) => {
    console.log(`[EVT] statusChanged  #${id} → ${status}`);
});

// errors
bus.on("error", (err) => {
    console.error("(Error)", err.message);
});
