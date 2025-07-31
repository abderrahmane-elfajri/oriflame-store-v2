function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Get the spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === 'addProduct') {
      const product = data.product;
      let sheet = spreadsheet.getSheetByName('Products');
      
      // If Products sheet doesn't exist, create it
      if (!sheet) {
        sheet = spreadsheet.insertSheet('Products');
        // Add headers
        sheet.getRange(1, 1, 1, 5).setValues([['ID', 'Name', 'Description', 'Price', 'Image']]);
      }
      
      // Check if sheet has headers, if not add them
      const firstRow = sheet.getRange(1, 1, 1, 5).getValues()[0];
      if (!firstRow[0] || firstRow[0] !== 'ID') {
        sheet.insertRowBefore(1);
        sheet.getRange(1, 1, 1, 5).setValues([['ID', 'Name', 'Description', 'Price', 'Image']]);
      }
      
      // Add the product to the sheet
      sheet.appendRow([
        product.id,
        product.name,
        product.description,
        product.price,
        product.image
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true, 
          message: 'Product added successfully',
          product: product
        }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === 'addOrder') {
      const order = data.order;
      let sheet = spreadsheet.getSheetByName('Orders');
      
      // If Orders sheet doesn't exist, create it
      if (!sheet) {
        sheet = spreadsheet.insertSheet('Orders');
        // Add headers
        sheet.getRange(1, 1, 1, 6).setValues([['ID', 'UserID', 'ProductID', 'Date', 'Address', 'Total']]);
      }
      
      // Check if sheet has headers, if not add them
      const firstRow = sheet.getRange(1, 1, 1, 6).getValues()[0];
      if (!firstRow[0] || firstRow[0] !== 'ID') {
        sheet.insertRowBefore(1);
        sheet.getRange(1, 1, 1, 6).setValues([['ID', 'UserID', 'ProductID', 'Date', 'Address', 'Total']]);
      }
      
      // Add the order to the sheet
      sheet.appendRow([
        order.id,
        order.userId,
        order.productId,
        order.date,
        order.address,
        order.total
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true, 
          message: 'Order added successfully',
          order: order
        }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === 'addUser') {
      const user = data.user;
      let sheet = spreadsheet.getSheetByName('Users');
      
      // If Users sheet doesn't exist, create it
      if (!sheet) {
        sheet = spreadsheet.insertSheet('Users');
        // Add headers
        sheet.getRange(1, 1, 1, 4).setValues([['ID', 'Email', 'Role', 'CreatedAt']]);
      }
      
      // Check if sheet has headers, if not add them
      const firstRow = sheet.getRange(1, 1, 1, 4).getValues()[0];
      if (!firstRow[0] || firstRow[0] !== 'ID') {
        sheet.insertRowBefore(1);
        sheet.getRange(1, 1, 1, 4).setValues([['ID', 'Email', 'Role', 'CreatedAt']]);
      }
      
      // Add the user to the sheet
      sheet.appendRow([
        user.id,
        user.email,
        user.role || 'customer',
        user.createdAt
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true, 
          message: 'User added successfully',
          user: user
        }))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === 'getUsers') {
      let sheet = spreadsheet.getSheetByName('Users');
      
      if (!sheet) {
        return ContentService
          .createTextOutput(JSON.stringify({success: true, users: []}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length === 0) {
        return ContentService
          .createTextOutput(JSON.stringify({success: true, users: []}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const headers = data[0];
      const users = data.slice(1).map(row => {
        const user = {};
        headers.forEach((header, index) => {
          user[header.toLowerCase()] = row[index] || '';
        });
        return user;
      });
      
      return ContentService
        .createTextOutput(JSON.stringify({success: true, users: users}))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === 'getOrders') {
      let sheet = spreadsheet.getSheetByName('Orders');
      
      if (!sheet) {
        return ContentService
          .createTextOutput(JSON.stringify({success: true, orders: []}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length === 0) {
        return ContentService
          .createTextOutput(JSON.stringify({success: true, orders: []}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const headers = data[0];
      const orders = data.slice(1).map(row => {
        const order = {};
        headers.forEach((header, index) => {
          order[header.toLowerCase()] = row[index] || '';
        });
        return order;
      });
      
      return ContentService
        .createTextOutput(JSON.stringify({success: true, orders: orders}))
        .setMimeType(ContentService.MimeType.JSON);
        
    } else if (action === 'getProducts') {
      let sheet = spreadsheet.getSheetByName('Products');
      
      if (!sheet) {
        return ContentService
          .createTextOutput(JSON.stringify({success: true, products: []}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length === 0) {
        return ContentService
          .createTextOutput(JSON.stringify({success: true, products: []}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const headers = data[0];
      const products = data.slice(1).map(row => {
        const product = {};
        headers.forEach((header, index) => {
          product[header.toLowerCase()] = row[index] || '';
        });
        return product;
      });
      
      return ContentService
        .createTextOutput(JSON.stringify({success: true, products: products}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Invalid action: ' + action}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: error.toString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Oriflame Store API is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}
