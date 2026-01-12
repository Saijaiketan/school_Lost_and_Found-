# 🎒 School Lost & Found Website

A fully functional, interactive lost-and-found web application designed for school communities to help students and staff report found items, search for lost belongings, and manage the claim process efficiently.

## ✨ Features

### For Students & Staff
- **Browse Items**: Search and filter through all found items
- **Report Found Items**: Submit detailed reports with photo uploads
- **Claim Items**: Request to claim lost belongings with verification
- **Real-time Search**: Filter by category, status, and keywords
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### For Administrators
- **Admin Panel**: Secure admin login (password: `admin123`)
- **Approve/Reject Items**: Review and moderate submitted items
- **Manage Claims**: Approve or reject claim requests
- **Item Status Management**: Mark items as claimed or available
- **Dashboard Statistics**: View total items, claims, and activity

## 🚀 How to Use

### Opening the Website
1. Simply open the `index.html` file in any modern web browser
2. No server installation required - runs entirely in the browser
3. Data is stored locally using browser localStorage

### Reporting a Found Item
1. Click "Report Found Item" from the navigation menu
2. Fill in all required fields:
   - Item name
   - Category
   - Detailed description
   - Location where found
   - Date found
   - Your contact information
3. Optionally upload a photo of the item
4. Submit the form
5. Item will be pending until admin approval

### Browsing Lost Items
1. Click "Browse Items" from the navigation menu
2. Use the search box to find specific items
3. Filter by category (Electronics, Clothing, Books, Sports, Accessories, Other)
4. Filter by status (Available or Claimed)
5. Click on any item card to view full details

### Claiming an Item
1. Find the item you're looking for in the Browse section
2. Click "Claim This Item" button
3. Fill in your contact information
4. Explain why you believe this is your item
5. Submit the claim request
6. Wait for admin approval and contact from the finder

### Admin Access
1. Click "Admin" from the navigation menu
2. Enter password: `admin123`
3. Navigate between three tabs:
   - **Pending Items**: Approve or reject newly submitted items
   - **Approved Items**: Manage active items and mark as claimed
   - **Claims**: Review and process claim requests

## 📁 Project Structure

```
school-lost-found/
│
├── index.html      # Main HTML structure
├── styles.css      # Complete styling and responsive design
├── script.js       # All JavaScript functionality
└── README.md       # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic structure and forms
- **CSS3**: Modern styling, flexbox, grid, animations
- **JavaScript (Vanilla)**: Complete functionality without frameworks
- **LocalStorage**: Browser-based data persistence

## 💾 Data Storage

The application uses browser localStorage to store:
- All submitted items
- Claim requests
- Item statuses

**Note**: Data is stored locally in your browser. Clearing browser data will reset the application.

## 🎨 Design Features

- Clean, modern interface
- Color-coded status badges
- Smooth animations and transitions
- Card-based layout
- Modal dialogs for details and claims
- Fully responsive (mobile, tablet, desktop)
- Accessible navigation
- Photo upload with preview

## 🔐 Security Notes

**Important**: This is a prototype for educational purposes. For production use:

1. Replace localStorage with a proper backend database
2. Implement real authentication (not hardcoded passwords)
3. Add server-side validation
4. Implement proper image upload and storage
5. Add email notifications
6. Implement HTTPS and secure data transmission
7. Add user roles and permissions

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 🎓 Educational Purpose

This website is designed for school use and educational projects. It demonstrates:
- Form handling and validation
- Local data storage
- Image upload and preview
- Search and filter functionality
- Modal dialogs
- Admin panel implementation
- Responsive web design
- Clean code structure

## 🚦 Getting Started - Quick Demo

1. Open `index.html` in your browser
2. Click "Report Found Item"
3. Fill in the form (e.g., "Lost Water Bottle")
4. Submit the item
5. Go to Admin panel
6. Login with password: `admin123`
7. Approve the pending item
8. Go back to "Browse Items" to see it listed
9. Try claiming the item

## 📝 Customization

You can easily customize:

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #50c878;
    --danger-color: #e74c3c;
    /* ... */
}
```

### Categories
Modify the category options in `index.html`:
```html
<option value="YourCategory">Your Category</option>
```

### Admin Password
Change in `script.js`:
```javascript
if (password === 'your-new-password') {
    // ...
}
```

## 🤝 School Implementation

To use this in your school:

1. **Get Permission**: Obtain approval from school administration
2. **Customize Branding**: Add school logo and colors
3. **Backend Integration**: Consider implementing a proper backend
4. **Hosting**: Upload to school server or hosting service
5. **Training**: Provide brief training to staff and students
6. **Monitoring**: Assign admin to regularly check and manage items

## 📄 License

This project is created for educational purposes. Feel free to modify and use for your school.

## 🐛 Troubleshooting

**Items not showing?**
- Check if admin has approved them
- Clear filters in Browse section

**Can't login to admin?**
- Use password: `admin123`
- Check for typos

**Photo not uploading?**
- Ensure file is an image format (jpg, png, gif)
- Check file size (keep under 5MB for best performance)

**Data disappeared?**
- Browser data may have been cleared
- localStorage is browser-specific

## 📞 Support

For questions or issues with this project, please refer to the code comments or modify as needed for your school's requirements.

---

**Made for educational purposes** | **School Lost & Found System**
