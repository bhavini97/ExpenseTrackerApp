const { Order, User, db } = require("../models/centralized");
const cashfreeService = require("../Service/cashfreeService");

/**
 * Create a payment order and return session ID.
 */
async function createPaymentOrder(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const orderId = `ORDER_${Date.now()}`; // Generate unique order ID

  // Getting service id from cashfree services file
  const paymentSessionId = await cashfreeService.createOrder(orderId, userId);
  console.log(paymentSessionId);

  await Order.create({
    order_id: orderId,
    user_id: userId,
    status: "pending",
  });

  return { paymentSessionId, orderId };
}

/**
 * Get payment status and update order/user status accordingly.
 */
async function getPaymentStatus(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const t = await db.transaction(); // Start transaction
  try {
    // Fetching order status from Cashfree service
    const order_status = await cashfreeService.getPaymentStatus(orderId);
    console.log(order_status);

    if (!order_status) {
      throw new Error("Error while retrieving order status from CashfreeService");
    }

    if (order_status !== "PENDING") {
      const order = await Order.findOne({ where: { order_id: orderId } });
      if (!order) {
        throw new Error("Order not found");
      }

      // Update premium status of the user only if order is successful
      if (order_status === "SUCCESS") {
        await User.update({ isPremium: true }, { where: { id: order.user_id } }, { transaction: t });
        console.log(`User ${order.user_id} is now premium`);
      }

      // Update order status in order table
      const [result] = await Order.update({ status: order_status }, { where: { order_id: orderId } }, { transaction: t });

      // Only commit changes when all transactions are successful
      await t.commit();

      if (result > 0) {
        console.log("Order status updated successfully");
      } else {
        throw new Error("Payment successful but encountered error while changing order status in database");
      }

      return { message: "Payment Successful", orderStatus: order_status };
    }

    return { message: "Payment status still pending", orderStatus: order_status };
  } catch (err) {
    await t.rollback(); // Rollback transaction if any error occurs
    throw err;
  }
}

module.exports = { createPaymentOrder, getPaymentStatus };
