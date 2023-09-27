import { Button, Modal } from 'antd';
import classNames from 'classnames';
import React from 'react';
import SignaturePad from 'react-signature-canvas';
import styles from './index.less';

const SignaturePadModal = ({ signUrl, setSignUrl, setVisible, visible }) => {
  const signPag = React.useRef();

  const onTrim = () => {
    const url = signPag.current.getTrimmedCanvas().toDataURL('image/png');
    setSignUrl(url);
  };

  const onClear = () => signPag.current.clear();

  return (
    <div>
      <Modal
        destroyOnClose
        visible={visible}
        title="Signature"
        footer={[
          <Button onClick={() => setVisible(false)} key="1">
            Cancel
          </Button>,
          <Button
            onClick={async () => {
              await onTrim();
              await setVisible(false);
            }}
            key="2"
          >
            Done
          </Button>,
        ]}
      >
        <div className="border mb-4 h-full">
          <SignaturePad canvasProps={{ className: styles.sigPad }} ref={signPag} />
        </div>
        <div className="flex justify-end mb-4">
          <Button onClick={onClear} className="mr-4">
            Clear
          </Button>
          <Button onClick={onTrim} className="mr-4" type="primary">
            Preview Signature
          </Button>
        </div>
        {signUrl && (
          <div className="px-4 mb-4">
            <div className="font-semibold pb-2 text-base">Signature preview</div>
            <img className={classNames(styles.sigImage, 'border')} src={signUrl} alt="signUrl" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SignaturePadModal;
