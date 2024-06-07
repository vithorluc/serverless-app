import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../models/todoModel";

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const deleteTodoService = async (id: string): Promise<boolean> => {
  const getParams = {
    TableName: tableName,
    Key: { id },
  };

  const getResult = await dynamoDb.get(getParams).promise();

  if (!getResult.Item || !getResult.Item.completed) {
    return false;
  }

  const deleteParams = {
    TableName: tableName,
    Key: { id },
  };

  await dynamoDb.delete(deleteParams).promise();
  return true;
};
