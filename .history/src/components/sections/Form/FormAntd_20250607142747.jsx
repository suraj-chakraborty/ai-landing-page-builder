import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

const FormAntd = ({ fields = [], onFinish, onFinishFailed}) => {
  return (
     <Form
      name="dynamic_form"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {fields.map((field) => {
        const { label, name, type, rules } = field;
        const Component = inputTypeToComponent[type] || Input;

        return (
          <Form.Item
            key={name}
            label={type !== 'checkbox' ? label : null}
            name={name}
            valuePropName={type === 'checkbox' ? 'checked' : undefined}
            rules={rules}
          >
            {type === 'checkbox' ? (
              <Checkbox>{label}</Checkbox>
            ) : (
              <Component />
            )}
          </Form.Item>
        );
      })}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAntd;
