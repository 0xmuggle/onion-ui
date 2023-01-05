import React, { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./index.module.css";

type ValuesType = Record<string, any>;

interface FormProps {
  children: ReactNode;
  defaultValues?: ValuesType;
  onSubmit: (values: ValuesType) => any;
}
export const FormContext: any = React.createContext({});

const Form = ({ defaultValues, onSubmit, children }: FormProps) => {
  const { control, handleSubmit, getValues, setValue } = useForm({
    defaultValues,
  });
  return (
    <FormContext.Provider values={{ control, getValues, setValue }}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormContext.Provider>
  );
};

export default Form;
