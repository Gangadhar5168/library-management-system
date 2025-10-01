# Library Management System

A comprehensive Library Management System built with Spring Boot, MySQL, and REST APIs for managing books, users, and transactions efficiently.

## 🚀 Features

### User Management
- User registration and profile management
- User roles (Librarian/Member) - Foundation implemented
- CRUD operations for user accounts
- Email and username validation

### Book Management
- Complete book inventory system
- Search functionality by title, author, and category
- Book availability tracking
- ISBN validation and duplicate prevention
- Category-based book organization

### Transaction Management
- Book borrowing and returning system
- Due date tracking (14-day loan period)
- Automatic fine calculation for overdue books ($1/day)
- Transaction history and reporting
- Real-time inventory updates

## 🛠️ Technical Stack

- **Backend Framework:** Spring Boot 3.x
- **Database:** MySQL 8.0
- **ORM:** JPA/Hibernate
- **Security:** Spring Security (Foundation)
- **Validation:** Bean Validation (JSR-303)
- **Build Tool:** Maven
- **Java Version:** 17+

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA/Eclipse/VS Code)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE library_management_db;

-- The application will auto-create tables on first run
```

### 3. Configure Application Properties
Update `src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/library_management_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# Server Configuration
server.port=8080

# Jackson Configuration
spring.jackson.serialization.fail-on-empty-beans=false
spring.jpa.open-in-view=true
```

### 4. Run the Application
```bash
# Using Maven
./mvnw spring-boot:run

# Or using your IDE
# Run LibraryManagementSystemApplication.java
```

The application will start on `http://localhost:8080`

## 📚 API Documentation

### User Management APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create new user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

### Book Management APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/books` | Add new book |
| GET | `/api/books` | Get all books |
| GET | `/api/books/{id}` | Get book by ID |
| GET | `/api/books/isbn/{isbn}` | Get book by ISBN |
| GET | `/api/books/search/title?title={title}` | Search by title |
| GET | `/api/books/search/author?author={author}` | Search by author |
| GET | `/api/books/category/{category}` | Get books by category |
| GET | `/api/books/available` | Get available books |
| PUT | `/api/books/{id}` | Update book |
| DELETE | `/api/books/{id}` | Delete book |

### Transaction APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/borrow?userId={id}&bookId={id}` | Borrow a book |
| POST | `/api/transactions/return?userId={id}&bookId={id}` | Return a book |
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/user/{userId}` | Get user transactions |
| GET | `/api/transactions/book/{bookId}` | Get book transaction history |
| GET | `/api/transactions/active` | Get active borrowings |
| GET | `/api/transactions/overdue` | Get overdue books |

### Test API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/test` | Test application status |

## 🧪 Testing the APIs

### Create a User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "role": "MEMBER",
    "phoneNumber": "1234567890"
  }'
```

### Add a Book
```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "publisher": "Scribner",
    "publicationYear": 1925,
    "category": "Fiction",
    "totalCopies": 10,
    "description": "A classic American novel"
  }'
```

### Borrow a Book
```bash
curl -X POST "http://localhost:8080/api/transactions/borrow?userId=1&bookId=1"
```

### Return a Book
```bash
curl -X POST "http://localhost:8080/api/transactions/return?userId=1&bookId=1"
```

### Search Books by Title
```bash
curl "http://localhost:8080/api/books/search/title?title=gatsby"
```

### Get Available Books
```bash
curl http://localhost:8080/api/books/available
```

## 🗂️ Project Structure

```
src/
├── main/
│   ├── java/com/library/
│   │   ├── controller/          # REST Controllers
│   │   │   ├── UserController.java
│   │   │   ├── BookController.java
│   │   │   ├── TransactionController.java
│   │   │   └── TestController.java
│   │   ├── service/             # Business Logic Layer
│   │   │   ├── UserService.java
│   │   │   ├── BookService.java
│   │   │   └── TransactionService.java
│   │   ├── repository/          # Data Access Layer
│   │   │   ├── UserRepository.java
│   │   │   ├── BookRepository.java
│   │   │   └── TransactionRepository.java
│   │   ├── model/               # Entity Classes
│   │   │   ├── User.java
│   │   │   ├── Book.java
│   │   │   ├── Transaction.java
│   │   │   ├── Role.java
│   │   │   ├── TransactionType.java
│   │   │   └── TransactionStatus.java
│   │   ├── config/              # Configuration Classes
│   │   │   └── SecurityConfig.java
│   │   └── LibraryManagementSystemApplication.java
│   └── resources/
│       └── application.properties
└── test/                        # Test Classes (Future Implementation)
```

## 🔧 Key Features & Implementation

### Database Design
- **User Entity:** Stores user information with role-based classification
- **Book Entity:** Complete book metadata with inventory tracking
- **Transaction Entity:** Links users and books with borrowing history
- **Relationships:** Proper JPA relationships between entities

### Business Logic
- **Inventory Management:** Real-time book availability updates
- **Fine Calculation:** Automatic calculation for overdue books
- **Validation:** Comprehensive input validation using Bean Validation
- **Transaction Management:** @Transactional support for data consistency

### API Design
- **RESTful Architecture:** Following REST principles
- **Error Handling:** Comprehensive exception handling
- **Response Standards:** Consistent HTTP status codes and responses

### Security Foundation
- **Spring Security:** Configured for future authentication implementation
- **Password Storage:** Ready for encryption implementation
- **Role-based Access:** Foundation laid for authorization

## 🚀 Future Enhancements

- [ ] **JWT Authentication & Role-based Authorization** (High Priority)
- [ ] Password encryption (BCrypt)
- [ ] Email notifications for due dates and overdue books
- [ ] Book reservation system
- [ ] Advanced search with multiple filters
- [ ] Admin dashboard with analytics
- [ ] Book recommendation system
- [ ] Pagination for large datasets
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] Logging and monitoring

## 🧪 Sample Data for Testing

### Sample User Data
```json
{
  "username": "librarian1",
  "email": "librarian@library.com",
  "password": "admin123",
  "fullName": "Alice Johnson",
  "role": "LIBRARIAN",
  "phoneNumber": "5551234567"
}
```

### Sample Book Data
```json
{
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "isbn": "978-0-06-112008-4",
  "publisher": "J.B. Lippincott & Co.",
  "publicationYear": 1960,
  "category": "Fiction",
  "totalCopies": 8,
  "description": "A gripping tale of racial injustice and childhood innocence"
}
```

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password`
- `full_name`
- `role` (LIBRARIAN/MEMBER)
- `phone_number`
- `created_at`
- `updated_at`

### Books Table
- `id` (Primary Key)
- `title`
- `author`
- `isbn` (Unique)
- `publisher`
- `publication_year`
- `category`
- `total_copies`
- `available_copies`
- `description`
- `created_at`
- `updated_at`

### Transactions Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `book_id` (Foreign Key)
- `transaction_type` (BORROW/RETURN)
- `transaction_date`
- `due_date`
- `return_date`
- `fine`
- `status` (ACTIVE/RETURNED/OVERDUE)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@Gangadhar5168](https://github.com/Gangadhar5168)
- Email: prathapvg5168@gmail.com

## 🙏 Acknowledgments

- Spring Boot Documentation
- MySQL Documentation
- JPA/Hibernate Documentation

