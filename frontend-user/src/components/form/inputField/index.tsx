import React from "react";

const Input = ({
  type,
  onchange,
  name,
  className,
  required,
  value,
  placeholder,
  onFocus,
  max,
}: any) => {
  return (
    <div>
      <input

        value={value}
        onFocus={onFocus}
        type={type}
        onChange={onchange}
        name={name}
        className={`ring-none w-full border outline-none ring-0 ${className}`}
        placeholder={placeholder}
        max={max}
      />
    </div>
  );
};

export default Input;
