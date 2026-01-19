# Chrome DevTools Bug Reproduction

This project reproduces a critical Chrome DevTools bug where the Payload tab is missing or incomplete when:
- Form has `enctype="multipart/form-data"`
- Form has a file input and a file is selected (or blob/file data is sent)
- Server responds with a redirect

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

### Forms with Redirect (Triggers Bug) ⚠️

These forms send POST requests with file/blob data and the server responds with a redirect. **The Payload tab is missing or incomplete in DevTools.**

| Form | Type | Description | Request Type | Endpoint |
|------|------|-------------|--------------|----------|
| **Form 1** | File Input | Traditional file input with user-selected file | Navigation POST | `/submit` |
| **Form 2** | File Input | Traditional file input (more severe bug case) | Navigation POST | `/submit2` |
| **Form 3** | Blob Data | Blob object sent via FormData using fetch/XHR | Fetch/XHR | `/submit3` |
| **Form 4** | File Object | File object (extends Blob) sent via FormData using fetch/XHR | Fetch/XHR | `/submit4` |
| **Form 5** | DataTransfer | FileList created via DataTransfer API, set on file input, sent via fetch/XHR | Fetch/XHR | `/submit5` |
| **Form 8** | Blob Data | Blob object sent via navigation POST (not fetch/XHR) | Navigation POST | `/submit8` |
| **Form 9** | File Object | File object sent via navigation POST (not fetch/XHR) | Navigation POST | `/submit9` |

### Forms without Redirect (For Comparison) ✅

These forms send POST requests with file/blob data but the server responds with JSON (no redirect). **The Payload tab should be visible normally in DevTools.**

| Form | Type | Description | Endpoint |
|------|------|-------------|----------|
| **Form 6** | Blob Data | Blob object sent via FormData (no redirect) | `/submit6` |
| **Form 7** | File Object | File object sent via FormData (no redirect) | `/submit7` |

## Testing the Bug

### Form 1 Test (File Input with Redirect)
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form.html
4. Enter some text in the text field
5. Click "Choose file" and select a file
6. Click Submit
7. In the Network tab, select the POST request
8. **Bug:** The Payload tab only shows Query String Parameters but not the actual multipart payload

### Form 2 Test (File Input with Redirect - Severe Case)
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form2.html
4. Enter some text in the text field
5. Click "Choose file" and select a file
6. Click Submit
7. In the Network tab, select the POST request
8. **Critical Bug:** The Payload tab is MISSING ENTIRELY!

### Form 3 Test (Blob Data with Redirect)
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form3.html
4. Enter some text in the text field
5. Optionally modify the blob content in the textarea
6. Click Submit
7. In the Network tab, select the POST request
8. **Bug:** The Payload tab should be missing or incomplete

### Form 4 Test (File Object with Redirect)
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form4.html
4. Enter some text in the text field
5. Optionally modify the file content in the textarea
6. Click Submit
7. In the Network tab, select the POST request
8. **Bug:** The Payload tab should be missing or incomplete

### Form 5 Test (DataTransfer/FileList with Redirect)
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form5.html
4. Enter some text in the text field
5. Optionally modify the file content in the textarea
6. Click Submit
7. In the Network tab, select the POST request
8. **Bug:** The Payload tab should be missing or incomplete

### Form 8 Test (Blob Data - Navigation POST with Redirect)
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form8.html
4. Enter some text in the text field
5. Optionally modify the blob content in the textarea
6. Click Submit
7. In the Network tab, select the POST request (this is a navigation POST, not fetch/XHR)
8. **Bug:** The Payload tab should be missing or incomplete
9. **Note:** This is a single navigation POST request that both sends data and redirects (not separate requests)

### Form 9 Test (File Object - Navigation POST with Redirect)
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form9.html
4. Enter some text in the text field
5. Optionally modify the file content in the textarea
6. Click Submit
7. In the Network tab, select the POST request (this is a navigation POST, not fetch/XHR)
8. **Bug:** The Payload tab should be missing or incomplete
9. **Note:** This is a single navigation POST request that both sends data and redirects (not separate requests)

### Form 6 Test (Blob Data WITHOUT Redirect - Comparison)
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form6.html
4. Enter some text in the text field
5. Optionally modify the blob content in the textarea
6. Click Submit
7. In the Network tab, select the POST request
8. **Expected:** The Payload tab SHOULD BE VISIBLE (no redirect = no bug)

### Form 7 Test (File Object WITHOUT Redirect - Comparison)
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form7.html
4. Enter some text in the text field
5. Optionally modify the file content in the textarea
6. Click Submit
7. In the Network tab, select the POST request
8. **Expected:** The Payload tab SHOULD BE VISIBLE (no redirect = no bug)

## Bug Conditions

Three conditions are necessary to trigger this bug:
1. The form has `enctype="multipart/form-data"` (and `method="POST"`)
2. The form has at least an input element of type "file" and you actually select a file, OR blob/file data is sent via FormData
3. When submitting the form, the server responds with a redirect (302, 301, 307, or 308)

## Comparison: Redirect vs No Redirect

- **Forms 1-5, 8-9 (with redirect):** Payload tab is missing or incomplete ❌
- **Forms 6-7 (no redirect):** Payload tab is visible normally ✅

This demonstrates that the redirect response is the critical factor that triggers the bug.

## Comparison: Navigation POST vs Fetch/XHR

- **Forms 1-2, 8-9 (Navigation POST):** The POST request itself is a navigation request. The redirect happens in the same request/response cycle.
- **Forms 3-5 (Fetch/XHR):** Uses fetch() or XMLHttpRequest, then separately navigates to the redirect location after receiving the redirect response.

## Files

- `form.html` - Form 1: Traditional file input (redirects)
- `form2.html` - Form 2: Traditional file input, severe bug case (redirects)
- `form3.html` - Form 3: Blob data via FormData using fetch/XHR (redirects)
- `form4.html` - Form 4: File object via FormData using fetch/XHR (redirects)
- `form5.html` - Form 5: DataTransfer/FileList API using fetch/XHR (redirects)
- `form6.html` - Form 6: Blob data via FormData (NO redirect - for comparison)
- `form7.html` - Form 7: File object via FormData (NO redirect - for comparison)
- `form8.html` - Form 8: Blob data via navigation POST (redirects in same request)
- `form9.html` - Form 9: File object via navigation POST (redirects in same request)
- `server.js` - Express server that handles POST requests
- `package.json` - Dependencies

## Server Endpoints

### With Redirect (Triggers Bug)
- `POST /submit` - Form 1 (file input - navigation POST)
- `POST /submit2` - Form 2 (file input - navigation POST)
- `POST /submit3` - Form 3 (blob data - fetch/XHR)
- `POST /submit4` - Form 4 (file object - fetch/XHR)
- `POST /submit5` - Form 5 (DataTransfer/FileList - fetch/XHR)
- `POST /submit8` - Form 8 (blob data - navigation POST)
- `POST /submit9` - Form 9 (file object - navigation POST)

### Without Redirect (For Comparison)
- `POST /submit6` - Form 6 (blob data) - Returns JSON
- `POST /submit7` - Form 7 (file object) - Returns JSON
