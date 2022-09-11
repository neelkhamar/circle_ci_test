import Styled from 'styled-components';

const PaymentCardItemWrapper = Styled.figure`
    margin-right: 15px;
    .ant-card{
        margin-bottom: 20px !important;
        @media only screen and (max-width: 1199px){
            margin-bottom: 50px !important;
        }
        @media only screen and (max-width: 991px){
            margin-bottom: 30px !important;
        }
        
        .ant-card-body {
          max-width: 360px;
          aspect-ratio: 1.6;
          --scale: 0.85;
        }
    }
`;

const Figure2 = Styled.figure`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 0;
    color: #fff;    
    font-size: 25px;
    height: 100%;
    
    .card-brand {
      text-align: right;
      font-size: 35px;
      font-weight: bold;
      font-style: italic;
      text-align: right;
    }
    
    .card-number {
      display: flex;
      flex-direction: row;
      align-items: center;      
      
      span {
        margin-right: 30px;
        letter-spacing: 2px;
      }
    }
    
    .card-bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      
      .card-expire-at {
        line-height: 1.1;
        .expire-at-text {
          font-size: 15px;
        }
      }
      
      .card-actions {
        .icon-btn {
          cursor: pointer;
          font-size: 20px;
          margin-left: 10px;
        }
      }
    } 
  }
`;

export { Figure2 };

export default PaymentCardItemWrapper;
