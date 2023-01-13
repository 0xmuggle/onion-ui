import { useState } from "react";

interface Props {
  options: {
    label?: string;
    value: string;
  }[];
  onChange?: any;
}
const Radio = ({ options, onChange }: Props) => {
  const [val, setVal] = useState<string[]>([]);
  const changeValue = (select: string) => (e: any) => {
    const nextVal = e.target.checked
      ? [...val, select]
      : val.filter((item: string) => item !== select);
    setVal(nextVal);
    onChange?.(nextVal);
  };
  return (
    <div>
      {options.map(({ value, label = value }: any) => (
        <div className="form-control" key={value}>
          <label className="label cursor-pointer space-x-2">
            <span className="label-text">{label}</span>
            <input
              type="checkbox"
              checked={val.includes(value)}
              onChange={changeValue(value)}
              className="checkbox checkbox-sm"
            />
          </label>
        </div>
      ))}
    </div>
  );
};
export default Radio;
