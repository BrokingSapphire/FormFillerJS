# PDF Filler API Documentation

## API Endpoints

### Fill PDF Template

Fills a PDF template with text at specified positions.

**URL:** `/api/pdf/fill`

**Method:** `POST`

**Request Body:**

```json
{
  "templateName": "template.pdf",
  "outputName": "filled_form.pdf",
  "fields": [
    {
      "text": "John Doe",
      "x": 100,
      "y": 500,
      "page": 0
    },
    {
      "text": "01/01/1990",
      "x": 100,
      "y": 480,
      "page": 0
    }
  ],
  "options": {
    "fontSize": 12,
    "fontColor": {
      "r": 0,
      "g": 0,
      "b": 0
    }
  }
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "PDF filled successfully",
  "filePath": "1717013244592-abc123de-filled_form.pdf"
}
```

### Download Filled PDF

Downloads a previously filled PDF file.

**URL:** `/api/pdf/download/:filename`

**Method:** `GET`

**URL Parameters:**

```
ParameterDescriptionfilenameThe filename returned from the fill PDF endpoint
```

**Response:**

- PDF file download