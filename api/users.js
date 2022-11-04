const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const {requireUser} = require('./utils')

const { getAllUsers, getUserByUsername, createUser, getUserById, getPostsByUser, updateUser } = require('../db');

usersRouter.use((req, res, next) => {
    console.log("A request is being made to /users");

    next();
});


//GET ALL USERS//
usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();

    res.send({
        users
    });
});

//LOGIN//
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next ({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUserByUsername(username);

        if (user && user.password == password) {
            const token = jwt.sign({ id: `${user.id}`, username: `${username}` }, process.env.JWT_SECRET);
            res.send({ message: "You are logged in!", token: token });
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});


//REGISTER//
usersRouter.post('/register', async (req, res, next) => {
    const {username, password, name, location} = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            next ({
                name: 'UserExistsError',
                message: 'a user by that username already exists'
            });
        }

        const user = await createUser({
            username,
            password,
            name,
            location,
        });

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            message: "thank you for signing up",
            token
        });
    } catch ({ name, message}) {
        next({ name, message})
    }
});

//GET POSTS BY USER ID//
usersRouter.get('/:userId/posts', async (req, res, next) => {
    const { userId } = req.params;

    try {
        const userInfo = await getUserById(userId)
        
        res.send({
            userInfo,
        })
    } catch ({ name, message }) {
        next ({ name, message })
    }
})


///////EDITING USER INFO
usersRouter.patch('/:userId', requireUser, async (req, res, next) => {
    const { userId } = req.params;
    const { name, location, username } = req.body;

    const updateFields = {};


    if (name) {
        updateFields.name = name;
    }

    if (location) {
        updateFields.location = location;
    }

    if (username) {
        updateFields.username = username;
    }

    try {
        const userInfo = await getUserById(userId);

        if (userInfo.id === req.user.id) {
            const updatedUser = await updateUser(userId, updateFields);
            res.send({user: updatedUser})
        } else {
            next ({
                name: 'UnauthorizedUserError',
                message: 'You cannot update user info that is not yours '
            })
        }
    } catch ({ name, message}) {
        next ({name, message});
    }
});

module.exports = usersRouter;