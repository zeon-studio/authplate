"use client";
const InputField = ({ ...rest }) => {
  return (
    <input
      className="w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-none focus:ring-0"
      {...rest}
    />
  );
};

export default InputField;
