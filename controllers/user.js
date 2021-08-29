const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const validateUser = require('../validation/UserValidation');
const excel = require("exceljs")

const index = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        data: users
    });
});

const downloadExcel = asyncHandler(async (req, res, next) => {
    const workbook = new excel.Workbook()
    const worksheet = workbook.addWorksheet('users')
    let users = await User.find().lean();
    users = users.map((user, index) => {
        user.id = ++index
        return user
    })

    worksheet.columns = [
        {header: "ID", key: "id", width: 5},
        {header: "Username", key: "username", width: 20},
        {header: "First Name", key: "firstName", width: 20},
        {header: "Last Name", key: "lastName", width: 20},
        {header: "Email", key: "email", width: 30},
        {header: "Password", key: "password", width: 20},
    ]

    worksheet.addRows(users)

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "users.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
})

const show = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new errorResponse('404 Not Found', 404));
    }
    res.status(200).json({
        success: true,
        data: user
    });
});


const create = asyncHandler(async (req, res, next) => {
    const {error} = await validateUser(req.body);
    // res.send(validation)
    if (error) {
        return res.status(400).send(error.details);
    }
    const user = await User.create(req.body);
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
    if (!user) {
        return next(new errorResponse('404 Not Found', 404));
    }
    res.status(200).json({
        success: true,
        data: user
    });
});


const destroy = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new errorResponse('404 Not Found', 404));
    }
    res.status(204).send();
});


module.exports = {index, show, create, update, destroy, downloadExcel}