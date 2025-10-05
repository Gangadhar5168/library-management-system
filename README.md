# 📚 Modern Library Management System

A full-stack web application for managing library operations with a beautiful, modern UI built using **Java Spring Boot** and **vanilla JavaScript** with glass morphism design.

> **🤖 AI-Assisted Development**: This project was developed using modern AI tools (GitHub Copilot) to demonstrate effective human-AI collaboration in software development, showcasing how AI can accelerate development while maintaining code quality and creativity.

![Library Management System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0+-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow)
![UI](https://img.shields.io/badge/UI-Glass%20Morphism-blue)

## 🌟 Features

### 🔐 **Authentication & Authorization**
- **JWT-based authentication** with secure token management
- **Role-based access control** (Librarian vs Member)
- **Session management** with automatic logout
- **Protected routes** and API endpoints

### 📚 **Book Management**
- **CRUD operations** for book inventory
- **Advanced search** with filters (category, availability, author)
- **Pagination** with customizable items per page
- **Book availability tracking** with real-time updates
- **ISBN support** and publication year management

### 👥 **User Management**
- **User registration** and profile management
- **Role assignment** (Librarian/Member)
- **User activity tracking**
- **Contact information management**
- **Borrowing history** for each user

### 📋 **Transaction Management**
- **Book borrowing** and return system
- **Due date tracking** with overdue notifications
- **Transaction history** with detailed records
- **Status indicators** (Active, Returned, Overdue)
- **Real-time availability updates**

### 🎨 **Modern UI/UX**
- **Glass morphism design** with frosted glass effects
- **Responsive layout** for all screen sizes
- **Smooth animations** and hover effects
- **Beautiful typography** (Poppins + Inter fonts)
- **Gradient color schemes** throughout
- **Card-based layouts** with rounded corners
- **Interactive elements** with visual feedback

### 📊 **Dashboard & Analytics**
- **Real-time statistics** (total books, users, active loans)
- **Recent activity feed** with transaction timeline
- **Visual indicators** for overdue books
- **Role-based dashboard** customization

## 🛠️ Technology Stack

### **Backend**
- **Java 17** - Modern Java features
- **Spring Boot 3.0+** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **H2/MySQL** - Database options
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### **Frontend**
- **HTML5** - Modern markup
- **CSS3** - Advanced styling with custom properties
- **Vanilla JavaScript (ES6+)** - Modern JavaScript features
- **Bootstrap 5** - Responsive framework
- **Glass Morphism** - Modern design trend
- **Google Fonts** - Beautiful typography

### **Development Tools**
- **Git** - Version control
- **IntelliJ IDEA** - IDE
- **Postman** - API testing
- **Chrome DevTools** - Frontend debugging

## 🚀 Getting Started

### **Prerequisites**
- Java 17 or higher
- Maven 3.6+
- Modern web browser
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/library-management-system.git
   cd library-management-system
   ```

2. **Backend Setup**
   ```bash
   # Build the project
   mvn clean install
   
   # Run the Spring Boot application
   mvn spring-boot:run
   ```
   
   The backend server will start on `http://localhost:8080`

3. **Frontend Setup**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Serve the frontend (using any local server)
   # Option 1: Python
   python -m http.server 3000
   
   # Option 2: Node.js (if you have live-server installed)
   npx live-server --port=3000
   
   # Option 3: VS Code Live Server extension
   ```
   
   The frontend will be available at `http://localhost:3000`

### **Default Login Credentials**

**Librarian Account:**
- Username: `john.librarian`
- Password: `password123`

**Member Account:**
- Username: `jane.member`
- Password: `password123`

## 📱 Usage

### **For Librarians**
1. **Dashboard**: View library statistics and recent activity
2. **Books**: Add, edit, delete, and manage book inventory
3. **Users**: Manage user accounts and roles
4. **Transactions**: View all borrowing/return activities
5. **Book Operations**: Borrow books on behalf of users

### **For Members**
1. **Dashboard**: View personal borrowing statistics
2. **Books**: Browse and borrow available books
3. **Transactions**: View personal borrowing history
4. **Profile**: Manage personal information

## 🎨 UI Highlights

### **Design Features**
- **Glass Morphism**: Frosted glass effect with backdrop blur
- **Rounded Corners**: Soft, modern appearance throughout
- **Gradient Colors**: Beautiful color transitions
- **Smooth Animations**: 60fps transitions and hover effects
- **Typography**: Professional font combination
- **Responsive Grid**: Perfect layout on all devices

### **Interactive Elements**
- **Hover Animations**: Cards lift and glow on interaction
- **Loading States**: Smooth loading indicators
- **Status Badges**: Color-coded status indicators
- **Form Validation**: Real-time input validation
- **Modal Dialogs**: Elegant popup forms

## 📊 Database Schema

### **Key Entities**
- **User**: Authentication and profile information
- **Book**: Book inventory with availability tracking
- **Transaction**: Borrowing and return records

### **Relationships**
- User ↔ Transaction (One-to-Many)
- Book ↔ Transaction (One-to-Many)
- Proper foreign key relationships with cascade operations

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Secure cross-origin requests
- **Role-based Access**: Method-level security
- **Input Validation**: Server-side validation for all inputs

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Perfect layout for tablets
- **Desktop Enhanced**: Rich experience on larger screens
- **Cross-browser Compatible**: Works on all modern browsers

## 🚀 Deployment Ready

The application is production-ready with:
- **Environment Profiles**: Development and production configurations
- **Docker Support**: Containerization ready
- **Database Flexibility**: H2 for development, MySQL for production
- **Cloud Ready**: Compatible with Railway, Render, Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Veera Gangadhara Prathap CH**
- GitHub: [@Gangadhar5168](https://github.com/Gangadhar5168)
- Email: prathapvg5168@gmail.com

## 🤖 Development Approach

This project was developed with **AI assistance** (GitHub Copilot) to demonstrate:
- **AI-Assisted Development**: Leveraging modern AI tools for rapid development
- **Code Quality**: Maintaining high standards with AI-generated suggestions
- **Modern Practices**: Using AI to implement best practices and modern design patterns
- **Learning & Adaptation**: Combining human creativity with AI capabilities

### **AI Collaboration Benefits**
- **Faster Development**: Accelerated coding with intelligent suggestions
- **Best Practices**: AI-guided implementation of industry standards
- **Modern UI/UX**: AI-assisted creation of contemporary design systems
- **Code Quality**: Enhanced code structure and documentation
- **Problem Solving**: Collaborative approach to technical challenges

> *This project showcases the effective collaboration between human developers and AI tools, demonstrating how modern development practices can be enhanced through intelligent assistance while maintaining code quality and creativity.*

## 🎯 Project Highlights for Resume

### **Technical Skills Demonstrated**
- **Full-stack Development**: End-to-end application development
- **AI-Assisted Programming**: Effective use of AI tools for development acceleration
- **Modern Java**: Spring Boot, Spring Security, JPA
- **Database Design**: Relational database with proper relationships
- **REST API**: RESTful web services with proper HTTP methods
- **Frontend Development**: Modern JavaScript, CSS3, Responsive design
- **UI/UX Design**: Modern design principles and user experience
- **Security**: JWT authentication, role-based authorization
- **Version Control**: Git workflow with feature branches
- **Code Quality**: Maintaining standards with AI assistance
- **Rapid Prototyping**: Quick iteration with AI-guided development

### **Problem-Solving Skills**
- **System Architecture**: Designed scalable library management system
- **User Experience**: Created intuitive interface for different user roles
- **Performance**: Implemented pagination and efficient data handling
- **Security**: Implemented comprehensive authentication system

---

⭐ **Star this repository if you found it helpful!**

---

### 📝 **Development Transparency**

This project demonstrates modern software development practices including:
- **Human-AI Collaboration**: Using GitHub Copilot for intelligent code assistance
- **Best Practice Implementation**: AI-guided adherence to industry standards
- **Rapid Development**: Accelerated feature implementation with quality maintenance
- **Creative Problem Solving**: Combining human insight with AI capabilities

*Built with ❤️ using Java Spring Boot, modern web technologies, and AI assistance*

---

**Note**: This project showcases how developers can effectively leverage AI tools while maintaining ownership of architecture decisions, code quality, and creative solutions. The AI assistance enhanced productivity without compromising the learning experience or technical understanding.

