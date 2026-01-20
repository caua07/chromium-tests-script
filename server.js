const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve static files (HTML forms)
app.use(express.static(__dirname));

// Form 1: kData only - Renderer Process (fetch/XHR)
// Uses multer.none() to parse multipart/form-data without files
app.post('/submit1', multer().none(), (req, res) => {
    console.log('Form 1 submitted (kData only - Renderer/fetch/XHR):');
    console.log('Text field:', req.body.textfield);
    
    // Respond with a redirect (this triggers the bug)
    res.redirect('/success?form=1');
});

// Form 2: kData only - Browser Process (Navigation POST)
// Uses multer.none() to parse multipart/form-data without files
app.post('/submit2', multer().none(), (req, res) => {
    console.log('Form 2 submitted (kData only - Browser/Navigation POST):');
    console.log('Text field:', req.body.textfield);
    
    // Respond with a redirect (this triggers the bug)
    res.redirect('/success?form=2');
});

// Form 3: kData + kFile - Renderer Process (fetch/XHR)
app.post('/submit3', upload.single('file'), (req, res) => {
    console.log('Form 3 submitted (kData + kFile - Renderer/fetch/XHR):');
    console.log('Text field:', req.body.textfield);
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    // Respond with a redirect (this triggers the bug)
    res.redirect('/success?form=3');
});

// Form 4: kData + kFile - Browser Process (Navigation POST)
app.post('/submit4', upload.single('file'), (req, res) => {
    console.log('Form 4 submitted (kData + kFile - Browser/Navigation POST):');
    console.log('Text field:', req.body.textfield);
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    // Respond with a redirect (this triggers the bug)
    res.redirect('/success?form=4');
});

// Form 5: kData + kFile + Blob - Renderer Process (fetch/XHR)
app.post('/submit5', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'blobdata', maxCount: 1 }
]), (req, res) => {
    console.log('Form 5 submitted (kData + kFile + Blob - Renderer/fetch/XHR):');
    console.log('Text field:', req.body.textfield);
    console.log('File:', req.files['file'] ? req.files['file'][0].originalname : 'No file');
    console.log('Blob:', req.files['blobdata'] ? req.files['blobdata'][0].originalname : 'No blob');
    
    // Respond with a redirect (this triggers the bug)
    res.redirect('/success?form=5');
});

// Form 6: kData + kFile + Blob - Browser Process (Navigation POST)
app.post('/submit6', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'blobdata', maxCount: 1 }
]), (req, res) => {
    console.log('Form 6 submitted (kData + kFile + Blob - Browser/Navigation POST):');
    console.log('Text field:', req.body.textfield);
    console.log('File:', req.files['file'] ? req.files['file'][0].originalname : 'No file');
    console.log('Blob:', req.files['blobdata'] ? req.files['blobdata'][0].originalname : 'No blob');
    
    // Respond with a redirect (this triggers the bug)
    res.redirect('/success?form=6');
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
                <a href="/form1.html">Form 1</a> | 
                <a href="/form2.html">Form 2</a> |
                <a href="/form3.html">Form 3</a> |
                <a href="/form4.html">Form 4</a> |
                <a href="/form5.html">Form 5</a> |
                <a href="/form6.html">Form 6</a>
            </p>
        </body>
        </html>
    `);
});

// Root route
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Chrome DevTools Bug Test</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 900px;
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
                .renderer {
                    border-left: 4px solid #ffc107;
                }
                .browser {
                    border-left: 4px solid #28a745;
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
                    margin-top: 0;
                }
                .badge {
                    display: inline-block;
                    padding: 3px 8px;
                    border-radius: 3px;
                    font-size: 12px;
                    font-weight: bold;
                    margin-left: 10px;
                }
                .badge-renderer {
                    background: #ffc107;
                    color: #000;
                }
                .badge-browser {
                    background: #28a745;
                    color: #fff;
                }
            </style>
        </head>
        <body>
            <h1>Chrome DevTools Bug Reproduction</h1>
            <p>This test reproduces a Chrome DevTools bug where the Payload tab is missing or incomplete when:</p>
            <ul>
                <li>Form has <code>enctype="multipart/form-data"</code></li>
                <li>Form sends file/blob data</li>
                <li>Server responds with a redirect</li>
            </ul>
            <p><strong>Key Difference:</strong> Navigation POST requests are observed by the browser process, while fetch/XHR requests are handled in the renderer process.</p>
            
            <h2>kData Only (Text Data)</h2>
            <div class="card renderer">
                <h2>Form 1: kData Only - Renderer Process <span class="badge badge-renderer">fetch/XHR</span></h2>
                <p>Sends only text data via fetch(). Redirect handled in renderer process as separate GET request.</p>
                <a href="/form1.html">Test Form 1</a>
            </div>
            
            <div class="card browser">
                <h2>Form 2: kData Only - Browser Process <span class="badge badge-browser">Navigation POST</span></h2>
                <p>Sends only text data via normal form submission. Observed by browser process, redirect in same request/response.</p>
                <a href="/form2.html">Test Form 2</a>
            </div>
            
            <h2>kData + kFile (Text + File Input)</h2>
            <div class="card renderer">
                <h2>Form 3: kData + kFile - Renderer Process <span class="badge badge-renderer">fetch/XHR</span></h2>
                <p>Sends text data + file input via fetch(). Redirect handled in renderer process as separate GET request.</p>
                <a href="/form3.html">Test Form 3</a>
            </div>
            
            <div class="card browser">
                <h2>Form 4: kData + kFile - Browser Process <span class="badge badge-browser">Navigation POST</span></h2>
                <p>Sends text data + file input via normal form submission. Observed by browser process, redirect in same request/response.</p>
                <a href="/form4.html">Test Form 4</a>
            </div>
            
            <h2>kData + kFile + Blob (Text + File Input + Blob)</h2>
            <div class="card renderer">
                <h2>Form 5: kData + kFile + Blob - Renderer Process <span class="badge badge-renderer">fetch/XHR</span></h2>
                <p>Sends text data + file input + blob data via fetch(). Redirect handled in renderer process as separate GET request.</p>
                <a href="/form5.html">Test Form 5</a>
            </div>
            
            <div class="card browser">
                <h2>Form 6: kData + kFile + Blob - Browser Process <span class="badge badge-browser">Navigation POST</span></h2>
                <p>Sends text data + file input + blob data via normal form submission. Observed by browser process, redirect in same request/response.</p>
                <a href="/form6.html">Test Form 6</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`\nForms (Renderer Process - fetch/XHR):`);
    console.log(`  Form 1 (kData only): http://localhost:${PORT}/form1.html`);
    console.log(`  Form 3 (kData + kFile): http://localhost:${PORT}/form3.html`);
    console.log(`  Form 5 (kData + kFile + Blob): http://localhost:${PORT}/form5.html`);
    console.log(`\nForms (Browser Process - Navigation POST):`);
    console.log(`  Form 2 (kData only): http://localhost:${PORT}/form2.html`);
    console.log(`  Form 4 (kData + kFile): http://localhost:${PORT}/form4.html`);
    console.log(`  Form 6 (kData + kFile + Blob): http://localhost:${PORT}/form6.html`);
    console.log(`\nMake sure to:`);
    console.log(`  1. Open Chrome DevTools`);
    console.log(`  2. Go to Network tab`);
    console.log(`  3. Clear the network log`);
    console.log(`  4. Submit a form`);
    console.log(`  5. Check the Payload tab - it should be missing or incomplete!`);
});
