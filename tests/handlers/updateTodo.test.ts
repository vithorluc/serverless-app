import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { updateTodo } from "../../src/handlers/updateTodo";
import { updateTodoService } from "../../src/services/updateTodo";
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

jest.mock("../../src/services/updateTodo");
jest.mock("../../src/utils/response");

describe("updateTodo", () => {
  it("should update a todo item", async () => {
    const mockTodo = {
      id: "1234",
      title: "Updated Todo",
      completed: true,
      metadata: {},
    };
    (updateTodoService as jest.Mock).mockResolvedValue(mockTodo);
    (response.success as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTodo),
    } as APIGatewayProxyResult);

    const event = {
      pathParameters: { id: "1234" },
      body: JSON.stringify({
        title: "Updated Todo",
        completed: true,
        metadata: {},
      }),
    } as unknown as APIGatewayProxyEvent;

    const result = (await updateTodo(
      event,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockTodo);
  });

  it("should return 500 if service throws an error", async () => {
    (updateTodoService as jest.Mock).mockRejectedValue(
      new Error("Service error")
    );
    (response.failure as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: JSON.stringify({ error: "Service error" }),
    } as APIGatewayProxyResult);

    const event = {
      pathParameters: { id: "1234" },
      body: JSON.stringify({
        title: "Updated Todo",
        completed: true,
        metadata: {},
      }),
    } as unknown as APIGatewayProxyEvent;

    const result = (await updateTodo(
      event,
      mockContext,
      () => {}
    )) as APIGatewayProxyResult;

    expect(result).toBeDefined();
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Service error");
  });
});
