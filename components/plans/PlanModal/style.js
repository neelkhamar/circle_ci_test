import Styled from "styled-components";

const AllowedModuleWrapper = Styled.div`
  .ant-card{
    .ant-card-body{
      h1{
        font-weight: 500;
      }
    }
  }
  .ant-collapse{
    margin-top: 25px;
    &.ant-collapse-borderless{
      background: #fff;
    }
    &.ant-collapse-icon-position-left{
      .ant-collapse-header{
        color: ${({ theme }) => theme["dark-color"]} !important;
      }
    }
  }
  .ant-collapse-item{
    border: 1px solid ${({ theme }) => theme["border-color-light"]} !important;
    &.ant-collapse-item-active{
      box-shadow: 0px 15px 40px ${({ theme }) => theme["light-color"]}15;
    }
    .ant-collapse-header{
      font-weight: 500;
      font-size: 15px;
      background-color: #fff;
      padding: 10px !important;
      border-radius: 5px !important;
      background-color: #F8F9FB;
      @media only screen and (max-width: 575px){        
        padding: ${({ theme }) =>
          !theme.rtl
            ? "15px 45px 15px 15px"
            : "15px 15px 15px 45px"} !important;
      }
      .ant-collapse-arrow{
        ${({ theme }) => (!theme.rtl ? "left" : "right")}: auto !important;
        ${({ theme }) => (theme.rtl ? "left" : "right")}: 25px !important;
        top: 22px !important;
        transform: translateY(0) !important;
      }
    }
  }

  .ant-collapse-content{
    box-shadow: 0 15px 40px ${({ theme }) => theme["light-color"]}15;
    .ant-collapse-content-box{
      border-top: 1px solid ${({ theme }) =>
        theme["border-color-light"]} !important;
      padding: 20px 25px 30px !important;
      P{
        font-size: 15px;
        margin-bottom: 35px;
        line-height: 1.667;
        color: ${({ theme }) => theme["gray-color"]};
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6{
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 12px;
        color: ${({ theme }) => theme["dark-color"]};
      }
      .panel-actions{
        button{
          height: 36px;
          padding: 0 15px;
          &:not(:last-child){
            ${({ theme }) =>
              theme.rtl ? "margin-left" : "margin-right"}: 10px;
          }
        }
      }
    }
  }
`;

export { AllowedModuleWrapper };
