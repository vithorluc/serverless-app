import { APIGatewayProxyHandler } from "aws-lambda";
import { getTodoService } from "../services/getTodo";
import { success, failure } from "../utils/response";
import { Todo } from "../models/todoModel";

export const getTodo: APIGatewayProxyHandler = async (event) => {
  try {
    const { id = "" } = event.pathParameters ?? {};
    const data: Todo = JSON.parse(event.body || "{}");
    const todo = await getTodoService(id);
    if (!todo) {
      return failure(404, "Todo not found");
    }
    return success(200, todo);
  } catch (error: any) {
    return failure(500, error.message);
  }
};
