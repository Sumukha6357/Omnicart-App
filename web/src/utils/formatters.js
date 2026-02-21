export const formatInr = (value) => {
  const number = Number(value || 0);
  return `Rs. ${number.toLocaleString("en-IN")}`;
};
