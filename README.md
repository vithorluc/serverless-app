# Serverless Todo API

A serverless RESTful API for managing a todo list, built with AWS Lambda, API Gateway, DynamoDB, and the Serverless Framework. This project uses TypeScript for type safety and Jest for unit testing.

## Table of Contents

- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Deploying the Service](#deploying-the-service)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [License](#license)

## Project Structure

```plaintext
serverless-todo-app/
├── src/
│   ├── handlers/
│   │   ├── createTodo.ts
│   │   ├── getTodos.ts
│   │   ├── getTodo.ts
│   │   ├── updateTodo.ts
│   │   └── deleteTodo.ts
│   ├── models/
│   │   └── todoModel.ts
│   ├── services/
│   │   ├── createTodo.ts
│   │   ├── getTodos.ts
│   │   ├── getTodo.ts
│   │   ├── updateTodo.ts
│   │   └── deleteTodo.ts
│   ├── utils/
│   │   ├── response.ts
│   ├── index.ts
├── tests/
│   ├── handlers/
│   │   ├── createTodo.test.ts
│   │   ├── getTodos.test.ts
│   │   ├── getTodo.test.ts
│   │   ├── updateTodo.test.ts
│   │   └── deleteTodo.test.ts
├── .gitignore
├── jest.config.js
├── package.json
├── serverless.yml
├── tsconfig.json
└── README.md
```

## Setup and Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/serverless-todo-app.git
   cd serverless-todo-app
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure AWS credentials:**

   Ensure you have AWS credentials configured on your machine. You can configure them using the AWS CLI:

   ```sh
   aws configure
   ```

## Deploying the Service

To deploy the service to AWS, run:

```sh
serverless deploy
```

## Running the Services Locally With Serveless Offline

To run it locally with Serverless Offline Plugin, run:

```sh
npm run offline
```

## API Endpoints

Here are the available endpoints for the Todo API:

- **Create a Todo**

  ```http
  POST /todos
  ```

  Request body:

  ```json
  {
    "title": "Buy groceries",
    "metadata": {
      "priority": "high"
    }
  }
  ```

- **Get All Todos**

  ```http
  GET /todos
  ```

- **Get a Todo by ID**

  ```http
  GET /todos/{id}
  ```

- **Update a Todo**

  ```http
  PUT /todos/{id}
  ```

  Request body:

  ```json
  {
    "title": "Buy groceries and cook dinner",
    "completed": false,
    "metadata": {
      "priority": "medium"
    }
  }
  ```

- **Delete a Todo**

  ```http
  DELETE /todos/{id}
  ```

  Note: A todo can only be deleted if it is marked as completed.

## Running Tests

To run the unit tests, use:

```sh
npm test
```

## License

This project is licensed under the MIT License.
