import React, { useEffect, useState } from 'react';
import {
  Form,
  Skeleton,
  Row,
  Col,
  Input,
  Upload,
  DatePicker,
  notification,
  Button,
  TimePicker,
} from 'antd';
import { AiOutlineUpload } from 'react-icons/ai';
import { history } from 'umi'
import { Modal } from 'antd';

import axios from 'axios';

import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import ImgCrop from 'antd-img-crop';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useParams, connect } from 'umi';
import moment from 'moment';

const EditEvents = ({ dispatch }) => {
  const { eventId } = useParams()
  console.log('eventId', eventId)
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  const [getLoading, setGetLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [year, setYear] = useState(null);

  const [image, setImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList: newFileList }) => {
    console.log('fileList', fileList)
    setFileList(newFileList);
  };
  console.log('fileList', fileList)
  console.log('form', form)


  // const createURL = (file) => {
  //   showModal();
  //   const newURL = {
  //     ...file,
  //     url: URL.createObjectURL(file),
  //   };
  //   setOnPreview(newURL.url);
  // };
  // function updateImage(file) {
  //   setImage((prev) => [...prev, file]);
  // }
  // const showModal = () => {
  //   setIsModalVisible(true);
  // };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleUpdatedEvent = (values) => {
    console.log('savEevents', values)
    // const formData = new FormData();
    const eventData = {
      date: moment(values.Date).format('DD/MM/YYYY'),
      startTime: values.time[0],
      endTime: values.time[1],
    }
    console.log('eventData', eventData)
    dispatch({
      type: 'event/updateEvent',
      payload: {
        pathParams: { id: eventId },
        body: {
          name: values.Name,
          description: values.description,
          eventDate: JSON.stringify(eventData),
          filesArray: fileList 
          // time: 
          // name:form.getFieldValue, description, type, eventDate
        }
      }
    }).then((res) => {
      console.log('res', res)
      history.push('/events')
    }).catch((err) => {
      console.log('err', err)

    })

    // formData.append("files", ...image);
    // formData.append("title", form.getFieldValue("title"));
    // formData.append("type", form.getFieldValue("type"));
    // formData.append("year", year);

    // axios({
    //   method: "post",
    //   url: "/awards/create",
    //   data: formData,
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     authorization: localStorage.getItem("accessToken"),
    //   },
    // })
    //   .then((resp) => {
    //     notification.success({ message: "Added successfully!" });
    //     form.resetFields();
    //     setImage([]);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  useEffect(() => {
    if (eventId) {
      dispatch({
        type: 'event/getSingleEvent',
        payload: {
          pathParams: { id: eventId }
        }
      }).then((res) => {
        // console.log('res', res.data)
        // const start = moment(res.data.eventDate.endTime).format('ha')
        // console.log('start', start)
        form.setFieldsValue({
          Name: res?.data?.name,
          description: res?.data.description,
          Date: moment(res?.data?.eventDate?.date),
          time: [moment(res.data.eventDate.startTime), moment(res.data.eventDate.endTime)]
        })

      })

    }

  }, [eventId])

  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
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

    // const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <div className="content-panel mx-4 md:mx-0">
      <div className="profile-wrapper">
        <Page
          title="Update Event"
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
                  name: 'Update Event',
                  path: '/Events/EditEvents',
                },
              ]}
            />
          }
        >
          <Skeleton loading={getLoading}>
            <Form form={form} onFinish={(val) => handleUpdatedEvent(val)}>
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                  <div className="font-medium text-gray-800 mb-2">Name</div>
                  <Form.Item name="Name">
                    <Input
                      size="large"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter Name"
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <div className="font-medium text-gray-800 mb-2">Date</div>
                  <Form.Item
                    name="Date"
                    rules={[
                      {
                        required: true,
                        message: `Type is required`,
                      },
                    ]}
                  >
                    <DatePicker size="large" onChange={onChangeDate} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                  <div className="font-medium text-gray-800 mb-2">Time</div>
                  <Form.Item
                    name="time"
                    rules={[
                      {
                        required: true,
                        message: `Type is required`,
                      },
                    ]}
                  >
                    <TimePicker.RangePicker onChange={
                      (value) => {
                        console.log('value', value)
                      }
                    } size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Col>
                <div className="font-medium text-gray-800 mb-2">Description</div>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      required: true,
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
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                  >
                    {fileList.length < 5 && '+ Upload'}
                  </Upload>
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
                  htmlType='submit'
                  // onClick={() => onFinish()}
                  className="bg-[#FA6210] h-12 px-5 font-semibold hover:bg-[#15538B]  rounded-md text-white"
                >
                  Update Event
                </Button>
              </div>
            </Form>
          </Skeleton>
        </Page>
      </div>
    </div>
  );
};

export default connect(() => ({

}))(EditEvents);
