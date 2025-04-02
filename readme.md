# PDF Filler API Documentation

## API Endpoints

### Fill PDF Template

Fills a PDF template with text and images at specified positions.

**URL:** `/api/pdf/fill`

**Method:** `POST`

**Request Body:**

```json
{
  "templateName": "template.pdf",
  "outputName": "filled_form.pdf",
  "fields": [
    {
      "contentType": "text",
      "text": "John Doe",
      "x": 100,
      "y": 500,
      "page": 0
    },
    {
      "contentType": "text",
      "text": "01/01/1990",
      "x": 100,
      "y": 480,
      "page": 0
    },
    {
      "contentType": "image",
      "imageUrl": "https://example.com/signature.jpg",
      "x": 300,
      "y": 200,
      "width": 150,
      "height": 50,
      "page": 0
    },
    {
      "contentType": "image",
      "imageUrl": "https://example.com/logo.png",
      "x": 450,
      "y": 700,
      "width": 100,
      "height": 100,
      "page": 1
    }
  ],
  "options": {
    "fontSize": 12,
    "fontColor": {
      "r": 0,
      "g": 0,
      "b": 0
    },
    "fontName": "Helvetica"
  }
}
```

**Field Properties:**

| Property    | Required | Description                                            | Applies To       |
|-------------|----------|--------------------------------------------------------|------------------|
| contentType | Yes      | Type of content: "text" or "image"                     | All fields       |
| text        | Yes*     | Text content to add to the PDF                         | Text fields only |
| imageUrl    | Yes*     | URL of the image to embed                              | Image fields only|
| x           | Yes      | X coordinate position on the page                      | All fields       |
| y           | Yes      | Y coordinate position on the page                      | All fields       |
| page        | No       | Page number (0-based index, defaults to 0)             | All fields       |
| width       | No       | Width of the image in points (defaults to image width) | Image fields only|
| height      | No       | Height of the image in points (defaults to image height)| Image fields only|

\* Required based on contentType

**Options Properties:**

| Property   | Required | Description                           | Default    |
|------------|----------|---------------------------------------|------------|
| fontSize   | No       | Font size for text fields            | 12         |
| fontColor  | No       | RGB color object (values from 0 to 1) | Black (0,0,0) |
| fontName   | No       | Font name                            | Helvetica  |

**Supported Image Formats:**
- JPEG/JPG
- PNG

**Success Response:**

```json
{
  "success": true,
  "message": "PDF filled successfully",
  "filePath": "1717013244592-abc123de-filled_form.pdf"
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": "Template not found: template.pdf"
}
```

```json
{
  "success": false,
  "error": "Each field must specify a contentType (text or image)"
}
```

```json
{
  "success": false,
  "error": "Fields with contentType 'text' must include text property"
}
```

```json
{
  "success": false,
  "error": "Fields with contentType 'image' must include imageUrl property"
}
```

### Get Template Information

Retrieves information about a PDF template.

**URL:** `/api/pdf/template/:templateName`

**Method:** `GET`

**URL Parameters:**

| Parameter    | Description                       |
|--------------|-----------------------------------|
| templateName | The name of the PDF template file |

**Success Response:**

```json
{
  "success": true,
  "template": {
    "name": "template.pdf",
    "pageCount": 2,
    "pages": [
      {
        "width": 612,
        "height": 792
      },
      {
        "width": 612,
        "height": 792
      }
    ]
  }
}
```

### Download Filled PDF

Downloads a previously filled PDF file.

**URL:** `/api/pdf/download/:filename`

**Method:** `GET`

**URL Parameters:**

| Parameter | Description                                    |
|-----------|------------------------------------------------|
| filename  | The filename returned from the fill PDF endpoint |

**Response:**
- PDF file download