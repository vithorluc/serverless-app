import { APIGatewayProxyHandler } from "aws-lambda";
import { updateTodoService } from "../services/updateTodo";
import { success, failure } from "../utils/response";
import { Todo } from "../models/todoModel";

export const updateTodo: APIGatewayProxyHandler = async (event) => {
  try {
    const { id = "" } = event.pathParameters ?? {};
    const data: Todo = JSON.parse(event.body || "{}");
    const updatedTodo = await updateTodoService(id, data);
    return success(200, updatedTodo);
  } catch (error: any) {
    return failure(500, error.message);
  }
};
