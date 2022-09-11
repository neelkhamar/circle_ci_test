import React from 'react';
import { Input, Row, Col } from 'antd';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Div } from './header-search-style';
import { Popover } from '../popup/popup';

const HeaderSearch = ({ darkMode }) => {
  const dispatch = useDispatch();
  const searchData = useSelector(state => state.headerSearchData);
  const rtl = useSelector(state => state.ChangeLayoutMode.rtlData);

  const content = (
    <div>
      {searchData.length ? (
        searchData.map(group => {
          const { title, count, id } = group;
          return (
            <Link key={id} href="#">
              {title}
              <span className="certain-search-item-count">{count} people</span>
            </Link>
          );
        })
      ) : (
        <NavLink to="#">Data Not found....</NavLink>
      )}
    </div>
  );

  return (
    <>
      <Div className="certain-category-search-wrapper" style={{ width: '100%' }} darkMode={darkMode}>
        <Row className="ant-row-middle">
          <Col md={2} xs={1} className={rtl ? 'text-left' : 'text-right'}>
            {/* <span className="certain-category-icon">
            <i className='bx bx-search'></i>
            </span> */}
          </Col>
          <Col md={22} xs={23}>
            {/* <Popover
              placement={!rtl ? 'bottomLeft' : 'bottomRight'}
              content={content}
              title="Search List"
              action="focus"
            > */}
              {/* <Input placeholder="Search..." onInput={search} /> */}
            {/* </Popover> */}
          </Col>
        </Row>
      </Div>
    </>
  );
};

HeaderSearch.propTypes = {
  darkMode: PropTypes.bool,
};

export default HeaderSearch;
