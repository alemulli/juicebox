const express = require('express');
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    next();
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;
    console.log(tagName, "this is the tagname")

    try {
        const posts = await getPostsByTagName(tagName)
        console.log(posts)
        res.send({
            posts
        })
    } catch ({ name, message }) {
        next ({ name, message })
    }
})

module.exports = tagsRouter;