import styled from 'styled-components';
import Loader from "react-loader-spinner";

const SpinnerContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Spinner = ({ visible }) => {
  return(
    <SpinnerContainer>
      <Loader
        type="ThreeDots"
        color="#00BFFF"
        height={100}
        width={100}
        visible={visible}
      />
    </SpinnerContainer>
  );
};

export default Spinner;