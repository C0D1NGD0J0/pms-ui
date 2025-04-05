import { Modal, Radio } from "antd";
import { UseFormReturnType } from "@mantine/form";
import { ILoginForm } from "@interfaces/auth.interface";
import {
  FormInput,
  FormField,
  Checkbox,
  Button,
  Form,
} from "@components/FormElements/";
import {
  AuthContentHeader,
  AuthContenFooter,
  AuthContentBody,
} from "@components/AuthLayout";

interface LoginViewProps {
  form: UseFormReturnType<ILoginForm>;
  isSubmitting: boolean;
  isModalOpen: boolean;
  userAccounts: Array<{ csub: string; displayName: string }>;
  selectedClient: string;
  handleSubmit: (values: ILoginForm) => void;
  handleSelect: (csub: string) => void;
  toggleModal: (isOpen: boolean) => void;
}

export function LoginView({
  form,
  isModalOpen,
  userAccounts,
  selectedClient,
  handleSelect,
  toggleModal,
  handleSubmit,
  isSubmitting,
}: LoginViewProps) {
  return (
    <>
      <AuthContentHeader
        title="Login"
        headerLink="/register"
        headerLinkText="Register."
        subtitle="Don't have an account?"
      />
      <AuthContentBody>
        <Form
          onSubmit={form.onSubmit(handleSubmit)}
          id="login-form"
          className="auth-form"
          disabled={isSubmitting}
          autoComplete="off"
        >
          <div className="form-fields">
            <FormField
              error={{
                msg: (form.errors["email"] as string) || "",
                touched: form.isTouched("email"),
              }}
            >
              <FormInput
                required
                name="email"
                type="email"
                id="email"
                placeholder="Enter email..."
                value={form.values.email || ""}
                hasError={!!form.errors["email"]}
                onChange={(e) => form.setFieldValue("email", e.target.value)}
              />
            </FormField>
          </div>
          <div className="form-fields">
            <FormField
              error={{
                msg: (form.errors["password"] as string) || "",
                touched: form.isTouched("password"),
              }}
            >
              <FormInput
                required
                name="password"
                type="password"
                id="password"
                value={form.values.password || ""}
                hasError={!!form.errors["password"]}
                placeholder="Enter password..."
                onChange={(e) => form.setFieldValue("password", e.target.value)}
              />
            </FormField>
          </div>
          <div className="form-fields m-2">
            <FormField>
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                label="Remember me"
                checked={form.values.rememberMe}
                onChange={(e) =>
                  form.setFieldValue("rememberMe", e.target.checked)
                }
              />
            </FormField>
          </div>
          <div className="action-fields">
            <Button
              type="submit"
              disabled={!form.isValid()}
              className="btn btn-primary"
              label={`${isSubmitting ? "Processing..." : "Login"}`}
            />
          </div>
        </Form>
      </AuthContentBody>
      <AuthContenFooter
        footerLink="/forgot_password"
        footerLinkText="Forgot your password?"
      />
      {isModalOpen && userAccounts.length > 0 && (
        <Modal
          title="Select Client Account"
          open={isModalOpen}
          footer={[
            <Button
              key="cancel"
              className="btn-default mr-2"
              onClick={() => toggleModal(false)}
              label="Cancel"
            />,
            <Button
              key="select"
              className="btn-primary"
              onClick={() => toggleModal(false)}
              label="Select Client"
            />,
          ]}
        >
          <div className="">
            <ul className="account-list">
              {userAccounts.map((account) => (
                <li key={account.csub}>
                  <Radio
                    key={account.csub}
                    value={account.csub}
                    checked={selectedClient === account.csub}
                    onChange={(e) => handleSelect(e.target.value)}
                  >
                    {account.displayName}
                  </Radio>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
}
