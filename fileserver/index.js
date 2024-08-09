const express = require('express')
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
app.use(cors())

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');//dirname optional
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
    //required if wanted to save file
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    //controll name accordingly
    filename: (req, file, cb) => {
        // cb(null, file.originalname) //store as it is
        const pathfile = path.join('uploads', file.originalname)
        
        if (fs.existsSync(pathfile)) {
            console.log("error");
            cb(new Error("file already present"), false)
        } else {
            console.log("Added");
            cb(null, file.originalname)
        }
    }
})

// Define file filter function
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = /jpeg|jpg|png/;
    // Check the file extension
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // Check the MIME type
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .jpeg and .png files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    //required if wanted to filter files
    fileFilter: fileFilter
})

//start point
app.get("/", (req, res)=>{
    res.send("<h1>Hello from multer.</h1>use /upload POST for upload<br>use /uploads/filename  GET for getting files")
})

//upload end point
app.post('/upload', upload.single('file'), (req, res)=>{
    res.json({
        message: 'File uploaded successfully',
        fileUrl: `http://localhost:5000/uploads/${req.file.filename}`
      });
})

// Serve the uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//test endpoint
app.post('/test', (req, res)=>{
    console.log(req.body)
    res.json({
        message: "test complete"
    })
})

app.listen(5000, () => {
    console.log(`Server is running on port http://localhost:5000`);
});