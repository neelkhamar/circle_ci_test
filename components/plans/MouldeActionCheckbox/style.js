import Styled from 'styled-components';
import { Checkbox } from 'antd';

const CheckboxStyle = Styled(Checkbox)`
    width: 100%;
    margin-bottom: 10px;
    
    &.ant-checkbox-wrapper + .ant-checkbox-wrapper {
        margin-left: 0;
    }
`;

export { CheckboxStyle };
