import { css } from "styled-system/css";

interface Props {
  value: string;
  width?: "full" | "fit";
}

export default function Button(props: Props) {
  return (
    <input
      className={css({
        padding: "8px 16px",
        border: "1px solid #d1d5db",
        borderRadius: "md",
        fontSize: "sm",
        transition: "all 0.2s",
        width: props.width === "full" ? "100%" : "fit-content",
        _focus: {
          borderColor: "primary",
          outline: "none",
          boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
        },
        _hover: {
          backgroundColor: "primary",
          color: "white",
          cursor: "pointer",
        },
      })}
      type="submit"
      value={props.value}
    />
  );
}
