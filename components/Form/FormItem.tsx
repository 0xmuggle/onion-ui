import React from "react";
import { Controller } from "react-hook-form";
import { FormContext } from "./Form";
import styles from "./index.module.css";
interface FormItemProps {
  label?: string;
  children: any;
  name: string;
  rules: any;
}

const FormItem = ({ name, rules = {}, children, label }: FormItemProps) => {
  const { control } = React.useContext(FormContext);
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value = "", ...field }, fieldState }) => (
        <div className={`${styles.formItem} form-item`}>
          <label htmlFor={name}>{label}</label>
          <div className="relative pb-6">
            {React.cloneElement(children, { value, ...field })}
            <div className={styles.tip}>{fieldState.error?.message}</div>
          </div>
        </div>
      )}
    />
  );
};

export default FormItem;
