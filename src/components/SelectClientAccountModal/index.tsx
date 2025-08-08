import React from "react";
import { FormRadio, Button, Modal } from "@components/FormElements";

interface SelectClientAccountModalProps {
  isOpen: boolean;
  userAccounts: Array<{ cuid: string; displayName: string }>;
  selectedClient: string;
  onSelect: (cuid: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const SelectClientAccountModal: React.FC<
  SelectClientAccountModalProps
> = ({
  isOpen,
  userAccounts,
  selectedClient,
  onSelect,
  onCancel,
  onConfirm,
}) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="medium">
      <Modal.Header
        title="Please select the account you wish to access:"
        onClose={onCancel}
      />

      <Modal.Content>
        <div className="account-selection">
          <div className="account-list space-y-3">
            {userAccounts.map((account) => (
              <FormRadio
                key={account.cuid}
                id={`account-${account.cuid}`}
                name="clientAccount"
                value={account.cuid}
                checked={selectedClient === account.cuid}
                onChange={handleRadioChange}
                label={account.displayName}
                className="account-radio-option"
              />
            ))}
          </div>
        </div>
      </Modal.Content>

      <Modal.Footer>
        <Button
          label="Cancel"
          onClick={onCancel}
          className="btn-default mr-2"
        />
        <Button
          label="Select Client"
          onClick={onConfirm}
          className="btn-primary"
          disabled={!selectedClient}
        />
      </Modal.Footer>
    </Modal>
  );
};
