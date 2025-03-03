import { Controller, useFormContext } from "react-hook-form";
import "../../../assets/styles/components/common/ui/RHFTextField.scss";

const RHFTextField = ({ name, label, placeholder, type = "text" }) => {
    const { control } = useFormContext();

    return (
        <div className="text-field">
            <label htmlFor={name} className="label">
                {label}
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <input
                            {...field}
                            id={name}
                            type={type}
                            placeholder={placeholder}
                            className="input"
                            spellCheck={false}
                        />
                        {error && (
                            <span className="error">{error.message}</span>
                        )}
                    </>
                )}
            />
        </div>
    );
};

export default RHFTextField;
