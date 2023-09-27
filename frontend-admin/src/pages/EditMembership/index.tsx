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

const EditMembership = ({ dispatch }) => {
    const { id } = useParams()
    console.log('membershipid', id)
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
    // console.log('fileList', fileList)
    // console.log('form', form)


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
        console.log('form-value', values)
        const day = values.expiry + 'd';
        // const formData = new FormData();
        const data={
               price: values.price,
                    key: values.Name,
                    expiry: values.expiry 
        }

        dispatch({
            type: 'membership/updateMemberShipPlans',
            payload: {
                pathParams: { id: id },
                body: data
                    // price: values.price,
                    // key: values.Name,
                    // expiry: values.expiry 
                    // price, license, key, expiry
                
            }
        }).then((res) => {
            console.log('updateMemberShipPlans', res.plans)
            history.push('/membership')
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
        if (id) {
            dispatch({
                type: 'membership/getSingleMemberShipPlan',
                payload: {
                    pathParams: { id: id }
                }
            }).then((res) => {
                console.log('res', res.plans)
                // const start = moment(res.data.eventDate.endTime).format('ha')
                // console.log('start', start)
                form.setFieldsValue({
                    Name: res.plans?.key,
                    price: parseInt(res?.plans?.price?.slice(1)),
                    expiry: parseInt(res?.plans?.expiry?.slice(0, -1))
                    // description: res?.data.description,
                    // Date: moment(res?.data?.eventDate?.date),
                    // time: [moment(res.data.eventDate.startTime), moment(res.data.eventDate.endTime)]
                })

            })

        }

    }, [id])

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
        // image.src = src;
        // const imgWindow = window.open(src);
        // imgWindow?.document.write(image.outerHTML);
    };
    return (
        <div className="content-panel mx-4 md:mx-0">
            <div className="profile-wrapper">
                <Page
                    title="Update Event"
                    PrevNextNeeded="N"
                // breadcrumbs={
                // <Breadcrumbs
                //     path={[
                //         {
                //             name: 'Dashboard',
                //             path: '/dashboard',
                //         },
                //         {
                //             name: 'Membership',
                //             path: '/Membership',
                //         },
                //         {
                //             name: 'Update Membership',
                //             path: '/membership/editDetails',
                //         },
                //     ]}
                // />
                // }
                >
                    <Skeleton loading={getLoading}>
                        <Form form={form} onFinish={(val) => handleUpdatedEvent(val)}>
                            <div className="font-medium text-gray-800 mb-2">Name</div>
                            <Form.Item name="Name" rules={[
                                {
                                    required: true,
                                    message: `Type is required`,
                                },
                            ]}>
                                <Input
                                    size="large"
                                    type="text"
                                    // value={title}
                                    // onChange={('name', e) => setTitle('name', e.target.value)}
                                    placeholder="Enter Plan Name"
                                />
                            </Form.Item>

                            <div className="font-medium text-gray-800 mb-2">Price</div>
                            <Form.Item name="price" rules={[
                                {
                                    required: true,
                                    message: `Type is required`,
                                },
                            ]}>
                                <Input
                                    size="large"
                                    type="number"
                                    // value={title}
                                    // onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter Price"
                                />
                            </Form.Item>
                            {/* <div className="font-medium text-gray-800 mb-2">Offer</div>
                            <Form.Item name="offer" rules={[
                                {
                                    required: true,
                                    message: `Type is required`,
                                },
                            ]}>

                                <Input
                                    size="large"
                                    type="text"
                                    // value={title}
                                    // onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter Offer"
                                />
                            </Form.Item> */}
                            {/* <div className="font-medium text-gray-800 mb-2">Coupon</div>
                            <Form.Item name="coupon" rules={[
                                {
                                    required: true,
                                    message: `Type is required`,
                                },
                            ]}>

                                <Input
                                    size="large"
                                    type="number"
                                    value={`12`}
                                    // onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter Coupon Number"
                                />
                            </Form.Item> */}
                            <div className="font-medium text-gray-800 mb-2">Expiry</div>
                            <Form.Item name="expiry" rules={[
                                {
                                    required: true,
                                    message: `Type is required`,
                                },
                            ]}>

                                <Input
                                    size="large"
                                    type="number"
                                    // value={title}
                                    // onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter Expiry"
                                />
                            </Form.Item>

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
        </div >
    );
};

export default connect(() => ({

}))(EditMembership);
