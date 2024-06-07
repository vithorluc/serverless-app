import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getTodos } from "../../src/handlers/getTodos";
import { getTodosService } from "../../src/services/getTodos";
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

jest.mock("../../src/services/getTodos");
jest.mock("../../src/utils/response");

describe("getTodos", () => {
  it("should get all todo items", async () => {
    const mockTodos = [
      { id: "1234", title: "Test Todo", completed: false, metadata: {} },
    ];
    (getTodosService as jest.Mock).mockResolvedValue(mockTodos);
    (response.success as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTodos),
    } as APIGatewayProxyResult);

    const event = {} as APIGatewayProxyEvent;

    const result = (await getTodos(
      event,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockTodos);
  });

  it("should return 500 if service throws an error", async () => {
    (getTodosService as jest.Mock).mockRejectedValue(
      new Error("Service error")
    );
    (response.failure as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: JSON.stringify({ error: "Service error" }),
    } as APIGatewayProxyResult);

    const event = {} as APIGatewayProxyEvent;

    const result = (await getTodos(
      event,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Service error");
  });
});
