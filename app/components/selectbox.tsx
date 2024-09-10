import { css } from "styled-system/css";

interface Props {
    options: string[];
}

export default function SelectBox(props: Props) {
    return (
        <select className={
            css({
                padding: "8px 16px",
                border: '1px solid #d1d5db',
                borderRadius: 'md',
                fontSize: 'sm',
                transition: 'all 0.2s',
                _focus: {
                    borderColor: 'primary',
                    outline: 'none',
                    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)' 
                },
            })
        }>
            {props.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
    );
}