import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../models/todoModel";

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const getTodoService = async (id: string): Promise<Todo | null> => {
  const params = {
    TableName: tableName,
    Key: { id },
  };

  const result = await dynamoDb.get(params).promise();
  return result.Item as Todo | null;
};
