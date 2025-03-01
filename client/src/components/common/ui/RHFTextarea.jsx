import { Controller, useFormContext } from "react-hook-form";
import "../../../assets/styles/components/common/ui/RHFTextarea.scss";

const RHFTextarea = ({ name, label, placeholder, rows = 4 }) => {
    const { control } = useFormContext();

    return (
        <div className="textarea-field">
            <label htmlFor={name} className="label">
                {label}
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <textarea
                            {...field}
                            id={name}
                            placeholder={placeholder}
                            rows={rows}
                            className="textarea"
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

export default RHFTextarea;
