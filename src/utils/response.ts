export const success = (statusCode: number, data: any) => ({
  statusCode,
  body: JSON.stringify(data),
});

export const failure = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ error: message }),
});
