export interface FormInputProps = {
    type: string;
    name: string;
    ph: string;
    icon: string;
    setCredentials: func;
    auto: string || null;
}

export interface FormsProps = {
    section: "login" || "register";
}
