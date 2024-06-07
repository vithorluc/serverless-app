import { APIGatewayProxyHandler } from "aws-lambda";
import { createTodoService } from "../services/createTodo";
import { success, failure } from "../utils/response";
import { Todo } from "../models/todoModel";

export const createTodo: APIGatewayProxyHandler = async (event) => {
  try {
    const data: Todo = JSON.parse(event.body || "{}");
    const todo = await createTodoService(data);
    return success(201, todo);
  } catch (error: any) {
    return failure(
      error.message === "Title is required" ? 400 : 500,
      error.message
    );
  }
};
