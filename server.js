const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { mongoose, UserModel, ProductModel, OrderModel } = require('./config.js'); 

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/home.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/client/sign.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/client/login.html');
});

app.get('/checkout', async (req, res) => {
    res.sendFile(__dirname + '/client/checkout.html');
});

app.post('/register', async (req, res) => {
    console.log('Received POST request to /register');
    console.log('Request body:', req.body);
    
    const { firstname, lastname, username, email, password } = req.body;
    const fullName = `${firstname} ${lastname}`;

    try {
        const existingUser = await UserModel.findOne({ $or: [{ email: email }, { username: username }] });
        
        if (existingUser) {
            if (existingUser.email === email) {
                res.json({ message: 'Email is already taken.' });
            } else if (existingUser.username === username) {
                res.json({ message: 'Username is already taken.' });
            }
        } else {
            const userData = await UserModel.create({ fullName, username, email, password });
            console.log('User data saved:', userData);
            res.json({ message: 'User registered successfully.', userData });
        }
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    console.log('Received POST request to /login');
    console.log('Request body:', req.body);
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username: username });
        
        if (!user) {
            return res.status(400).json({ message: 'Username not found' });
        }
        
        if (user.password !== password) {
            return res.status(400).json({ message: 'Incorrect password' });
        }
        
        console.log('Login successful');
        res.json({
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
                firstName: user.fullName.split(' ')[0],
                lastName: user.fullName.split(' ')[1]
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/checkout', async (req, res) => {
    console.log('Received POST request to /checkout');
    console.log('Request body:', req.body);

    const cartContent = req.body.cart;
    const username = req.body.username;
    
    if (!cartContent || !username) {
        return res.status(400).json({ message: 'Cart content or username is missing' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await UserModel.findOne({ username: username }).session(session);
        if(username != "Guest"){
            if (!user) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Cart owner not found' });
            }
        }

        let orderItems = [];
        let order = null
        let orderId = 0
        for (let item of cartContent) {
            let product = await ProductModel.findOne({ name: item.name }).session(session);
            
            if (!product) {
                product = new ProductModel({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    id: item.id
                });
                await product.save({ session });
            }

            orderItems.push({
                name: product.name,
                quantity: product.quantity,
                price: product.price,
                id: product.id
            });
        }

        while(await OrderModel.findOne({ orderId: orderId })){
            orderId++
        }
        order = new OrderModel({
            username: username, 
            orderContents: orderItems,
            orderId: orderId
        });

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({
            message: "Order placed successfully",
            orderId: orderId,
            order: order
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error checking out:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/getOrderContents', async (req, res) => {
    const { username, orderId } = req.query; 

    try {
        const order = await OrderModel.findOne({ username: username, orderId: orderId});
        if (!order) {
            return res.status(400).json({ message: 'Order not found' });
        }

        res.json({ orderContents: order.orderContents });
    } catch (error) {
        console.error('Error fetching order contents:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/getAllUsers', async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

let port = 3000

app.listen(port, () => console.log(`App is listening on port ${port}`));
