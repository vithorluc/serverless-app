import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../models/todoModel";

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const updateTodoService = async (
  id: string,
  data: Todo
): Promise<Todo> => {
  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression:
      "set title = :title, completed = :completed, metadata = :metadata",
    ExpressionAttributeValues: {
      ":title": data.title,
      ":completed": data.completed,
      ":metadata": data.metadata,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDb.update(params).promise();
  return result.Attributes as Todo;
};
