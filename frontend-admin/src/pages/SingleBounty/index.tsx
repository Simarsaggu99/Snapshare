import React, { useState } from "react";
import {
    Button,
    Form,
    Select,
    Input,
    InputNumber,
    message,
    Radio,
    DatePicker,
    TimePicker,
    Col,
    Row
} from "antd";
import moment from "moment";
import Page from "@/components/Page";
import Breadcrumbs from "@/components/BreadCrumbs";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const getCountriesList = [
    { country: "India", id: Math.random() },
    { country: "Nepal", id: Math.random() },
    { country: "Srilanka", id: Math.random() }
];
const getAgeGroup = [
    { value: "20 - 30", id: Math.random() },
    { value: "30 - 40", id: Math.random() },
    { value: "40 - 50", id: Math.random() },
];
const rewardCoins = [
    { value: "1MC", id: Math.random() },
    { value: "2MC", id: Math.random() },
    { value: "3MC", id: Math.random() },
    { value: "4MC", id: Math.random() },
    { value: "5MC", id: Math.random() },
    { value: "6MC", id: Math.random() },
    { value: "7MC", id: Math.random() },
    { value: "8MC", id: Math.random() },
    { value: "9MC", id: Math.random() },
    { value: "10MC", id: Math.random() },
];
const timetaken = [
    { value: "1 time", id: Math.random() },
    { value: "2 time", id: Math.random() },
    { value: "3 time", id: Math.random() },
    { value: "4 time", id: Math.random() },
    { value: "5 time", id: Math.random() },
    { value: "6 time", id: Math.random() },
    { value: "7 time", id: Math.random() },
    { value: "8 time", id: Math.random() },
    { value: "9 time", id: Math.random() },
    { value: "10 time", id: Math.random() },
];



const SingleBounty = () => {
    const [programSelect, setProgramSelect] = useState("");
    const [mcqInput, setMcqInput] = useState("");
    const [mcqList, setMcqList] = useState([]);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log("values", values);
    };

    const onSelectDate = (date, dateString) => {
        console.log(date, dateString);
    };
    const onTimeSelect = (time, timeString) => {
        console.log(time, timeString);
    };
    const addListOfMcq = (field, value) => {
        //checker to chech the length of mcqList //FIXME improve logic
        if (mcqInput?.length < 4) {
            message.error("Answer should be of 4 characters");
            return;
        }

        if (mcqList?.length < 4) {
            console.log("first");
            setMcqList((prevList) => [...prevList, mcqInput]);
            setMcqInput("");
            // return;
        }
        if (mcqList?.length === 3) {
            setMcqInput("");
            message.success("answer added successfully");
        }
    };

    console.log("mcqInput", mcqInput);
    return (
        <Page
            title="DASHBOARD"
            PrevNextNeeded="N"
            breadcrumbs={
                <Breadcrumbs
                    path={[
                        {
                            name: "Dashboard",
                            path: "/dashboard"
                        },
                        {
                            name: "Manage-Bounty",
                            path: "/manage-bounties"
                        },
                        {
                            name: "Create Bounty",
                            path: "/manage-bounties/creating-bounty-program"
                        }
                    ]}
                />
            }
        >
            <div className=" mx-auto " style={{ width: "60%", background: "white", borderRadius: "10px" }}>
                <div
                    className="w-full pt-5  "
                    style={{ borderRadius: "10px 10px 0px 0px" }}
                >
                    <div className="flex justify-end px-10 ">
                        <a href="">
                            <CloseCircleOutlined
                                key="link"
                                href="./CreateBounty"
                                style={{ fontSize: "32px", color: "White" }}
                            />
                        </a>
                    </div>

                    <div className="flex px-10 pb-2">
                        <h2 style={{ color: "White" }}>Create a bounty</h2>
                    </div>
                </div>

                <div className="">
                    <Form form={form} name="bountyForm" onFinish={onFinish}>
                        <Row gutter={[16, 16]}>
                            <Col span={8} >
                                <div className="p-4">
                                    <div className=" ">
                                        <h4>Program Name</h4>
                                        <Form.Item
                                            name="Question"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Kartik singh"
                                                }
                                            ]}
                                        >
                                            <Input placeholder="What is your name?" />
                                        </Form.Item>
                                    </div>
                                    <div className="">

                                        <h4>Write a Question/Survey </h4>
                                        <Form.Item
                                            name="Questions"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select the question"
                                                }
                                            ]}
                                        >
                                            <Input placeholder="What is your name?" />
                                        </Form.Item>
                                    </div>
                                    <div className="">
                                        <h4>Select Time </h4>
                                        <Form.Item>
                                            <TimePicker
                                                name="selectTime"
                                                style={{ width: "100%" }}
                                                onChange={onTimeSelect}
                                                defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                                            />{" "}
                                        </Form.Item>
                                    </div>
                                </div>
                            </Col>


                            <Col span={8} >
                                <div className="p-4">
                                    <div className="">
                                        <h4>Select Bounty Type </h4>
                                        <Form.Item
                                            name="Bounty"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: " Please select bounty type"
                                                }
                                            ]}
                                        >
                                            <Select defaultValue="select">
                                                {getAgeGroup.map((elem, idx) => (
                                                    <Option value={elem.value} key={elem.id}>
                                                        {elem.value}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className="">
                                        <h4>Answer type</h4>
                                        <Form.Item
                                            name="Answer"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Text/MCQ"
                                                }
                                            ]}
                                        >
                                            <Select defaultValue="select">
                                                {getAgeGroup.map((elem, idx) => (
                                                    <Option value={elem.value} key={elem.id}>
                                                        {elem.value}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className="">
                                        <h4>Ends in</h4>
                                        <Form.Item>
                                            <TimePicker
                                                name="selectTime"
                                                style={{ width: "100%" }}
                                                onChange={onTimeSelect}
                                                defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                                            />{" "}
                                        </Form.Item>
                                    </div>
                                </div>
                            </Col>

                            <Col span={8} >
                                <div className="p-4">
                                    <div className="">
                                        <h4>Coin To Reward</h4>
                                        <Form.Item
                                            name="coins"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select the coins"
                                                }
                                            ]}
                                        >
                                            <Select defaultValue="select" size="medium">
                                                {rewardCoins.map((elem, idx) => (
                                                    <Option value={elem.value} key={elem.id}>
                                                        {elem.value}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                    <div className="">
                                        <h4>Start date </h4>
                                        <Form.Item
                                            name="date"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select date"
                                                }
                                            ]}
                                        >
                                            <div defaultValue="select">
                                                <DatePicker
                                                    style={{ width: "100%" }}
                                                    name="selectDate"
                                                    onChange={onSelectDate}
                                                />
                                            </div>
                                        </Form.Item>
                                    </div>

                                    <div className="">
                                        <h4>No. of times it can be taken</h4>
                                        <Form.Item
                                            name="Time taken"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select the items"
                                                }
                                            ]}
                                        >
                                            <Select defaultValue="select">
                                                {timetaken.map((elem, idx) => (
                                                    <Option value={elem.value} key={elem.id}>
                                                        {elem.value}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>
                            </Col>

                            <div className="flex justify-end px-10 py-8">
                                <Button htmlType="submit" type="primary">
                                    Create
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </div>
            </div>
        </Page>
    );
};

export default SingleBounty;
