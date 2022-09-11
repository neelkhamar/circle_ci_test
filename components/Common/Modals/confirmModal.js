import { LoadingOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";

const ConfirmModal = ({
  title,
  isVisible,
  submit,
  cancel,
  message,
  btnSpinner,
}) => {
  return (
    <Modal
      title={title}
      visible={isVisible}
      footer={[
        <Button
          onClick={submit}
          disabled={btnSpinner}
          className="bgPurple"
          key={1}
        >
          {btnSpinner ? (
            <LoadingOutlined style={{ fontSize: 18, color: "white" }} spin />
          ) : (
            "Yes"
          )}
        </Button>,
        <Button onClick={cancel} key={2}>
          No
        </Button>,
      ]}
      onCancel={cancel}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
