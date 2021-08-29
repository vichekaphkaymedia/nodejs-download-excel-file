const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const validateUser = require('../validation/UserValidation');
const Joi = require('joi');

const index = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users
    });
});

const show = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user
  });
});


const create = asyncHandler(async (req, res, next) => {
    const {error} = await validateUser(req.body);
    // res.send(validation)
    if(error){
        return res.status(400).send(error.details);
    }
    user = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
});

const update = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: user
  });
});


const destroy = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {}
  });
});


module.exports = {index,show,create,update,destroy}