const paymentService = require("../Service/paymentService");

module.exports = {
  postPaymentOrder: async (req, res) => {
    try {
      const { paymentSessionId, orderId } = await paymentService.createPaymentOrder(req.user.userId);
      res.status(200).json({ paymentSessionId, orderId });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getPaymentStatus: async (req, res) => {
    try {
      const response = await paymentService.getPaymentStatus(req.params.orderId);
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
