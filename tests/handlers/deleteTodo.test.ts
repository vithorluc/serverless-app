import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { deleteTodo } from "../../src/handlers/deleteTodo";
import { deleteTodoService } from "../../src/services/deleteTodo";
import * as response from "../../src/utils/response";
import { Context } from "aws-lambda";

export const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "testFunction",
  functionVersion: "1",
  invokedFunctionArn:
    "arn:aws:lambda:us-east-1:123456789012:function:testFunction",
  memoryLimitInMB: "128",
  awsRequestId: "testRequestId",
  logGroupName: "/aws/lambda/testFunction",
  logStreamName: "2021/01/01/[$LATEST]abcdef1234567890abcdef1234567890",
  getRemainingTimeInMillis: () => 1000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

jest.mock("../../src/services/deleteTodo");
jest.mock("../../src/utils/response");

describe("deleteTodo", () => {
  it("should delete a todo item", async () => {
    (deleteTodoService as jest.Mock).mockResolvedValue(true);
    (response.success as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: JSON.stringify({ message: "Todo deleted" }),
    } as APIGatewayProxyResult);

    const event = {
      pathParameters: { id: "1234" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await deleteTodo(
      event,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe("Todo deleted");
  });

  it("should return 400 if todo not completed", async () => {
    (deleteTodoService as jest.Mock).mockResolvedValue(false);
    (response.failure as jest.Mock).mockReturnValue({
      statusCode: 400,
      body: JSON.stringify({ error: "Todo must be completed to delete" }),
    } as APIGatewayProxyResult);

    const event = {
      pathParameters: { id: "1234" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await deleteTodo(
      event,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe(
      "Todo must be completed to delete"
    );
  });

  it("should return 500 if service throws an error", async () => {
    (deleteTodoService as jest.Mock).mockRejectedValue(
      new Error("Service error")
    );
    (response.failure as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: JSON.stringify({ error: "Service error" }),
    } as APIGatewayProxyResult);

    const event = {
      pathParameters: { id: "1234" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await deleteTodo(
      event,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Service error");
  });
});
