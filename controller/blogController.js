const Blog = require("../models/blogModel");
const cloudinary = require("cloudinary");
const catchAsyncError = require("./catchAsyncError");
const ApiFeature = require("../utils/apiFeature");
const ErrorHander = require("../utils/errorHanler");

//create new blog-admin
exports.newBlog = catchAsyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "blog",
  });

  req.body.author = req.user._id;
  const { title, shortDescription, content, author } = req.body;

  const blog = await Blog.create({
    title,
    shortDescription,
    content,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    author,
  });

  res.status(200).json({
    success: true,
    blog,
  });
});

//get all blogs
exports.getAllBlog = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;
  const blogCount = await Blog.countDocuments();

  const apiFeature = new ApiFeature(Blog.find(), req.query).pagination(
    resultPerPage
  );
  const blogs = await apiFeature.query;
  res.status(200).json({
    success: true,
    blogs,
    blogCount,
  });
});
//get all blogs no query
exports.getAllBlogNew = catchAsyncError(async (req, res, next) => {
  const blogCount = await Blog.countDocuments();
  const blogs = await Blog.find();
  res.status(200).json({
    success: true,
    blogs,
    blogCount,
  });
});
// get detail blog
exports.getDetailBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new ErrorHander("Blog not found", 404));

  res.status(200).json({
    success: true,
    blog,
  });
});

//update blog-admin
exports.updateBlog = catchAsyncError(async (req, res, next) => {
  const newblogData = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    author: req.user.id,
  };

  const authorBlog = await Blog.findById(req.params.id);

  if (authorBlog.author != req.user.id)
    return next(new ErrorHander("You can not update this blog", 403));

  if (req.body.image) {
    const imageId = authorBlog.image.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "blog",
      width: 150,
      crop: "scale",
    });

    newblogData.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const blog = await Blog.findByIdAndUpdate(req.params.id, newblogData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    blog,
  });
});

//delete blog
exports.deleteBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  const author = req.user.id;

  if (author != blog.author)
    return next(new ErrorHander("You can not delete this blog", 403));
  if (!blog) return next(new ErrorHander("Blog not found", 404));

  const imageId = blog.image.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await blog.remove();

  res.status(200).json({
    success: true,
    message: "Blog Deleted Successfully",
  });
});

//add comment
exports.createComment = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.body.blogId);

  const commnetInfo = {
    content: req.body.content,
    blogId: req.body.blogId,
    parentId: req.body?.parentId || null,
    user: req.user.id,
  };

  if (!blog) return next(new ErrorHander("Blog not found", 404));
  blog.comment.push(commnetInfo);
  blog.numOfComment = blog.comment.length;

  await blog.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//get all Comment of a blog
exports.getAllBlogComment = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.query.id);

  if (!blog) {
    return next(new ErrorHander("Blog not found", 404));
  }
  res.status(200).json({
    success: true,
    comment: blog.comment,
  });
});

//update comment
exports.updateCommnet = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.body.id);
  let comment = blog.comment.find((item) => item._id == req.body.commentId);

  if (!blog) return next(new ErrorHander("Blog not found", 404));
  if (comment) {
    comment.content = req.body.content;
    comment.createdAt = Date.now();
  }

  await blog.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    blog,
  });
});

//delete comment
exports.deleteCommnet = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.query.id);
  if (!blog) return next(new ErrorHander("Blog not found", 404));

  blog.comment = blog.comment.filter(
    (item) =>
      item._id != req.query.commentId && item.parentId != req.query.commentId
  );

  blog.numOfComment = blog.comment.length;

  await blog.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Comment has been deleted",
  });
});
