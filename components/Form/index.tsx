import { forwardRef } from "react";

export { default as Select } from "react-select";

export { default as FormItem } from "./FormItem";

// 文本框
export const Input = forwardRef(
  ({ className = "", ...props }: any, ref: any) => (
    <input
      type="text"
      className={`input input-bordered w-full ${className}`}
      {...props}
      ref={ref}
    />
  )
);
Input.displayName = "Input";

// 多行文本框
export const Textarea = forwardRef(
  ({ className = "", ...props }: any, ref: any) => (
    <textarea
      className={`textarea textarea-bordered w-full ${className}`}
      {...props}
      ref={ref}
    />
  )
);
Textarea.displayName = "Textarea";
