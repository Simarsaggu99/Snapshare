import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import classNames from 'classnames';
import SearchBarModal from './SearchBarModal';
import styles from './index.less';

const SearchBar = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <div
        className={classNames('mx-auto items-center', styles.mainInput)}
        style={{ width: '30%' }}
        onClick={() => setModalVisible(true)}
      >
        <Input
          disabled
          className={classNames(styles.mainInput, styles.visibileInputField)}
          size="medium"
          placeholder="Enter keyword to search..."
          suffix={
            <div className={classNames(styles.searchIcon)}>
              <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </div>
          }
        />
      </div>
      <SearchBarModal setModalVisible={setModalVisible} modalVisible={modalVisible} />
    </>
  );
};

export default connect(({ forms, loading }) => ({
  formByType: forms.formByType,
  loading: loading.effects['forms/getForms'],
}))(SearchBar);
