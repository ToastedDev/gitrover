export const handler = (handler: (...args: any[]) => any) => {
  return (...args: any[]) => {
    try {
      handler(...args);
    } catch (err) {
      handleInquirerErrors(err);
    }
  };
};

export const handleInquirerErrors = (err: unknown) => {
  if (err instanceof Error && err.message.startsWith("User force closed"))
    process.exit();
  else throw err;
};
