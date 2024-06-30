const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://tootoopaz:21002100TgHy@cluster0.gofgudu.mongodb.net/', {
}).then(() => {
    console.log("Database connected successfully");
}).catch((error) => {
    console.error("Couldn't connect to database", error);
});

const userSchema = new mongoose.Schema({
    fullName: String,
    username: String,
    email: String,
    password: String
});

const productSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    id: Number
});

const orderSchema = new mongoose.Schema({
    username: String,
    orderContents: [productSchema],
    orderId: Number
});
const UserModel = mongoose.model('User', userSchema);
const ProductModel = mongoose.model('Product', productSchema);
const OrderModel = mongoose.model('Order', orderSchema);

module.exports = {
    mongoose,
    UserModel,
    ProductModel,
    OrderModel
};
