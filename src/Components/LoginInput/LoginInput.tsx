import { useImperativeHandle, useRef, useState } from "react"
import styles from "./LoginInput.module.css"
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export type InputLoginHandler = {
    error: () => void;
    focus: () => void;
}

interface LoginInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const LoginInput = React.forwardRef<InputLoginHandler, LoginInputProps>((props: LoginInputProps, ref) => {

    const [showPass, setShowPass] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
        error() {
            setError(true)
        },
        focus() {
            inputRef.current?.focus()
        }
    }))

    function handle_showPassClick() {
        setShowPass(!showPass)
    }

    var pl = props.placeholder
    return (
        <div className={`${styles.inputWrapper} ${error ? styles.error : ""}`}>
            {pl && <label>{pl}</label>}
            <input
                onFocus={() => setError(false)}
                {...props}
                placeholder=" "
                type={props.type == "password" ? (showPass ? "text" : "password") : props.type}
                ref={inputRef}

            />
            {props.type == "password" && <div className={styles.showPass}>
                {showPass ?
                    <Visibility />
                    :
                    <VisibilityOff />
                }
            </div>}

        </div>
    )
})