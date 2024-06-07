import { APIGatewayProxyHandler } from "aws-lambda";
import { deleteTodoService } from "../services/deleteTodo";
import { success, failure } from "../utils/response";
import { Todo } from "../models/todoModel";

export const deleteTodo: APIGatewayProxyHandler = async (event) => {
  try {
    const { id = "" } = event.pathParameters ?? {};
    const data: Todo = JSON.parse(event.body || "{}");
    const result = await deleteTodoService(id);
    if (!result) {
      return failure(400, "Todo must be completed to delete");
    }
    return success(200, { message: "Todo deleted" });
  } catch (error: any) {
    return failure(500, error.message);
  }
};
