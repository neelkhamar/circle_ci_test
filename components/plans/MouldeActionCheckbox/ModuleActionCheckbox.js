import _ from "lodash";
import { useEffect, useState } from "react";
import { CheckboxStyle } from "./style";

const ModuleActionCheckbox = (props) => {
  const { items, value, onChange } = props;

  const [state, setState] = useState({
    checkedList: value,
    indeterminate: !!value.length && value.length < items.length,
    checkAll: value.length === items.length,
  });

  useEffect(() => {
    if (onChange) {
      onChange(state.checkedList);
    }
  }, [state]);

  const onMultiChange = (item, e) => {
    let clonedCheckedList = _.cloneDeep(state.checkedList);
    if (e.target.checked) {
      clonedCheckedList.push(item.name);
    } else {
      clonedCheckedList = clonedCheckedList.filter(
        (checkedItem) => checkedItem !== item.name
      );
    }

    setState({
      checkedList: clonedCheckedList,
      indeterminate:
        !!clonedCheckedList.length && clonedCheckedList.length < items.length,
      checkAll: clonedCheckedList.length === items.length,
    });
  };

  const onCheckAllChange = (e) => {
    setState({
      checkedList: e.target.checked ? items.map((item) => item.name) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  return (
    <div>
      <div style={{ borderBottom: "1px solid #E9E9E9" }}>
        <CheckboxStyle
          indeterminate={state.indeterminate}
          onChange={onCheckAllChange}
          checked={state.checkAll}
        >
          Check all
        </CheckboxStyle>
      </div>
      <br />
      <div className="action-group">
        {items.map((item) => {
          const isChecked = state.checkedList.find(
            (checkedItem) => checkedItem === item.name
          );

          return (
            <CheckboxStyle
              value
              onChange={(e) => onMultiChange(item, e)}
              checked={isChecked}
              key={`module-action-${item.id}`}
            >
              {item.name} - {item.description}
            </CheckboxStyle>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleActionCheckbox;
