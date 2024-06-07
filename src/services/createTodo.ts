import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../models/todoModel";

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const createTodoService = async (data: Todo): Promise<Todo> => {
  if (!data.title) {
    throw new Error("Title is required");
  }

  const id = uuidv4();
  const todo: Todo = {
    id,
    title: data.title,
    completed: false,
    metadata: data.metadata || {},
  };

  const params = {
    TableName: tableName,
    Item: todo,
  };

  await dynamoDb.put(params).promise();
  return todo;
};
