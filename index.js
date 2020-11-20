const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const fs = require('fs/promises');
const path = require('path');
const fileupload = require("express-fileupload");


const __rootdir = process.env.ROOT_DIR ? process.env.ROOT_DIR : "D:/root"

app = express();

app.use(fileupload());
app.use(cors());

const port = 3333;

app.get('/', async (req, res) => {
    let result = [];
    const pathaux = req.query.path ? req.query.path : ""
    const dir = await fs.readdir(path.resolve(__rootdir, pathaux));
    const promises = dir.map(async file => {
        const stats = await fs.lstat(path.resolve(__rootdir, file))
        return {
            type: stats.isDirectory() ? 'folder' : 'file',
            name: file,
            id: uuid.v4(),
        }
    })

    result = await Promise.all(promises);
    
    res.json(result);
});


app.post('/', async (req, res) => {
    try {
        const file = req.files.file;
        let pathaux = req.query.path ? req.query.path : "";
        pathaux = path.resolve(__rootdir, pathaux, file.name);
        await fs.writeFile(pathaux, file.data)
        res.status(200).send('OK')
    } catch (error) {
        res.status(400).send()            
    }
})

app.listen(port, () => {
    console.log('Listening on ' + port);
});