import React, { useState } from 'react';
import { Button, Input, Select, Card, Space, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const defaultField = () => ({
  key: '',
  type: 'String',
  children: [],
});

const buildSchema = (fields) => {
  const schema = {};
  fields.forEach(field => {
    if (field.type === 'Nested') {
      schema[field.key || 'unnamed'] = buildSchema(field.children);
    } else if (field.type === 'String') {
      schema[field.key || 'unnamed'] = 'Sample Text';
    } else if (field.type === 'Number') {
      schema[field.key || 'unnamed'] = 0;
    }
  });
  return schema;
};

const SchemaBuilder = () => {
  const [fields, setFields] = useState([defaultField()]);

  const handleChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    if (key === 'type' && value === 'Nested' && newFields[index].children.length === 0) {
      newFields[index].children = [defaultField()];
    }
    setFields(newFields);
  };

  const handleAddField = (parentIndex = null) => {
    if (parentIndex !== null) {
      const newFields = [...fields];
      newFields[parentIndex].children.push(defaultField());
      setFields(newFields);
    } else {
      setFields([...fields, defaultField()]);
    }
  };

  const handleDelete = (index, parentIndex = null) => {
    if (parentIndex !== null) {
      const newFields = [...fields];
      newFields[parentIndex].children.splice(index, 1);
      setFields(newFields);
    } else {
      const newFields = [...fields];
      newFields.splice(index, 1);
      setFields(newFields);
    }
  };

  const renderFields = (fieldsList, parentIndex = null) => {
    return fieldsList.map((field, index) => (
      <Card
        key={index}
        style={{ marginBottom: '10px' }}
        size="small"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Input
              placeholder="Key"
              value={field.key}
              onChange={(e) =>
                parentIndex !== null
                  ? updateNestedFieldKey(parentIndex, index, e.target.value)
                  : handleChange(index, 'key', e.target.value)
              }
            />
            <Select
              value={field.type}
              onChange={(value) =>
                parentIndex !== null
                  ? updateNestedFieldType(parentIndex, index, value)
                  : handleChange(index, 'type', value)
              }
              style={{ width: 120 }}
            >
              <Option value="String">String</Option>
              <Option value="Number">Number</Option>
              <Option value="Nested">Nested</Option>
            </Select>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                parentIndex !== null
                  ? handleDelete(index, parentIndex)
                  : handleDelete(index)
              }
            />
          </Space>
          {field.type === 'Nested' && (
            <div style={{ paddingLeft: 20 }}>
              {renderFields(field.children, parentIndex !== null ? parentIndex : index)}
              <Button
                icon={<PlusOutlined />}
                onClick={() =>
                  parentIndex !== null
                    ? handleAddNestedField(parentIndex, index)
                    : handleAddNestedField(index)
                }
              >
                Add Nested Field
              </Button>
            </div>
          )}
        </Space>
      </Card>
    ));
  };

  const updateNestedFieldKey = (parentIndex, childIndex, newKey) => {
    const newFields = [...fields];
    newFields[parentIndex].children[childIndex].key = newKey;
    setFields(newFields);
  };

  const updateNestedFieldType = (parentIndex, childIndex, newType) => {
    const newFields = [...fields];
    newFields[parentIndex].children[childIndex].type = newType;
    if (newType === 'Nested') {
      newFields[parentIndex].children[childIndex].children = [defaultField()];
    } else {
      newFields[parentIndex].children[childIndex].children = [];
    }
    setFields(newFields);
  };

  const handleAddNestedField = (parentIndex, childIndex = null) => {
    const newFields = [...fields];
    if (childIndex !== null) {
      newFields[parentIndex].children[childIndex].children.push(defaultField());
    } else {
      newFields[parentIndex].children.push(defaultField());
    }
    setFields(newFields);
  };

  return (
    <Tabs defaultActiveKey="builder">
      <TabPane tab="Schema Builder" key="builder">
        {renderFields(fields)}
        <Button icon={<PlusOutlined />} type="primary" onClick={() => handleAddField()}>
          Add Field
        </Button>
      </TabPane>
      <TabPane tab="JSON Preview" key="json">
        <pre>{JSON.stringify(buildSchema(fields), null, 2)}</pre>
      </TabPane>
    </Tabs>
  );
};

export default SchemaBuilder;
