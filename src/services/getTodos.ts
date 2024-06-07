import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../models/todoModel";

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const getTodosService = async (): Promise<Todo[]> => {
  const params = {
    TableName: tableName,
  };

  const result = await dynamoDb.scan(params).promise();
  return result.Items as Todo[];
};
