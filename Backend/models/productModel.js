const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  iframetext: {
    type: String,
    // required: [true, "Please Enter iframetext"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 10 characters"],
  },
  enginehealthDescription: {
    type: String,
    // required: [true, "Please Enter Engine Health Text"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 10 characters"],
  },
  electricalhealthDescription: {
    type: String,
    // required: [true, "Please Enter Electrical health Text"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 10 characters"],
  },

  mechanicalchasishealthDescription: {
    type: String,
    // required: [true, "Please Enter Mechanical and Chassis Health"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 10 characters"],
  },
  paintfaringhealthDescription: {
    type: String,
    required: [true, "Please Enter paint and Fairing Health"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 10 characters"],
  },
  tyreDescription: {
    type: String,
    required: [true, "Please Enter Tyre health Text"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 10 characters"],
  },

  bikename: {
    type: String,
    required: [true, "Please Enter Bike Name"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 10 characters"],
  },

  bikekm: {
    type: Number,
    required: true,
    default: 0.0,
    trim: true,
    // maxLength: [4, "BikE Kilometer only 1 lakh"],
  },

  // biketype: {
  //   type: String,
  //   required: [true, "Please Enter Bike Type"],
  //   trim: true,
  //   maxLength: [100, "Product name cannot exceed 10 characters"],
  // },

  bikeyear: {
    type: Number,
    required: true,
    default: 0.0,
  },

  bikeemmision: {
    type: String,
    required: [true, "Please Enter Emmision Type"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 8 characters"],
  },

  bikedescription: {
    type: String,
    required: [true, "Please Enter Bike Description"],
    trim: true,
  },

  bikebrand: {
    type: String,
    required: [true, "Please Enter Bike Description"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 15 characters"],
  },

  bikemodel: {
    type: String,
    required: [true, "Please Enter Bike Model"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 12 characters"],
  },

  bikeinsurance: {
    type: String,
    required: [true, "Please Enter Bike Insurance"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 7 characters"],
  },

  bikeownership: {
    type: String,
    required: [true, "Please Enter Bike Ownership"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 11 characters"],
  },

  // bikeprice: {
  //   type: Number,
  //   required: true,
  //   default: 0.0,
  // },

  bikelocation: {
    type: String,
    required: [true, "Please Enter Loaction"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 30 characters"],
  },

  enginehealth: {
    type: Number,
    required: true,
    default: 0.0,
  },
  electricalhealth: {
    type: Number,
    required: true,
    default: 0.0,
  },
  mechanicalchasishealth: {
    type: Number,
    required: true,
    default: 0.0,
  },
  paintfaringhealth: {
    type: Number,
    required: true,
    default: 0.0,
  },
  tyre: {
    type: Number,
    required: true,
    default: 0.0,
  },

  power: {
    type: String,
    required: [true, "Please Enter Bike Power"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 100 characters"],
  },
  torque: {
    type: String,
    required: [true, "Please Enter Bike Torque"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 101 characters"],
  },
  mileage: {
    type: String,
    required: [true, "Please Enter Bike Mileage"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 102 characters"],
  },

  bikebookingdetails: {
    type: String,
    // required: [true, "Please Enter Bike Booking Deatils"],
    trim: true,
    // maxLength: [100, "Product name cannot exceed 20 characters"],
  },

  bikesellrequest: {
    type: String,
    // required: [true, "Please Enter Bike Sell Request"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 20 characters"],
  },

  shippinginfo: {
    type: String,
    // required: [true, "Please Enter Shipping Location"],
    trim: true,
  },

  //--------------------Original Code

  name: {
    type: String,
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },

  price: {
    type: Number,
    required: true,
    default: 0.0,
  },

  description: {
    type: String,
    // required: [true, "Please Enter Product Description"],
  },

  ratings: {
    type: String,
    default: 0,
  },

  images: [
    {
      image: {
        type: String,
        required: [true, "Please Upload Bike Images"],
      },
    },
  ],

  videos: [
    {
      video: {
        type: String,
        // required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [true, "Please enter category name"],
    enum: {
      values: [
        "Bajaj",
        "Hero",
        "KTM",
        "TVS",
        "Royal Enfield",
        "Yamaha",
        "Susuzki",
        "Honda",
        "Mahindra",
      ],
      message: "Please select correct category",
    },
  },

  biketype: {
    type: String,
    required: [true, "Please enter Typeof name"],
    enum: {
      values: ["Petrol", "Electric", "Diesel"],
      message: "Please select correct Type of Fuel ",
    },
  },

  bikeCCtypecategories: {
    type: String,
    required: [true, "Please enter Bike Cubic Centimeter"],
    enum: {
      values: ["100cc-160cc", "160cc-200cc", "200cc-400cc", "Above 400cc"],
      message: "Please select correct Type of CC ",
    },
  },

  // bikeCCtypecategories: {
  //   type: String,
  //   required: [true, "Please Enter Bike Cubic Centimeter"],
  //   enum: {
  //     values: ["100cc-160cc", "160cc-200cc", "200cc-400cc"],
  //     message: "Please select correct Type of CC ",
  //   },
  // },

  seller: {
    type: String,
    // required: [true, "Please enter product seller"],
  },

  stock: {
    type: Number,
    // required: [true, "please enter product stock"],
    maxLength: [20, "product stock cannot exceed 20"],
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  // reviews: [
  //   {
  //     user: mongoose.Schema.Types.ObjectId,
  //     rating: {
  //       type: String,
  //       required: true,
  //     },
  //     comment: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

let schema = mongoose.model("Product", productSchema);

module.exports = schema;
