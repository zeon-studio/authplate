export const generateRandomBase24 = (string: string) => {
  let result = "";
  for (let i = 0; i < string.length; i++) {
    const randomIndex = Math.floor(
      Math.random() * string.replace(".", "")?.length,
    );
    result += string.replace(".", "").charAt(randomIndex);
  }
  return result;
};
