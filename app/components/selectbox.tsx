import { css } from "styled-system/css";

type StringObject = { [key: string]: string };

interface Props {
  options: StringObject;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

export default function SelectBox(props: Props) {
  return (
    <select
      name={props.name}
      className={css({
        padding: "8px 16px",
        border: "1px solid #d1d5db",
        borderRadius: "md",
        fontSize: "sm",
        transition: "all 0.2s",
        _focus: {
          borderColor: "primary",
          outline: "none",
          boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
        },
      })}
      value={props.value}
      onChange={(event) => {
        if (props.onChange) {
          props.onChange(event);
        }
      }}
    >
      {Object.keys(props.options).map((key, index) => {
        return (
          <option key={index} value={key}>
            {props.options[key]}
          </option>
        );
      })}
    </select>
  );
}
