const Product = require("../models/productModel");
const ApiFeature = require("../utils/apiFeature");
const ErrorHander = require("../utils/errorHanler");
const catchAsyncError = require("./catchAsyncError");
const cloudinary = require("cloudinary");

//create product
exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  console.log(req.body);
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//get all products no query
exports.getAllProductsNew = catchAsyncError(async (req, res, next) => {
  const productCount = await Product.countDocuments();
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .category()
    .pagination(resultPerPage);
  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});

//get all category
exports.getCategory = catchAsyncError(async (req, res, next) => {
  let category = await Product.find({}).select("category");

  category = [...new Set(category.map((item) => item.category))];
  // console.log(Array.from(new Set([1, 2, 3, 1])));

  return res.status(200).json({
    success: true,
    category,
  });
});

//get product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  } else {
    res.status(200).json({
      success: true,
      product,
    });
  }
});

//update product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//delete Product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// create new review or update review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId, userId, userName } = req.body;

  const reviews = {
    user: userId,
    name: userName,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }
  const isReviewed = product.reviews.find(
    (x) => x.user.toString() === userId.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === userId.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(reviews);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
//  update review
exports.updateProductReview = catchAsyncError(async (req, res) => {
  try {
    const { ratings, productId } = req.body;
    if (ratings && ratings !== 0) {
      const product = await Product.findById(productId);
      if (!product)
        return res.status(400).json({ msg: "Product does not exist." });

      let num = product.numOfReviews;
      let rate = product.ratings;

      await Product.findOneAndUpdate(
        { _id: productId },
        {
          ratings: rate + ratings,
          numOfReviews: num + 1,
        }
      );

      res.json({ msg: "Update success" });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
//get all Reviews of a product
exports.getAllProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id).sort({ createdAt: -1 });

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete product Review
exports.deleteReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
      },
      {
        new: true,
        validator: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
    });
  } else {
    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        validator: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  }
});
