import { css } from "styled-system/css";

interface Props {
    placeholder: string;
}

export default function Textbox(props: Props) {
    return (
        <input className={
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
        } type="text" placeholder={props.placeholder} />
    );
}