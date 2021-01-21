/*
 * @Author: kl
 * @email: qkeliang@163.com
 * @Description: react-hooks-table-drawer
 */
import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, InputNumber, Tooltip, Spin } from "antd";
import { RSelect, RSingleSelect } from "rcrai-rainbow";
import { requestApi } from "@/utils/request";
import { InfoCircleOutlined } from "@ant-design/icons";
import { handleType, IObject } from "../../index";

import styles from "./style.less";

const { Option } = Select;
const { TextArea } = Input;

// 中文，中文全角字符，英文，数字，中划线，下划线
const nonSpecialCharacters = /^[\x20-\x7E\u4e00-\u9fa5\t\w\-·=【】、；’‘，。~！￥…（）—「」|：“”《》？]+$/;

interface IProps {
  /** 当前drawer操作类型*/
  drawerHandleType: handleType;
  /** 当前要编辑的项*/
  currentItem: IObject;
  /** 提交成功的回调*/
  onSubmitOk: () => void;
  /** 取消的回调*/
  onCancel: () => void;
}

export default (props: IProps) => {
  const { drawerHandleType, currentItem, onSubmitOk, onCancel } = props;
  const [form] = Form.useForm();
  const [descriptionLen, setDescriptionLen] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (drawerHandleType === "create") {
      form.setFieldsValue({
        interval: 10,
      });
    }
    if (drawerHandleType === "edit") getDetail();
  }, []);

  const getDetail = async (): Promise<void> => {
    console.log("getDetail");
    return;
    const {
      data: { code, data },
    } = await requestApi({
      namespace: "namespace",
      apiName: "getDetail",
      reqType: "GET",
      placeholderData: {
        id: currentItem.id,
      },
    });

    if (code === 0) {
      form.setFieldsValue({
        name: "",
        list: "",
        interval: 0,
        description: "",
      });

      setDescriptionLen("".length);
    }
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const onSubmit = (): void => {
    form.validateFields().then((vals) => {
      setLoading(true);
      if (drawerHandleType === "create") {
        onSubmitOk();
      }

      if (drawerHandleType === "edit") {
        onSubmitOk();
      }
    });
  };

  return (
    <div className={styles.DrawerBodyWrap}>
      <Spin spinning={loading}>
        <Form
          {...formItemLayout}
          form={form}
          colon={false}
          labelAlign="left"
          className={styles.formWrap}
        >
          <Form.Item
            label="Input"
            name="Input"
            rules={[
              { required: true, message: "请输入名称" },
              {
                max: 20,
                message: "最大长度为20",
              },
              {
                pattern: nonSpecialCharacters,
                message: "不支持特殊字符",
              },
            ]}
          >
            <Input
              placeholder="名称最大长度为20，不支持特殊字符"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label={
              <span>
                Select
                <Tooltip title="下拉单选列表">
                  <InfoCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </span>
            }
            name="Select"
            rules={[{ required: true, message: "请选择" }]}
          >
            <Select
              disabled={drawerHandleType !== "create"}
              placeholder="请选择"
              style={{ width: "100%" }}
            >
              {[].map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="RSingleSelect"
            name="RSingleSelect"
            rules={[{ required: true, message: "请选择" }]}
          >
            <RSingleSelect
              placeholder="请选择"
              data={[]}
              searchField={["name"]}
              valueField="id"
              // onChange={onChange}
            />
          </Form.Item>

          <Form.Item
            label="RSelect"
            name="RSelect"
            rules={[{ required: true, message: "请选择" }]}
          >
            <RSelect data={[]} placeholder="请选择" maxTagCount={1} />
          </Form.Item>

          <Form.Item
            label={
              <span>
                <span className={styles.itemRequired}>*</span>
                InputNumber
              </span>
            }
          >
            <Form.Item
              name="InputNumber"
              rules={[
                { required: true, message: "请输入时间间隔" },
                { type: "number", max: 999, message: "最大999" },
              ]}
              noStyle
            >
              <InputNumber min={0} placeholder="请输入" />
            </Form.Item>
            <span className="ant-form-text">分钟</span>
          </Form.Item>

          <Form.Item label="&nbsp;&nbsp;&nbsp;TextArea" name="description">
            <TextArea
              onChange={(e) => {
                e.persist();
                if (e.target.value) setDescriptionLen(e.target.value.length);
              }}
              maxLength={500}
              rows={4}
              placeholder="请输入描述"
              allowClear
            />
          </Form.Item>
        </Form>
        <div className={styles.footerWrap}>
          <Button type="primary" onClick={onSubmit} loading={loading}>
            保存
          </Button>
          <Button style={{ marginRight: 12 }} onClick={onCancel}>
            取消
          </Button>
        </div>
      </Spin>
    </div>
  );
};
