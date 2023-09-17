import React from "react";
import { useState } from "react";
import Link from "next/link";
import { useContactUs } from "@/hooks/contactUS/mutation";
import { notifyError, notifySuccess } from "../UIComponents/Notification";
const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    queryType: "",
    message: "",
  });
  const [errors, setErrors]: any = useState({});
  const contactUs = useContactUs();

  const handleFirstname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const regexName = /^[a-zA-Z][a-zA-Z\s]*$/;
    if (!inputValue) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        name: "Name is required",
      }));
    } else {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        name: "",
      }));
    }
    setForm((prevForm: any) => ({
      ...prevForm,
      name: inputValue,
    }));
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!inputValue) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        email: "Email is required",
      }));
    } else if (!regexEmail.test(inputValue)) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        email: "Email is not a valid!",
      }));
    } else {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        email: "",
      }));
    }
    setForm((prevForm: any) => ({
      ...prevForm,
      email: inputValue,
    }));
  };
  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (!inputValue) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        queryType: "Query type is required",
      }));
    } else {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        queryType: "",
      }));
    }
    setForm((prevForm: any) => ({
      ...prevForm,
      queryType: inputValue,
    }));
  };
  const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!inputValue) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        message: "Message is required",
      }));
    } else {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        message: "",
      }));
    }
    setForm((prevForm: any) => ({
      ...prevForm,
      message: inputValue,
    }));
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    let errors: any = {};
    const regexName = /^[a-zA-Z]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regexphone =
      /^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/i;
    if (!form.name) {
      errors.name = "Name is required";
    }
    // else if (!regexName.test(form.name)) {
    //   errors.name = "Name format is not a valid!";
    // }
    if (!form.email) {
      errors.email = "Email is required";
    } else if (!regexEmail.test(form.email)) {
      errors.email = "Email format is not a valid !";
    }
    if (!form.queryType) {
      errors.queryType = "Query type is required";
    } else if (form.queryType === "queryType") {
      errors.queryType = "Query type is required";
    }
    if (!form.message) {
      errors.message = "Message is required";
    }
    setErrors(errors);
    // Submit form if there are no errors
    if (Object.keys(errors).length === 0) {
      contactUs
        ?.mutateAsync({
          body: {
            name: form?.name,
            email: form?.email,
            queryType: form?.queryType,
            message: form?.message,
          },
        })
        ?.then((response: any) => {
          notifySuccess({
            message: "Thanks For Contacting Us!",
          });
          setForm({ name: "", email: "", queryType: "queryType", message: "" });
        })
        ?.catch((error: any) => {
          notifyError({
            message: "OPPS something went wrong. Please try again.",
          });
        });
    }
  };
  return (
    <div className="flex h-fit w-full justify-center">
      <div>
        <div
          className=" mb-5 flex items-center justify-center rounded-md bg-gray-200 py-2 text-center text-[20px] text-gray-700 shadow-md"
          style={{ fontWeight: 500 }}
        >
          CONTACT US
        </div>
        {/* ---------------------------------------------------------------------------------------------------------------------- */}
        <div className="   grid items-center  justify-center gap-4   ">
          <div className=" w-[100%]  px-2   ">
            <div className=" flex flex-col gap-7 text-[18px] text-gray-800">
              <div className="text-center text-3xl font-semibold">
                Get In Touch
              </div>
            </div>
            <div className="mt-10">
              <div className="">
                <input
                  onChange={handleFirstname}
                  placeholder="Enter your name*"
                  value={form.name}
                  className=" w-[100%] rounded-lg border-none bg-gray-200 focus:ring-0 "
                  type="text"
                />
                {errors.name && (
                  <div className="text-red-600">{errors.name}</div>
                )}
              </div>
            </div>
            <div className="mt-4 ">
              <input
                className=" w-[100%] rounded-lg border-none bg-gray-200 focus:ring-0 "
                onChange={handleEmailChange}
                placeholder="Enter your email*"
                value={form.email}
                type="email"
              />
              {errors.email && (
                <div className="text-red-600">{errors.email}</div>
              )}
            </div>
            <div className="mt-4 ">
              <select
                value={form.queryType}
                onChange={(e: any) => handlePhone(e)}
                className=" w-[100%] rounded-lg border-none bg-gray-200 focus:ring-0 "
              >
                <option value={"queryType"} className=" hidden text-gray-100">
                  Select query type
                </option>
                <option value={"general"}>General</option>
                <option value={"business"}>Business</option>
              </select>
              {errors.queryType && (
                <div className="text-red-600">{errors.queryType}</div>
              )}
            </div>
            <div className=" mt-4 ">
              <textarea
                // @ts-ignore: Unreachable code error
                onChange={handleMessage}
                placeholder="Enter message*"
                value={form.message}
                className=" h-36 w-[100%] resize-none rounded-lg border-none bg-gray-200 focus:ring-0 "
              ></textarea>
            </div>
            {errors.message && (
              <div className="mb-5 mt-0 text-red-600">{errors.message}</div>
            )}
            <div className=" ">
              <button
                onClick={handleSubmit}
                className="   my-5 rounded-lg bg-primary-600 px-10 py-2 font-bold text-white"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactUs;
