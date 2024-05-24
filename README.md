# Simple Weather App - AgentX recruitment task

This project is a React application built using Vite. It requires an environment variable `VITE_WEATHER_API_KEY` to be set for accessing weather data through an API.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/adriansadowski9/agentx-recruitment-task.git
cd agentx-recruitment-task
```

### 2. Install dependencies

Using yarn:
```bash
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory of the project and add the following line:

```makefile
VITE_WEATHER_API_KEY=your_api_key_here
```

Replace your_api_key_here with your actual weather API key. (https://www.weatherapi.com/docs/)

### 4. Run the development server

Using yarn:
```bash
yarn dev
```

The application should now be running at `http://localhost:5173`.