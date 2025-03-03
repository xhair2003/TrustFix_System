import React from "react";
import clsx from "clsx";
import "../../../assets/styles/components/common/ui/Button.scss";

const Button = ({
    children,
    size = "medium",
    type = "button",
    variant = "container",
    disabled = false,
    className = "",
    ...rest
}) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className={clsx(
                "custom-button",
                `btn-${size}`,
                `btn-${variant}`,
                { "btn-disabled": disabled },
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
