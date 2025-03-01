import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import "../../../assets/styles/components/common/ui/RHFUploadFileButton.scss";

const RHFUploadFileButton = ({ name, label }) => {
    const { control } = useFormContext();
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event, onChange) => {
        const fileList = event.target.files;
        if (fileList.length > 0) {
            const file = fileList[0];
            setPreview(URL.createObjectURL(file));
            onChange(fileList);
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <div className="edit-profile-avatar">
                    <div className="avatar-preview-container">
                        {preview ? (
                            <img
                                className="avatar-preview-img"
                                src={preview}
                                alt="Avatar"
                            />
                        ) : (
                            <div className="avatar-placeholder">No image</div>
                        )}
                    </div>

                    <label className="edit-profile-upload-btn">
                        {label || "Choose Image"}
                        <input
                            type="file"
                            accept="image/*"
                            className="upload-input"
                            onChange={(event) =>
                                handleFileChange(event, onChange)
                            }
                        />
                    </label>
                </div>
            )}
        />
    );
};

export default RHFUploadFileButton;
