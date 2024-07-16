const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  orders,
  updateOrder,
  deleteOrder,
  queueList,
} = require("../controllers/orderController");
const router = express.Router();
const {
  isAuthenticateUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

router.route("/order/new").post(isAuthenticateUser, newOrder);
router.route("/order/:id").get(isAuthenticateUser, getSingleOrder);
router.route("/myorders").get(isAuthenticateUser, myOrders);

///Aditional Code
router.route("/queue/:id").post(queueList);

//Admin Routes
router
  .route("/admin/orders")
  .get(isAuthenticateUser, authorizeRoles("admin"), orders);
router
  .route("/admin/order/:id")
  .put(isAuthenticateUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
