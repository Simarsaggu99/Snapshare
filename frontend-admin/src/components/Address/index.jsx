/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import { AutoComplete, Col, Form, Input, Row, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import {
  CaretDownOutlined
} from '@ant-design/icons';
import Countries from './Countries';

const { Option } = Select;

// eslint-disable-next-line no-undef
const map = new google.maps.Map(document.getElementById('map'));
// eslint-disable-next-line no-undef
const googleInstance = new google.maps.places.AutocompleteService();
// eslint-disable-next-line no-undef
const placesService = new google.maps.places.PlacesService(map);

const Address = (props) => {
  const { form, type = 'address', required = false } = props;

  const [suggestedAddress, setSuggestedAddress] = useState([]);

  const action = (text) => {
    googleInstance.getPredictions({ input: text }, (predictions) => {
      setSuggestedAddress(predictions);
    });
  };
  const debounceSearch = debounce(action, 400);

  const [provinces, setProvinces] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('United States (USA)');

  const componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'short_name',
    postal_code: 'short_name',
  };

  useEffect(() => {
    const foundCountry = Countries.filter((c) => `${c.code})` === selectedCountry.split('(')[1]);
    setProvinces(foundCountry.length > 0 ? foundCountry[0].provinces : []);
  }, []);

  const getAddressFieldsFromGoogle = async (placeId, cb) => {
    let finalData = {};
    placesService.getDetails({ placeId }, ({ address_components }) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < address_components.length; i++) {
        const addressType = address_components[i].types[0];
        if (componentForm[addressType]) {
          const val = address_components[i][componentForm[addressType]];
          finalData = { ...finalData, [addressType]: val };
        }
        if (address_components.length - 1 === i) {
          cb(finalData);
        }
      }
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      [type]: {
        country_code: selectedCountry,
      },
    });
  }, []);

  return (
    <div>
      <Form.Item
        name={[type, 'address_line_1']}
        label={<span className="formLabel">Address line 1</span>}
        rules={[{ required, message: 'The address is required!' }]}
      >
        <AutoComplete
          onSearch={debounceSearch}
          {...props}
          dataSource={
            suggestedAddress &&
            suggestedAddress.map(({ place_id, description }) => ({
              value: JSON.stringify({ id: place_id, description }),
              text: description,
            }))
          }
          onSelect={async (e) => {
            // console.log(`ob`);
            const obj = JSON.parse(e);
            getAddressFieldsFromGoogle(obj.id, (addressFieldsByGoogle) => {
              const foundCountry = Countries?.filter((c) => c.id === addressFieldsByGoogle.country);
              const foundProvince =
                Array.isArray(foundCountry) &&
                foundCountry.length > 0 &&
                foundCountry[0]?.provinces.find(
                  (province) =>
                    province.geoId === addressFieldsByGoogle.administrative_area_level_1,
                );
              setSelectedCountry(`${foundCountry?.[0]?.name} (${foundCountry?.[0]?.code})`);
              const sCode = foundProvince
                ? `${foundProvince.geoName} ${foundProvince.geoId}`
                : undefined;
              if (!foundProvince) {
                setProvinces([]);
              }
              form.setFieldsValue({
                [type]: {
                  city: addressFieldsByGoogle.locality,
                  postal_code: addressFieldsByGoogle.postal_code,
                  address_line_1: `${addressFieldsByGoogle.street_number || ''}, ${addressFieldsByGoogle.route || ''
                    }`,
                  address_line_2: '',
                  country_code: foundCountry?.length
                    ? `${foundCountry?.[0]?.name} (${foundCountry?.[0]?.code})`
                    : undefined,
                  state_code: sCode,
                },
              });

              setProvinces((Countries && Countries[0]?.provinces) || []);
              setSelectedCountry('United States (USA)');
            });
          }}
        >
          <Input placeholder="Street, House No." size="large" />
        </AutoComplete>
      </Form.Item>
      {/* <Form.Item
        name={[type, 'address_line_2']}
        label={<span className="formLabel">Address line 2</span>}
      >
        <Input type="text" placeholder="Suite, Building, Apt." size="large" />
      </Form.Item> */}
      {/* <Form.Item name={[type, 'region']} label={<span className="formLabel">Region</span>}>
        <Input type="text" placeholder="Region" size="large" />
      </Form.Item> */}
      <Row gutter={[12, 0]}>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name={[type, 'country_code']}
            label={<span className="formLabel">Country</span>}
          >
            <Select
              showSearch
              allowClear
              placeholder="Select your country"
              size="large"
              onClear={() => {
                setProvinces([]);
              }}
              suffixIcon={<CaretDownOutlined style={{ color: 'rgba(0,0,0,.45)', fontSize: "1rem" }} />}
              onSelect={(countryValue) => {
                form.setFieldsValue({ address: { stateCode: '' } });
                setSelectedCountry(countryValue);
                const foundCountry = Countries.filter(
                  (c) => `${c.code})` === countryValue.split('(')[1],
                );
                form.setFieldsValue({ [type]: { state_code: undefined } });
                setProvinces(foundCountry.length > 0 ? foundCountry[0].provinces : []);
              }}
            >
              {Countries.length > 0
                ? Countries.reverse().map((c) => (
                  <Option key={c.code} value={`${c.name} (${c.code})`}>
                    {c.name} ({c.code})
                  </Option>
                ))
                : ''}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item name={[type, 'state_code']} label={<span className="formLabel">State</span>}>
            <Select
              allowClear
              showSearch
              size="large"
              placeholder="Select your state"
              notFoundContent="No States Found"
              suffixIcon={<CaretDownOutlined style={{ color: 'rgba(0,0,0,.45)', fontSize: "1rem" }} />}
              getPopupContainer={(node) => node.parentNode}
            >
              {provinces.map((province) => (
                <Option key={province.geoId} value={`${province.geoName} ${province.geoId}`}>
                  {province.geoName} ({province.geoCode})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item name={[type, 'city']} label={<span className="formLabel">City</span>}>
            <Input size="large" type="text" placeholder="Fresno" />
          </Form.Item>
        </Col>
        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name={[type, 'postal_code']}
            label={<span className="formLabel">Zip code</span>}
          >
            <Input size="large" placeholder="Zip code" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ common }) => ({
  countries: common.countriesList,
}))(Address);
