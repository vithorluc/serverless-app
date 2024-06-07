import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getTodo } from "../../src/handlers/getTodo";
import { getTodoService } from "../../src/services/getTodo";
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

jest.mock("../../src/services/getTodo");
jest.mock("../../src/utils/response");

describe("getTodo", () => {
  it("should get a todo item by id", async () => {
    const mockTodo = {
      id: "1234",
      title: "Test Todo",
      completed: false,
      metadata: {},
    };
    (getTodoService as jest.Mock).mockResolvedValue(mockTodo);
    (response.success as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTodo),
    } as APIGatewayProxyResult);

    const event = {
      pathParameters: { id: "1234" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await getTodo(
      event,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockTodo);
  });

  it("should return 404 if todo not found", async () => {
    (getTodoService as jest.Mock).mockResolvedValue(null);
    (response.failure as jest.Mock).mockReturnValue({
      statusCode: 404,
      body: JSON.stringify({ error: "Todo not found" }),
    } as APIGatewayProxyResult);

    const event = {
      pathParameters: { id: "1234" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await getTodo(
      event,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).error).toBe("Todo not found");
  });

  it("should return 500 if service throws an error", async () => {
    (getTodoService as jest.Mock).mockRejectedValue(new Error("Service error"));
    (response.failure as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: JSON.stringify({ error: "Service error" }),
    } as APIGatewayProxyResult);

    const event = {
      pathParameters: { id: "1234" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await getTodo(
      event,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Service error");
  });
});
