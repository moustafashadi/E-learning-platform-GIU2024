# frontend-auth-app/frontend-auth-app/README.md

# Frontend Auth App

This project is a simple authentication application built with React. It provides functionalities for user login and registration on a single page.

## Project Structure

```
frontend-auth-app
├── public
│   ├── index.html          # Main HTML file
├── src
│   ├── components
│   │   ├── LoginForm.tsx   # Component for user login
│   │   ├── RegisterForm.tsx # Component for user registration
│   ├── pages
│   │   └── AuthPage.tsx    # Combines Login and Register forms
│   ├── App.tsx             # Main application component
│   ├── index.tsx           # Entry point of the application
│   └── styles
│       └── globals.css     # Global CSS styles
├── package.json             # NPM configuration file
├── tsconfig.json            # TypeScript configuration file
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd frontend-auth-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Usage

- The application allows users to either log in or register.
- Users can toggle between the login and registration forms on the same page.

## License

This project is licensed under the MIT License.