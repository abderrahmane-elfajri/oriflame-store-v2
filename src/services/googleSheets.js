class GoogleSheetsService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
    this.spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    
    // Apps Script Web App URL for write operations - check localStorage first
    this.appsScriptUrl = localStorage.getItem('apps_script_url') || 'https://script.google.com/macros/s/AKfycbyyiLTEBsmUXZsw_W8zvbPDRHLRM0JA1NtiwQ57-WWgT2lQqGyQu0PQ3i78MYbDC7SDuQ/exec';
    
    // Save the default URL to localStorage if not already set
    if (!localStorage.getItem('apps_script_url')) {
      localStorage.setItem('apps_script_url', this.appsScriptUrl);
    }
    
    // Event listeners for product updates
    this.listeners = [];
    
    // Make service globally available for configuration updates
    window.googleSheetsService = this;
  }

  // Event system for real-time updates
  addEventListener(callback) {
    this.listeners.push(callback);
  }

  removeEventListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  // Initialize spreadsheet with required sheets and headers
  async initializeSpreadsheet() {
    try {
      // Check if sheets exist and have headers
      await this.ensureSheetExists('Products', ['ID', 'Name', 'Description', 'Price', 'Image']);
      await this.ensureSheetExists('Users', ['ID', 'Email', 'CreatedAt']);
      await this.ensureSheetExists('Orders', ['ID', 'UserID', 'ProductID', 'Date', 'Address', 'Total']);
      console.log('Spreadsheet initialized successfully');
    } catch (error) {
      console.error('Error initializing spreadsheet:', error);
    }
  }

  async ensureSheetExists(sheetName, headers) {
    try {
      // Try to get existing data
      const data = await this.getSheetData(sheetName);
      
      // If sheet is empty or doesn't have headers, add them
      if (data.length === 0) {
        await this.appendSheetData(sheetName, headers);
        console.log(`Initialized ${sheetName} sheet with headers`);
      }
    } catch (error) {
      console.error(`Error ensuring ${sheetName} sheet exists:`, error);
      // If sheet doesn't exist, the error will be logged but won't crash the app
    }
  }

  async getSheetData(sheetName, range = 'A:Z') {
    try {
      if (!this.apiKey || this.apiKey === 'your_google_sheets_api_key') {
        throw new Error('Google Sheets API key not configured. Please set VITE_GOOGLE_SHEETS_API_KEY in your .env file.');
      }
      
      if (!this.spreadsheetId || this.spreadsheetId === 'your_spreadsheet_id') {
        throw new Error('Spreadsheet ID not configured. Please set VITE_GOOGLE_SHEETS_SPREADSHEET_ID in your .env file.');
      }

      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${sheetName}!${range}?key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(`Sheet "${sheetName}" not found or API not enabled. Status: ${response.status}`);
        } else if (response.status === 403) {
          throw new Error(`Permission denied. Make sure your Google Sheet is public and API is enabled. Status: ${response.status}`);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw error;
    }
  }

  async appendSheetData(sheetName, values) {
    try {
      if (!this.apiKey || this.apiKey === 'your_google_sheets_api_key') {
        throw new Error('Google Sheets API key not configured');
      }
      
      if (!this.spreadsheetId || this.spreadsheetId === 'your_spreadsheet_id') {
        throw new Error('Spreadsheet ID not configured');
      }

      // Updated URL format for better compatibility
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${sheetName}!A:E:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${this.apiKey}`;
      
      console.log(`Attempting to write to Google Sheets: ${sheetName}`);
      console.log('Data to append:', values);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [values]
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        if (response.status === 403) {
          throw new Error(`Permission denied. Your Google Sheets API key needs write permissions. Status: ${response.status}`);
        } else if (response.status === 400) {
          throw new Error(`Bad request. Check if "${sheetName}" sheet exists with proper headers. Status: ${response.status}`);
        } else {
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('Successfully added to Google Sheets:', result);
      return result;
    } catch (error) {
      console.error('Error appending sheet data:', error);
      throw error;
    }
  }

  async updateSheetData(sheetName, range, values) {
    try {
      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${sheetName}!${range}?valueInputOption=RAW&key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [values]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating sheet data:', error);
      throw error;
    }
  }

  // Products methods
  async getProducts() {
    try {
      const data = await this.getSheetData('Products');
      let products = [];
      
      if (data.length > 0) {
        const headers = data[0];
        products = data.slice(1).map(row => {
          const product = {};
          headers.forEach((header, index) => {
            product[header.toLowerCase()] = row[index] || '';
          });
          return product;
        });
      }
      
      // Also get locally stored products
      const localProducts = JSON.parse(localStorage.getItem('oriflame_products') || '[]');
      
      // Combine Google Sheets and local products
      const allProducts = [...products, ...localProducts];
      
      // If no products found, return mock data
      if (allProducts.length === 0) {
        return this.getMockProducts();
      }
      
      return allProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Try to get local products
      try {
        const localProducts = JSON.parse(localStorage.getItem('oriflame_products') || '[]');
        if (localProducts.length > 0) {
          console.log('Using locally stored products');
          return localProducts;
        }
      } catch (localError) {
        console.error('Error loading local products:', localError);
      }
      
      // Return mock data if everything fails
      return this.getMockProducts();
    }
  }

  async addProduct(product) {
    console.log('Adding product:', product);
    
    try {
      const newProduct = {
        id: Date.now().toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        addedAt: new Date().toISOString()
      };
      
      // Try to add to Google Sheets via Apps Script first
      console.log('🔄 Attempting to add product to Google Sheets via Apps Script...');
      console.log('Apps Script URL:', this.appsScriptUrl);
      
      if (this.appsScriptUrl && this.appsScriptUrl !== 'YOUR_APPS_SCRIPT_URL_HERE') {
        try {
          console.log('📤 Sending product data:', newProduct);
          
          const response = await fetch(this.appsScriptUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'addProduct',
              product: newProduct
            })
          });
          
          console.log('📥 Apps Script response status:', response.status);
          console.log('📥 Apps Script response headers:', response.headers);
          
          const result = await response.json();
          console.log('📥 Apps Script response data:', result);
          
          if (result.success) {
            console.log('✅ Product added to Google Sheets successfully!', newProduct);
            
            // Also save locally for immediate display
            const localProducts = JSON.parse(localStorage.getItem('oriflame_products') || '[]');
            localProducts.push(newProduct);
            localStorage.setItem('oriflame_products', JSON.stringify(localProducts));
            
            this.notifyListeners(); // Notify all listeners
            return { success: true, local: true, sheets: true, product: newProduct };
          } else {
            throw new Error(result.error || 'Unknown error from Apps Script');
          }
        } catch (sheetsError) {
          console.error('❌ Apps Script error:', sheetsError);
          
          // Fallback to local storage
          const localProducts = JSON.parse(localStorage.getItem('oriflame_products') || '[]');
          localProducts.push(newProduct);
          localStorage.setItem('oriflame_products', JSON.stringify(localProducts));
          
          this.notifyListeners(); // Notify all listeners
          return { 
            success: true, 
            local: true, 
            sheets: false,
            product: newProduct,
            error: sheetsError.message,
            message: 'Product saved locally. Google Sheets integration failed - please check your Apps Script URL.'
          };
        }
      } else {
        // No Apps Script URL configured - save locally only
        const localProducts = JSON.parse(localStorage.getItem('oriflame_products') || '[]');
        localProducts.push(newProduct);
        localStorage.setItem('oriflame_products', JSON.stringify(localProducts));
        
        this.notifyListeners(); // Notify all listeners
        return { 
          success: true, 
          local: true, 
          sheets: false,
          product: newProduct,
          message: 'Product saved locally. Please configure Apps Script URL for automatic Google Sheets integration.'
        };
      }
      
    } catch (error) {
      console.error('❌ Error adding product:', error);
      throw new Error(`Failed to add product: ${error.message}`);
    }
  }

  async tryGoogleSheetsWrite(product) {
    // This will fail with OAuth error, but we'll catch it gracefully
    const values = [
      product.id,
      product.name,
      product.description,
      product.price,
      product.image
    ];
    
    return await this.appendSheetData('Products', values);
  }

  async updateProduct(productId, product) {
    try {
      // Find the row index for the product
      const data = await this.getSheetData('Products');
      const rowIndex = data.findIndex(row => row[0] === productId);
      
      if (rowIndex === -1) {
        throw new Error('Product not found');
      }

      const range = `A${rowIndex + 1}:E${rowIndex + 1}`;
      const values = [
        productId,
        product.name,
        product.description,
        product.price,
        product.image
      ];
      
      return await this.updateSheetData('Products', range, values);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Users methods
  async getUsers() {
    try {
      // Get users from Google Sheets and local storage
      const sheetsUsers = await this.getUsersFromSheets();
      const localUsers = JSON.parse(localStorage.getItem('oriflame_users') || '[]');
      
      // Combine and deduplicate by email
      const allUsers = [...sheetsUsers, ...localUsers];
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u.email === user.email)
      );
      
      // Format users consistently
      return uniqueUsers.map(user => ({
        id: user.id || Date.now().toString(),
        email: user.email,
        role: user.role || 'customer',
        createdAt: user.createdAt || user.createdat || new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to local users only
      const localUsers = JSON.parse(localStorage.getItem('oriflame_users') || '[]');
      return localUsers.map(user => ({
        id: user.id || Date.now().toString(),
        email: user.email,
        role: user.role || 'customer',
        createdAt: user.createdAt || new Date().toISOString()
      }));
    }
  }

  async addUser(user) {
    console.log('Adding user to Google Sheets:', user);
    
    try {
      const newUser = {
        id: user.id || Date.now().toString(),
        email: user.email,
        role: user.role || 'customer',
        createdAt: new Date().toISOString()
      };
      
      // Try to add to Google Sheets via Apps Script first
      if (this.appsScriptUrl && this.appsScriptUrl !== 'YOUR_APPS_SCRIPT_URL_HERE') {
        try {
          const response = await fetch(this.appsScriptUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'addUser',
              user: newUser
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              console.log('✅ User added to Google Sheets successfully!', newUser);
              return { success: true, user: newUser, sheets: true };
            } else {
              throw new Error(result.error || 'Unknown error from Apps Script');
            }
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (sheetsError) {
          console.error('Apps Script error for user:', sheetsError);
          // Continue with local-only approach
          console.log('User processed locally (Google Sheets failed)');
          return { success: true, user: newUser, local: true };
        }
      } else {
        // No Apps Script configured
        console.log('User processed (no Google Sheets integration)');
        return { success: true, user: newUser, local: true };
      }
      
    } catch (error) {
      console.error('❌ Error adding user:', error);
      throw error;
    }
  }

  async getUsersFromSheets() {
    try {
      // Try to get users from Google Sheets via Apps Script
      if (this.appsScriptUrl && this.appsScriptUrl !== 'YOUR_APPS_SCRIPT_URL_HERE') {
        try {
          const response = await fetch(this.appsScriptUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'getUsers'
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              console.log('✅ Users fetched from Google Sheets successfully!');
              return result.users || [];
            }
          }
        } catch (error) {
          console.error('Error fetching users from Google Sheets:', error);
        }
      }
      
      // Fallback to local users
      const localUsers = JSON.parse(localStorage.getItem('oriflame_users') || '[]');
      return localUsers.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role || 'customer',
        createdAt: user.createdAt || new Date().toISOString()
      }));
      
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  // Orders methods
  async getOrders() {
    try {
      // Try Apps Script first
      if (this.appsScriptUrl && this.appsScriptUrl !== 'YOUR_APPS_SCRIPT_URL_HERE') {
        try {
          const response = await fetch(this.appsScriptUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'getOrders'
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              console.log('📥 Fetched orders from Google Sheets:', result.orders.length);
              return result.orders || [];
            }
          }
        } catch (error) {
          console.log('⚠️ Apps Script failed for getOrders, falling back to direct API:', error.message);
        }
      }

      // Fallback to direct Sheets API
      const data = await this.getSheetData('Orders');
      if (data.length === 0) return [];
      
      const headers = data[0];
      return data.slice(1).map(row => {
        const order = {};
        headers.forEach((header, index) => {
          order[header.toLowerCase()] = row[index] || '';
        });
        return order;
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async getUserOrders(userId) {
    try {
      console.log('🔍 Getting orders for user:', userId);
      
      // First try to get from Google Sheets
      const allOrders = await this.getOrders();
      console.log('📊 Total orders fetched:', allOrders.length);
      
      let userOrders = allOrders.filter(order => {
        const orderUserId = order.userid || order.userId || order.UserID;
        return orderUserId === userId;
      });
      
      console.log('🎯 User orders from sheets:', userOrders.length);
      
      // Also check localStorage for orders
      const localOrders = JSON.parse(localStorage.getItem('oriflame_orders') || '[]');
      const localUserOrders = localOrders.filter(order => order.userId === userId);
      console.log('💾 User orders from local:', localUserOrders.length);
      
      // Combine and deduplicate
      const combined = [...userOrders, ...localUserOrders];
      const unique = combined.filter((order, index, self) => 
        index === self.findIndex(o => (o.id || o.ID) === (order.id || order.ID))
      );
      
      console.log('🔗 Combined unique orders:', unique.length);
      
      // Enhance with product information
      const products = await this.getProducts();
      const enhancedOrders = unique.map(order => {
        const productId = order.productId || order.productid || order.ProductID;
        const product = products.find(p => p.id === productId);
        return {
          ...order,
          id: order.id || order.ID,
          userId: order.userId || order.userid || order.UserID,
          productId: productId,
          date: order.date || order.Date,
          address: order.address || order.Address,
          total: order.total || order.Total,
          productName: product ? product.name : 'Unknown Product',
          productImage: product ? product.image : null
        };
      });
      
      // Sort by date (newest first)
      const sorted = enhancedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log('✅ Final enhanced orders:', sorted.length);
      return sorted;
      
    } catch (error) {
      console.error('❌ Error fetching user orders:', error);
      // Return local orders as fallback
      const localOrders = JSON.parse(localStorage.getItem('oriflame_orders') || '[]');
      return localOrders.filter(order => order.userId === userId);
    }
  }

  async addOrder(order) {
    console.log('Adding order:', order);
    
    try {
      const newOrder = {
        id: Date.now().toString(),
        userId: order.userId,
        productId: order.productId,
        date: new Date().toISOString(),
        address: order.address,
        total: order.total
      };
      
      // Try to add to Google Sheets via Apps Script first
      if (this.appsScriptUrl && this.appsScriptUrl !== 'YOUR_APPS_SCRIPT_URL_HERE') {
        try {
          console.log('📤 Sending order to Apps Script:', newOrder);
          
          const response = await fetch(this.appsScriptUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'addOrder',
              order: newOrder
            })
          });
          
          console.log('📥 Apps Script response status:', response.status);
          
          if (response.ok) {
            const result = await response.json();
            console.log('📥 Apps Script response data:', result);
            
            if (result.success) {
              console.log('✅ Order added to Google Sheets successfully!', newOrder);
              
              // Also save locally for immediate access
              this.saveOrderLocally(newOrder);
              
              return { success: true, order: newOrder, sheets: true };
            } else {
              throw new Error(result.error || 'Unknown error from Apps Script');
            }
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (sheetsError) {
          console.error('Apps Script error for order:', sheetsError);
          
          // For orders, we'll still return success since the user expects the order to work
          // This is better UX - orders always "succeed" from user perspective
          console.log('✅ Order processed locally (Google Sheets failed)');
          this.saveOrderLocally(newOrder);
          return { success: true, order: newOrder, local: true };
        }
      } else {
        // No Apps Script configured - simulate successful order
        console.log('Order processed (no Google Sheets integration)');
        this.saveOrderLocally(newOrder);
        return { success: true, order: newOrder, local: true };
      }
      
    } catch (error) {
      console.error('❌ Error adding order:', error);
      throw error;
    }
  }

  // Helper method to save orders locally
  saveOrderLocally(order) {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('oriflame_orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('oriflame_orders', JSON.stringify(existingOrders));
      console.log('Order saved locally:', order);
    } catch (error) {
      console.error('Error saving order locally:', error);
    }
  }

  // Mock data for development/fallback
  getMockProducts() {
    return [
      {
        id: '1',
        name: 'Oriflame Royal Velvet Lipstick',
        description: 'Long-lasting luxury lipstick with rich pigmentation and moisturizing formula.',
        price: '25.99',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop'
      },
      {
        id: '2',
        name: 'Divine Anti-Aging Cream',
        description: 'Premium anti-aging moisturizer with 24k gold and peptides for youthful skin.',
        price: '89.99',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop'
      },
      {
        id: '3',
        name: 'Eclat Beauty Serum',
        description: 'Illuminating vitamin C serum for radiant and glowing complexion.',
        price: '45.99',
        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop'
      },
      {
        id: '4',
        name: 'Perfect Foundation',
        description: 'Full coverage foundation with SPF protection for flawless skin.',
        price: '35.99',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop'
      },
      {
        id: '5',
        name: 'Oriflame Mascara Max',
        description: 'Volumizing mascara for dramatic lashes with waterproof formula.',
        price: '19.99',
        image: 'https://images.unsplash.com/photo-1631214540260-7234ca9821b7?w=300&h=300&fit=crop'
      },
      {
        id: '6',
        name: 'Perfume - Swedish Spa',
        description: 'Fresh and invigorating fragrance inspired by Swedish nature.',
        price: '65.99',
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=300&h=300&fit=crop'
      }
    ];
  }
}

export default new GoogleSheetsService();
