export type FieldName = "name" | "email" | "phone";

export type RegisterState = {
  status: "idle" | "error" | "success";
  message: string;
  fields: Partial<Record<FieldName, string>>;
  number: number;
  eligible: boolean;
  name: string;
  emailed: boolean;
};

export const initialRegisterState: RegisterState = {
  status: "idle",
  message: "",
  fields: {},
  number: 0,
  eligible: false,
  name: "",
  emailed: false,
};
