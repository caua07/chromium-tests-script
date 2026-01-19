const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files (HTML forms)
app.use(express.static(__dirname));

// Route for form 1 - redirects to a success page
app.post('/submit', upload.single('file'), (req, res) => {
    console.log('Form 1 submitted:');
    console.log('Text field:', req.body.textfield);
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    // Respond with a redirect (this triggers the bug)
    res.redirect('/success?form=1');
});

// Route for form 2 - redirects to a success page
app.post('/submit2', upload.single('file'), (req, res) => {
    console.log('Form 2 submitted:');
    console.log('Text field:', req.body.textfield);
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    // Respond with a redirect (this triggers the bug - Payload tab disappears)
    res.redirect('/success?form=2');
});

// Route for form 3 - handles blob data and redirects
app.post('/submit3', upload.single('blobdata'), (req, res) => {
    console.log('Form 3 submitted (Blob data):');
    console.log('Text field:', req.body.textfield);
    if (req.file) {
        console.log('Blob received:');
        console.log('  - Original name:', req.file.originalname);
        console.log('  - MIME type:', req.file.mimetype);
        console.log('  - Size:', req.file.size, 'bytes');
        console.log('  - Saved to:', req.file.path);
    } else {
        console.log('Blob: No blob data received');
    }
    
    // Respond with a redirect (this triggers the bug - Payload tab disappears)
    res.redirect('/success?form=3');
});

// Route for form 4 - handles File object data and redirects
app.post('/submit4', upload.single('filedata'), (req, res) => {
    console.log('Form 4 submitted (File object data):');
    console.log('Text field:', req.body.textfield);
    if (req.file) {
        console.log('File received:');
        console.log('  - Original name:', req.file.originalname);
        console.log('  - MIME type:', req.file.mimetype);
        console.log('  - Size:', req.file.size, 'bytes');
        console.log('  - Saved to:', req.file.path);
    } else {
        console.log('File: No file data received');
    }
    
    // Respond with a redirect (this triggers the bug - Payload tab disappears)
    res.redirect('/success?form=4');
});

// Route for form 5 - handles FileList/DataTransfer data and redirects
app.post('/submit5', upload.single('filedata'), (req, res) => {
    console.log('Form 5 submitted (DataTransfer/FileList data):');
    console.log('Text field:', req.body.textfield);
    if (req.file) {
        console.log('File received:');
        console.log('  - Original name:', req.file.originalname);
        console.log('  - MIME type:', req.file.mimetype);
        console.log('  - Size:', req.file.size, 'bytes');
        console.log('  - Saved to:', req.file.path);
    } else {
        console.log('File: No file data received');
    }
    
    // Respond with a redirect (this triggers the bug - Payload tab disappears)
    res.redirect('/success?form=5');
});

// Route for form 6 - handles blob data but does NOT redirect (for comparison)
app.post('/submit6', upload.single('blobdata'), (req, res) => {
    console.log('Form 6 submitted (Blob data - NO REDIRECT):');
    console.log('Text field:', req.body.textfield);
    if (req.file) {
        console.log('Blob received:');
        console.log('  - Original name:', req.file.originalname);
        console.log('  - MIME type:', req.file.mimetype);
        console.log('  - Size:', req.file.size, 'bytes');
        console.log('  - Saved to:', req.file.path);
    } else {
        console.log('Blob: No blob data received');
    }
    
    // Respond with JSON (NO REDIRECT - Payload tab should be visible)
    res.json({
        success: true,
        form: 6,
        message: 'Blob data received successfully (no redirect)',
        data: {
            textfield: req.body.textfield,
            blob: req.file ? {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            } : null
        }
    });
});

// Route for form 7 - handles File object data but does NOT redirect (for comparison)
app.post('/submit7', upload.single('filedata'), (req, res) => {
    console.log('Form 7 submitted (File object data - NO REDIRECT):');
    console.log('Text field:', req.body.textfield);
    if (req.file) {
        console.log('File received:');
        console.log('  - Original name:', req.file.originalname);
        console.log('  - MIME type:', req.file.mimetype);
        console.log('  - Size:', req.file.size, 'bytes');
        console.log('  - Saved to:', req.file.path);
    } else {
        console.log('File: No file data received');
    }
    
    // Respond with JSON (NO REDIRECT - Payload tab should be visible)
    res.json({
        success: true,
        form: 7,
        message: 'File data received successfully (no redirect)',
        data: {
            textfield: req.body.textfield,
            file: req.file ? {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            } : null
        }
    });
});

// Route for form 8 - handles blob data via navigation POST and redirects
app.post('/submit8', upload.single('blobdata'), (req, res) => {
    console.log('Form 8 submitted (Blob data - Navigation POST):');
    console.log('Text field:', req.body.textfield);
    if (req.file) {
        console.log('Blob received:');
        console.log('  - Original name:', req.file.originalname);
        console.log('  - MIME type:', req.file.mimetype);
        console.log('  - Size:', req.file.size, 'bytes');
        console.log('  - Saved to:', req.file.path);
    } else {
        console.log('Blob: No blob data received');
    }
    
    // Respond with a redirect (this triggers the bug - Payload tab disappears)
    // This is a navigation POST request, so redirect happens in same request/response
    res.redirect('/success?form=8');
});

// Route for form 9 - handles File object data via navigation POST and redirects
app.post('/submit9', upload.single('filedata'), (req, res) => {
    console.log('Form 9 submitted (File object data - Navigation POST):');
    console.log('Text field:', req.body.textfield);
    if (req.file) {
        console.log('File received:');
        console.log('  - Original name:', req.file.originalname);
        console.log('  - MIME type:', req.file.mimetype);
        console.log('  - Size:', req.file.size, 'bytes');
        console.log('  - Saved to:', req.file.path);
    } else {
        console.log('File: No file data received');
    }
    
    // Respond with a redirect (this triggers the bug - Payload tab disappears)
    // This is a navigation POST request, so redirect happens in same request/response
    res.redirect('/success?form=9');
});

// Success page
app.get('/success', (req, res) => {
    const formNum = req.query.form || 'unknown';
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Success</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 50px auto;
                    padding: 20px;
                    text-align: center;
                }
                .success {
                    background: #d4edda;
                    border: 1px solid #c3e6cb;
                    padding: 20px;
                    border-radius: 8px;
                    color: #155724;
                }
                a {
                    color: #007bff;
                    text-decoration: none;
                    margin: 0 10px;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="success">
                <h1>✅ Form ${formNum} Submitted Successfully!</h1>
                <p>The server received your data and responded with a redirect.</p>
                <p><strong>Check DevTools Network tab:</strong> The Payload tab should be missing or incomplete!</p>
            </div>
            <p>
                <a href="/form.html">Test Form 1</a> | 
                <a href="/form2.html">Test Form 2</a> |
                <a href="/form3.html">Test Form 3 (Blob)</a> |
                <a href="/form4.html">Test Form 4 (File)</a> |
                <a href="/form5.html">Test Form 5 (DataTransfer)</a> |
                <a href="/form6.html">Test Form 6 (Blob - No Redirect)</a> |
                <a href="/form7.html">Test Form 7 (File - No Redirect)</a> |
                <a href="/form8.html">Test Form 8 (Blob - Nav POST)</a> |
                <a href="/form9.html">Test Form 9 (File - Nav POST)</a>
            </p>
        </body>
        </html>
    `);
});

// Root route - redirect to form 1
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Chrome DevTools Bug Test</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                }
                .card {
                    background: #f5f5f5;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                }
                a {
                    display: inline-block;
                    background: #007bff;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 4px;
                    margin: 5px;
                }
                a:hover {
                    background: #0056b3;
                }
                h2 {
                    color: #333;
                }
            </style>
        </head>
        <body>
            <h1>Chrome DevTools Bug Reproduction</h1>
            <p>This test reproduces a Chrome DevTools bug where the Payload tab is missing or incomplete when:</p>
            <ul>
                <li>Form has <code>enctype="multipart/form-data"</code></li>
                <li>Form has a file input and a file is selected</li>
                <li>Server responds with a redirect</li>
            </ul>
            
            <div class="card">
                <h2>Form 1</h2>
                <p>Payload tab shows Query String Parameters but not the actual payload</p>
                <a href="/form.html">Test Form 1</a>
            </div>
            
            <div class="card">
                <h2>Form 2</h2>
                <p>Payload tab is MISSING ENTIRELY</p>
                <a href="/form2.html">Test Form 2</a>
            </div>
            
            <div class="card">
                <h2>Form 3 (Blob Data)</h2>
                <p>Tests with blob data sent via FormData (not file input)</p>
                <a href="/form3.html">Test Form 3</a>
            </div>
            
            <div class="card">
                <h2>Form 4 (File Object)</h2>
                <p>Tests with File object (extends Blob) sent via FormData</p>
                <a href="/form4.html">Test Form 4</a>
            </div>
            
            <div class="card">
                <h2>Form 5 (DataTransfer/FileList)</h2>
                <p>Tests with FileList created via DataTransfer API and set on file input</p>
                <a href="/form5.html">Test Form 5</a>
            </div>
            
            <div class="card" style="border: 2px solid #28a745;">
                <h2>Form 6 (Blob - No Redirect) ✅</h2>
                <p>Tests with blob data but NO redirect - Payload tab should be visible</p>
                <a href="/form6.html">Test Form 6</a>
            </div>
            
            <div class="card" style="border: 2px solid #28a745;">
                <h2>Form 7 (File - No Redirect) ✅</h2>
                <p>Tests with File object but NO redirect - Payload tab should be visible</p>
                <a href="/form7.html">Test Form 7</a>
            </div>
            
            <div class="card" style="border: 2px solid #dc3545;">
                <h2>Form 8 (Blob - Navigation POST) 🚀</h2>
                <p>Navigation POST request (not fetch/XHR) - sends data and redirects in same request</p>
                <a href="/form8.html">Test Form 8</a>
            </div>
            
            <div class="card" style="border: 2px solid #dc3545;">
                <h2>Form 9 (File - Navigation POST) 🚀</h2>
                <p>Navigation POST request (not fetch/XHR) - sends data and redirects in same request</p>
                <a href="/form9.html">Test Form 9</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`\nTest pages (WITH REDIRECT - triggers bug):`);
    console.log(`  Form 1: http://localhost:${PORT}/form.html`);
    console.log(`  Form 2: http://localhost:${PORT}/form2.html`);
    console.log(`  Form 3 (Blob - fetch/XHR): http://localhost:${PORT}/form3.html`);
    console.log(`  Form 4 (File - fetch/XHR): http://localhost:${PORT}/form4.html`);
    console.log(`  Form 5 (DataTransfer - fetch/XHR): http://localhost:${PORT}/form5.html`);
    console.log(`  Form 8 (Blob - Navigation POST): http://localhost:${PORT}/form8.html`);
    console.log(`  Form 9 (File - Navigation POST): http://localhost:${PORT}/form9.html`);
    console.log(`\nTest pages (NO REDIRECT - for comparison):`);
    console.log(`  Form 6 (Blob - No Redirect): http://localhost:${PORT}/form6.html`);
    console.log(`  Form 7 (File - No Redirect): http://localhost:${PORT}/form7.html`);
    console.log(`\nMake sure to:`);
    console.log(`  1. Open Chrome DevTools`);
    console.log(`  2. Go to Network tab`);
    console.log(`  3. Clear the network log`);
    console.log(`  4. Submit a form with a file`);
    console.log(`  5. Check the Payload tab - it should be missing or incomplete!`);
});
