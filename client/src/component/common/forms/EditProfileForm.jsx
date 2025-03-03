import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import RHFTextField from "../ui/RHFTextField";
import RHFTextarea from "../ui/RHFTextarea";
import RHFUploadFileButton from "../ui/RHFUploadFileButton";
import Button from "../ui/Button";

import { updateProfileService } from "../../../services/userService";

import "../../../assets/styles/components/common/forms/EditProfileForm.scss";

const formSchema = z.object({
    firstName: z.string().min(1, "Họ không được để trống"),
    lastName: z.string().min(1, "Tên không được để trống"),
    email: z
        .string()
        .min(1, "Email không được để trống")
        .email("Email không hợp lệ"),
    phone: z
        .string()
        .min(1, "Số điện thoại không được để trống")
        .regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ"),
    address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
    description: z.string().max(300, "Mô tả phải dưới 300 ký tự").optional(),
    imgAvt: z.any().optional(),
});

const mockUserData = {
    firstName: "Ngô Thái",
    lastName: "Dương",
    email: "duong482003@gmail.com",
    phone: "0123456789",
    address: "",
    description: "",
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
            formData.append("address", data.address);
            if (data.description) {
                formData.append("description", data.description);
            }
            if (data.imgAvt && data.imgAvt.length > 0) {
                formData.append("imgAvt", data.imgAvt[0]);
            }

            await updateProfileService(formData);
            alert("Cập nhật hồ sơ thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật hồ sơ:", error);
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
                                label="Họ, tên đệm:"
                                placeholder="Nhập họ"
                                className="half-width"
                            />
                            <RHFTextField
                                name="lastName"
                                label="Tên:"
                                placeholder="Nhập tên"
                                className="half-width"
                            />
                        </div>
                        <RHFTextField
                            name="email"
                            label="Email:"
                            placeholder="Nhập email"
                            type="email"
                        />
                        <RHFTextField
                            name="phone"
                            label="Số điện thoại:"
                            placeholder="Nhập số điện thoại"
                            type="tel"
                        />
                        <RHFTextField
                            name="address"
                            label="Địa chỉ:"
                            placeholder="Nhập địa chỉ"
                        />
                        <RHFTextarea
                            name="description"
                            label="Mô tả:"
                            placeholder="Viết một vài điều về bản thân..."
                            rows={4}
                        />
                        <div className="edit-profile-submit-container">
                            <Button
                                type="submit"
                                variant="container"
                                disabled={isSubmitting}
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </div>

                    <RHFUploadFileButton
                        name="imgAvt"
                        label="Tải ảnh đại diện lên"
                    />
                </div>
            </form>
        </FormProvider>
    );
};

export default EditProfileForm;
