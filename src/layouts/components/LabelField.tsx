import React from "react";

const LabelField = ({
  label,
  ...res
}: React.LabelHTMLAttributes<HTMLLabelElement> & { label: string }) => {
  return (
    <label {...res} className="mb-2 block font-bold text-gray-700">
      {label}
    </label>
  );
};

export default LabelField;
