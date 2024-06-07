import { APIGatewayProxyHandler } from "aws-lambda";
import { getTodosService } from "../services/getTodos";
import { success, failure } from "../utils/response";

export const getTodos: APIGatewayProxyHandler = async () => {
  try {
    const todos = await getTodosService();
    return success(200, todos);
  } catch (error: any) {
    return failure(500, error.message);
  }
};
