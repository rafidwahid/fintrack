# Fintrack Dashboard

The Fintrack Dashboard is the frontend application for the Fintrack credit card management system. It provides a user-friendly interface for managing credit cards, viewing statements, and tracking transactions.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Backend service running (see [backend README](../backend/README.md))

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd fintrack/dashboard
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the dashboard directory with the following variables:

```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Fintrack
```

### Running the Application

#### Development Mode

Run the application in development mode:

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

#### Production Build

To create a production build:

```bash
yarn build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── public/            # Static assets
├── index.html         # Entry HTML file
└── package.json
```

## 🔧 Technology Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **State Management**: React Query
- **UI Components**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Routing**: React Router
- **Package Manager**: Yarn

## 🎨 Features

- User authentication and authorization
- Credit card management
- Transaction tracking
- Statement viewing and analysis
- Bank account management
- Responsive design for all devices

## 🧪 Testing

To run tests:

```bash
yarn test
```

For test coverage:

```bash
yarn test:coverage
```

## 📦 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Create production build
- `yarn preview` - Preview production build locally
- `yarn test` - Run unit tests
- `yarn lint` - Run linter
- `yarn format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
