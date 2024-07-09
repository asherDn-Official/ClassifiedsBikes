const { default: mongoose } = require("mongoose");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
//Create New Order - api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

//Get Single Order - api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(
      new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Get Loggedin User Orders - /api/v1/myorders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//Admin: Get All Orders - api/v1/orders
exports.orders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//Admin: Update Order / Order Status - api/v1/order/:id
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("Order has been already delivered!", 400));
  }
  //Updating the product stock of each order item
  order.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem.product, orderItem.quantity);
  });

  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  product.save({ validateBeforeSave: false });
}

//Admin: Delete Order - api/v1/order/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404)
    );
  }

  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});

//Queue List

// exports.queueList = catchAsyncError(async (req, res, next) => {
//   const queueData = await Order.find({ orderStatus: "Test Ride Booking" });
//   if (!queueData) {
//     return next(new ErrorHandler(`Order not found ${req.params.id}`, 404));
//   }

//   // let queueResonse = await queueData.some({Order.orderItems.product: req.params.id})

//   let queueAddData = [];
//   let checkElement = new mongoose.Types.ObjectId(req.params.id);

//   console.log("Id", checkElement);
//   queueData.forEach((order) => {
//     console.log("Productt", order.orderItems[0].product);
//     let foundData = order.orderItems.find(
//       (item) => item.product.equals(req.params.id)
//       //  String(item.product) === String(checkElement)
//     );
//     console.log("foundData", foundData);
//     if (foundData) {
//       queueAddData.push(order.orderItems.product);
//     }
//   });
//   console.log("queueAddData", queueAddData);
//   res.status(200).json({
//     success: true,
//   });
// });

exports.queueList = catchAsyncError(async (req, res, next) => {
  const requestedProductId = new mongoose.Types.ObjectId(req.params.id);
  const queueData = await Order.aggregate([
    {
      $match: {
        orderStatus: "Test Ride Booking",
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $match: {
        "orderItems.product": requestedProductId,
      },
    },
    {
      $group: {
        _id: "$_id",
        shippingInfo: { $first: "$shippingInfo" },
        user: { $first: "$user" },
        orderItems: { $push: "$orderItems" },
        itemsPrice: { $first: "$itemsPrice" },
        taxPrice: { $first: "$taxPrice" },
        shippingPrice: { $first: "$shippingPrice" },
        totalPrice: { $first: "$totalPrice" },
        paymentInfo: { $first: "$paymentInfo" },
        paidAt: { $first: "$paidAt" },
        deliveredAt: { $first: "$deliveredAt" },
        orderStatus: { $first: "$orderStatus" },
        createdAt: { $first: "$createdAt" },
      },
    },
  ]);
  if (!queueData || queueData.length === 0) {
    return next(new ErrorHandler(`Orders not found`, 404));
  }

  // console.log(queueData.length);
  res.status(200).json({
    success: true,
    length: queueData.length,
  });
});
