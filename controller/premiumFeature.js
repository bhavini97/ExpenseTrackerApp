const expenseService = require("../Service/premiumFeature");

module.exports = {
  getTable: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const userId = req.user.userId;

      const result = await expenseService.getExpenses(userId, page, limit);
      res.json(result);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
  getLeaderboard: async (req, res) => {
    try {
      const leaderboard = await expenseService.getLeaderboard(req.user.userId);
      res.status(200).json({ leaderboard }); // sending the leaderboard data
    } catch (err) {
      res.status(403).json({ message: err.message });
    }
  },

  getUserDetails: async (req, res) => {
    try {
      const userDetails = await expenseService.getUserDetails(req.user.userId);
      res.status(200).json({ message: "User details", ...userDetails });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getDownloadFiles: async(req,res)=>{
    try{
      const downloadedFiles = await expenseService.getDownloadedFiles(req.user.userId);
      console.log(downloadedFiles);
      res.status(200).json({downloads: downloadedFiles });
    }catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
