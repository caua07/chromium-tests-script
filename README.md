# Chrome DevTools Bug Reproduction

This project reproduces a critical Chrome DevTools bug where the Payload tab is missing or incomplete when:
- Form has `enctype="multipart/form-data"`
- Form sends file/blob data
- Server responds with a redirect

## Key Concept: Browser Process vs Renderer Process

Chrome DevTools handles network requests differently depending on how they are initiated:

### Browser Process (Navigation POST)
- **Observed by the browser process**
- Uses normal HTML form submission (not fetch/XHR)
- The POST request itself is a **navigation request**
- Redirect happens in the **same request/response cycle**
- The browser process directly observes the request and response

### Renderer Process (fetch/XHR)
- **Handled in the renderer process**
- Uses `fetch()` or `XMLHttpRequest` API
- The POST request is **not a navigation request**
- Redirect is made with a **separate GET request later** (different request)
- The renderer process handles the request, then navigates separately

**Why this matters:** The bug manifests differently depending on which process handles the request. Navigation POST requests (browser process) and fetch/XHR requests (renderer process) may show different behavior in DevTools.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
   - http://localhost:3000

## Forms Overview

The project contains **6 forms** organized by data type and process type:

### Category 1: kData Only (Text Data)

| Form | Process | Request Type | Endpoint | Description |
|------|---------|--------------|----------|-------------|
| **Form 1** | Renderer | fetch/XHR | `/submit1` | Sends only text data via `fetch()`. Redirect handled in renderer process as separate GET request. |
| **Form 2** | Browser | Navigation POST | `/submit2` | Sends only text data via normal HTML form submission. Observed by browser process, redirect in same request/response. |

### Category 2: kData + kFile (Text + File Input)

| Form | Process | Request Type | Endpoint | Description |
|------|---------|--------------|----------|-------------|
| **Form 3** | Renderer | fetch/XHR | `/submit3` | Sends text data + file input via `fetch()`. Redirect handled in renderer process as separate GET request. |
| **Form 4** | Browser | Navigation POST | `/submit4` | Sends text data + file input via normal HTML form submission. Observed by browser process, redirect in same request/response. |

### Category 3: kData + kFile + Blob (Text + File Input + Blob)

| Form | Process | Request Type | Endpoint | Description |
|------|---------|--------------|----------|-------------|
| **Form 5** | Renderer | fetch/XHR | `/submit5` | Sends text data + file input + blob data via `fetch()`. Redirect handled in renderer process as separate GET request. |
| **Form 6** | Browser | Navigation POST | `/submit6` | Sends text data + file input + blob data via normal HTML form submission. Observed by browser process, redirect in same request/response. |

## Testing the Bug

### General Testing Steps

For each form:
1. Open Chrome DevTools and go to the **Network tab**
2. **Clear the network log**
3. Visit the form URL (e.g., `http://localhost:3000/form1.html`)
4. Fill out the form:
   - Enter text in the text field (required for all forms)
   - Select a file (required for forms 3-6)
   - Modify blob content if applicable (forms 5-6)
5. Click **Submit**
6. In the Network tab, select the **POST request**
7. Check the **Payload tab**
8. **Expected Bug:** The Payload tab should be missing or incomplete

### Form 1: kData Only - Renderer Process

**URL:** http://localhost:3000/form1.html

**What it tests:**
- Text data only (no files)
- fetch/XHR request (renderer process)
- Redirect as separate GET request

**Steps:**
1. Enter some text in the text field
2. Click Submit
3. Check Network tab → POST request → Payload tab

### Form 2: kData Only - Browser Process

**URL:** http://localhost:3000/form2.html

**What it tests:**
- Text data only (no files)
- Navigation POST request (browser process)
- Redirect in same request/response

**Steps:**
1. Enter some text in the text field
2. Click Submit
3. Check Network tab → POST request → Payload tab

### Form 3: kData + kFile - Renderer Process

**URL:** http://localhost:3000/form3.html

**What it tests:**
- Text data + file input
- fetch/XHR request (renderer process)
- Redirect as separate GET request

**Steps:**
1. Enter some text in the text field
2. Click "Choose file" and select a file
3. Click Submit
4. Check Network tab → POST request → Payload tab

### Form 4: kData + kFile - Browser Process

**URL:** http://localhost:3000/form4.html

**What it tests:**
- Text data + file input
- Navigation POST request (browser process)
- Redirect in same request/response

**Steps:**
1. Enter some text in the text field
2. Click "Choose file" and select a file
3. Click Submit
4. Check Network tab → POST request → Payload tab

### Form 5: kData + kFile + Blob - Renderer Process

**URL:** http://localhost:3000/form5.html

**What it tests:**
- Text data + file input + blob data
- fetch/XHR request (renderer process)
- Redirect as separate GET request

**Steps:**
1. Enter some text in the text field
2. Click "Choose file" and select a file
3. Optionally modify the blob content in the textarea
4. Click Submit
5. Check Network tab → POST request → Payload tab

### Form 6: kData + kFile + Blob - Browser Process

**URL:** http://localhost:3000/form6.html

**What it tests:**
- Text data + file input + blob data
- Navigation POST request (browser process)
- Redirect in same request/response

**Steps:**
1. Enter some text in the text field
2. Click "Choose file" and select a file
3. Optionally modify the blob content in the textarea
4. Click Submit
5. Check Network tab → POST request → Payload tab

## Bug Conditions

Three conditions are necessary to trigger this bug:
1. The form has `enctype="multipart/form-data"` (and `method="POST"`)
2. The form sends file/blob data (kFile or Blob) - **Note:** Forms 1-2 (kData only) may not trigger the bug, but are included for comparison
3. When submitting the form, the server responds with a redirect (302, 301, 307, or 308)

## Understanding the Bug

### What Happens

When a multipart/form-data POST request with file/blob data receives a redirect response:

**Renderer Process (fetch/XHR):**
- The POST request is made via fetch/XHR
- Server responds with redirect
- Browser makes a separate GET request to follow the redirect
- DevTools may not properly show the Payload tab for the POST request

**Browser Process (Navigation POST):**
- The POST request is a navigation request
- Server responds with redirect in the same request/response cycle
- DevTools may not properly show the Payload tab for the POST request

### Why This Matters

This bug makes it impossible to inspect the actual payload sent in multipart/form-data requests when the server redirects. This is critical for:
- Debugging form submissions
- Inspecting file uploads
- Understanding what data was actually sent
- Troubleshooting server-side issues

## Project Structure

```
.
├── form1.html          # kData only, Renderer Process (fetch/XHR)
├── form2.html          # kData only, Browser Process (Navigation POST)
├── form3.html          # kData + kFile, Renderer Process (fetch/XHR)
├── form4.html          # kData + kFile, Browser Process (Navigation POST)
├── form5.html          # kData + kFile + Blob, Renderer Process (fetch/XHR)
├── form6.html          # kData + kFile + Blob, Browser Process (Navigation POST)
├── server.js           # Express server with all endpoints
├── package.json        # Dependencies
└── README.md          # This file
```

## Server Endpoints

All endpoints respond with a redirect (302) to trigger the bug:

- `POST /submit1` - Form 1 (kData only - renderer process)
- `POST /submit2` - Form 2 (kData only - browser process)
- `POST /submit3` - Form 3 (kData + kFile - renderer process)
- `POST /submit4` - Form 4 (kData + kFile - browser process)
- `POST /submit5` - Form 5 (kData + kFile + Blob - renderer process)
- `POST /submit6` - Form 6 (kData + kFile + Blob - browser process)

## Technical Details

### kData, kFile, and Blob

- **kData**: Text/string data sent as form fields
- **kFile**: File data from `<input type="file">` elements
- **Blob**: Binary large object data created programmatically (e.g., `new Blob()`)

### Request Types

**Navigation POST:**
- Standard HTML form submission
- Browser navigates to the form action
- Request is observed by browser process
- Redirect handled in same request/response

**fetch/XHR:**
- JavaScript API calls (`fetch()` or `XMLHttpRequest`)
- Request handled by renderer process
- Redirect handled as separate navigation

## Contributing

This is a test case for reproducing a Chrome DevTools bug. If you find variations or additional scenarios that trigger the bug, please document them.

## License

ISC
