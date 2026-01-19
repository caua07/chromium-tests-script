# Chrome DevTools Bug Reproduction

This project reproduces a critical Chrome DevTools bug where the Payload tab is missing or incomplete when:
- Form has `enctype="multipart/form-data"`
- Form has a file input and a file is selected
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

## Testing the Bug

### Form 1 Test
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form.html
4. Enter some text in the text field
5. Click "Choose file" and select a file
6. Click Submit
7. In the Network tab, select the POST request
8. **Bug:** The Payload tab only shows Query String Parameters but not the actual multipart payload

### Form 2 Test
1. Open Chrome DevTools and go to the Network tab
2. Clear the network log
3. Visit http://localhost:3000/form2.html
4. Enter some text in the text field
5. Click "Choose file" and select a file
6. Click Submit
7. In the Network tab, select the POST request
8. **Critical Bug:** The Payload tab is MISSING ENTIRELY!

## Bug Conditions

Three conditions are necessary to trigger this bug:
1. The form has `enctype="multipart/form-data"` (and `method="POST"`)
2. The form has at least an input element of type "file" and you actually select a file
3. When submitting the form, the server responds with a redirect

## Files

- `form.html` - First test form
- `form2.html` - Second test form (more severe bug)
- `server.js` - Express server that handles POST requests and redirects
- `package.json` - Dependencies
