import { Button, Modal, Row } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "reactstrap";

function OTPModal(props) {
  const [code, setCode] = useState("");
  const { visible, handleOk, handleCancel, btnSpinner, otpError, resendOtp } =
    props;

  return (
    <Modal
      className="otpModalContainer"
      title={"Verify OTP"}
      visible={visible}
      closable={false}
      footer={null}
    >
      <Row className="ant-row">
        <div className="ant-col ant-col-xs-24 ant-col-xl-24 d-flex mb-2 d-flex">
          <input
            type="number"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
            className="form-control otp-input"
          />
          <div className="resend-top">
            <span
              onClick={() => {
                resendOtp();
                setCode("");
              }}
            >
              Resend OTP
            </span>
          </div>
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-24 mb-2">
          {otpError.length > 0 &&
            otpError.map((err, index) => {
              return (
                <Row className="ant-row" key={index}>
                  <div className="ant-col ant-col-xs-24 ant-col-xl-24">
                    <div className={"alert alert-danger m-0 mt-2"}>{err}</div>
                  </div>
                </Row>
              );
            })}
        </div>
        <div className="ant-col ant-col-xs-24 ant-col-xl-12 d-flex">
          {btnSpinner ? (
            <Button className="otpBtnDuplicate" disabled={true}>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              ></Spinner>
            </Button>
          ) : (
            <button className="otpBtn" onClick={() => handleOk(code)}>
              Verify
            </button>
          )}
          <button className="otpBtnWhite" onClick={handleCancel}>
            Close
          </button>
        </div>
      </Row>
    </Modal>
  );
}

export default OTPModal;
