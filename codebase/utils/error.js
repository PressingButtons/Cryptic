export const generate = (message) => {
  let error = new Error(message);
  console.trace(error);
  return error;
}
