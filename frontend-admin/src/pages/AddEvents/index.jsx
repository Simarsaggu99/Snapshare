import React, { useState } from 'react';
import { Form, Skeleton, Row, Col, Input, Upload, DatePicker, Button, TimePicker } from 'antd';
import { AiOutlineUpload } from 'react-icons/ai';
// import { connect } from 'umi';
import { Modal } from 'antd';
import moment from 'moment';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import ImgCrop from 'antd-img-crop';
import { connect, useHistory } from 'umi';

const AddEvents = ({ dispatch }) => {
  const history = useHistory()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addEvent, setAddEvent] = useState(false)
  const [form] = Form.useForm();
  console.log('form', form)
  const [image, setImage] = useState(null);

  function updateImage(file) {
    setImage(file);
    // setImage(formData);
  }

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
  };

  const postEvent = () => {

    // checker for the empty objects  
    const preparedArray = Object.keys(form.getFieldValue())
    if (preparedArray.length === 0) {
      setAddEvent(true)
      console.log('check')
      return;
    }
    // const time = form.getFieldValue('time').split(',');
    // const startTime1 = time[0];
    // const endTime1 = time[1];
    const eventDate = {
      // date: moment(form.getFieldValue('date')).format('MM/DD/YYYY'), //FIXME not converting
      date: form.getFieldValue('date'),
      startTime: form.getFieldValue('time')[0],
      endTime: form.getFieldValue('time')[1],
      // startTime: moment(form.getFieldValue('time')[0]).format('ha'),
      // endTime: moment(form.getFieldValue('time')[1]).format('ha'),
    };
    console.log('eventDate', eventDate)
    // const preparedDate = {  
    //   date: moment(eventDate.date).format('MM/DD/YYYY'),
    //   startTime: moment(eventDate.startTime).format('ha'),
    //   endTime: moment(eventDate.endTime).format('ha')
    // }

    const formData = new FormData();
    formData.append('files', image);
    formData.append('description', form.getFieldValue('description'));
    formData.append('name', form.getFieldValue('name'));
    formData.append('eventDate', JSON.stringify(eventDate));


    dispatch({
      type: 'event/addEvent',
      payload: {
        body: formData,
      },
    }).then((res) => {
      history.push('/Events')
    })
      .catch((res) => {
        console.log('res :>> ', res);
      });
  };

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image1 = new Image();
    image1.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image1.outerHTML);
  };

  return (
    <div className="content-panel mx-4 md:mx-0 relative ">
      <div className="profile-wrapper">
        <Page
          title="Add Event"
          PrevNextNeeded="N"
          breadcrumbs={
            <Breadcrumbs
              path={[
                {
                  name: 'Dashboard',
                  path: '/dashboard',
                },
                {
                  name: 'Events',
                  path: '/Events',
                },
                {
                  name: 'Add Event',
                  path: '/Events/AddEvents',
                },
              ]}
            />
          }
        >
          <Skeleton loading={false}>
            <Form form={form}>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                  <div className="font-medium text-gray-800 mb-2">Name</div>
                  <Form.Item name="name">
                    <Input
                      size="large"
                      type="text"
                      value={form.getFieldValue('')}
                      placeholder="Enter Name"
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <div className="font-medium text-gray-800 mb-2">Date</div>
                  <Form.Item name="date">
                    <DatePicker size="large" onChange={onChangeDate} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                  <div className="font-medium text-gray-800 mb-2">Time</div>
                  <Form.Item name="time">
                    <TimePicker.RangePicker size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Col>
                <div className="font-medium text-gray-800 mb-2">Description</div>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      message: `Description is required`,
                    },
                  ]}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 6, maxRows: 16 }}
                    placeholder="Add description"
                  />
                </Form.Item>
              </Col>

              <div>
                <div className="font-medium text-gray-800 mt-4 mb-4">Upload Image for Event</div>
              </div>
              <Form.Item>
                <ImgCrop rotate>
                  <Form.Item>
                    <Upload
                      listType="picture"
                      beforeUpload={(content) => {
                        updateImage(content);
                        return false;
                      }}
                      maxCount={1}
                    >
                      <button className="border-dashed  px-28 border-2 border-gray-300  flex  mt-5 py-3 rounded-lg">
                        <AiOutlineUpload style={{ fontSize: '18px' }} />
                        <div className="ml-2"> Upload Image</div>
                      </button>
                    </Upload>
                  </Form.Item>
                </ImgCrop>
                <Modal
                  // visible={previewVisible}
                  // title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: '100%' }}
                  // src={previewImage}
                  />
                </Modal>
              </Form.Item>
              <Modal visible={isModalVisible} onCancel={handleCancel} onOk={handleOk}>
                <img src={onPreview} title="image_url" />
              </Modal>

              <div className="flex justify-end mt-4">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => postEvent()}
                  className="bg-[#FA6210] h-12 px-5 font-semibold hover:bg-[#15538B]  rounded-md text-white"
                >
                  Add Event
                </Button>
              </div>
            </Form>
          </Skeleton>
        </Page>
      </div>
      {addEvent && <div className='absolute  bg-green-500 top-0 shadow-lg rounded-xl flex flex-col items-center justify-center text-3xl text-white font-bold' style={{ height: '50%', width: '50%', top: '30%', left: '20%' }}>
        <span> Please add the events</span>
        <Button
          type="primary"
          size="large"
          onClick={() => setAddEvent(false)}
          className="bg-[#FA6210] h-12 px-5 font-semibold hover:bg-[#15538B] mt-10 rounded-md text-white"
        >
          Go TO Add Events
        </Button>

      </div>}

    </div>
  );
};

export default connect(() => ({}))(AddEvents);
