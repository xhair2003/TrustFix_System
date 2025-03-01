import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import RHFTextField from "../ui/RHFTextField";
import { updateProfileService } from "../../../services/userService";
import "../../../assets/styles/components/common/forms/EditProfileForm.scss";
import RHFUploadFileButton from "../ui/RHFUploadFileButton";
import Button from "../ui/Button";

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^[0-9]{10}$/, "Invalid phone number"),
    imgAvt: z.any().optional(),
});

const mockUserData = {
    firstName: "Ngô Thái",
    lastName: "Dương",
    email: "duong482003@gmail.com",
    phone: "0123456789",
    imgAvt: null,
};

const EditProfileForm = () => {
    const {
        handleSubmit,
        reset,
        formState: { isSubmitting },
        ...methods
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: mockUserData,
    });

    useEffect(() => {
        reset(mockUserData);
    }, [reset]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("email", data.email);
            formData.append("phone", data.phone);

            if (data.imgAvt && data.imgAvt.length > 0) {
                formData.append("imgAvt", data.imgAvt[0]);
            }

            await updateProfileService(formData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="edit-profile-form"
            >
                <div className="edit-profile-content">
                    <div className="edit-profile-fields">
                        <div className="edit-profile-row">
                            <RHFTextField
                                name="firstName"
                                label="First name:"
                                placeholder="Enter first name"
                                className="half-width"
                            />
                            <RHFTextField
                                name="lastName"
                                label="Last name:"
                                placeholder="Enter last name"
                                className="half-width"
                            />
                        </div>
                        <RHFTextField
                            name="email"
                            label="Email:"
                            placeholder="Enter email"
                            type="email"
                        />
                        <RHFTextField
                            name="phone"
                            label="Phone number:"
                            placeholder="Enter phone number"
                            type="tel"
                        />

                        <div className="edit-profile-submit-container">
                            <Button
                                type="submit"
                                variant="container"
                                disabled={isSubmitting}
                            >
                                Update
                            </Button>
                        </div>
                    </div>

                    <RHFUploadFileButton name="imgAvt" label="Upload Avatar" />
                </div>
            </form>
        </FormProvider>
    );
};

export default EditProfileForm;
