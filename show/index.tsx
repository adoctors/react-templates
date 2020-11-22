/*
 * @Author: kl
 * @email: qkeliang@163.com
 * @Description: react-hooks-table-drawer-detail
 */

import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { history } from "umi";
import { LeftOutlined } from "@ant-design/icons";
import { IObject } from "@/models/connect";
import { RButton } from "rcrai-rainbow";
import { getUrlParams } from "@/utils/utils";

import styles from "./style.less";

const { TabPane } = Tabs;

export default (props) => {
  const [tabActiveKey, setTabActiveKey] = useState<"info" | "progess">(
    "progess"
  );
  const [detail, setDetail] = useState<IObject>({});

  const currentId = getUrlParams(props, "current_id");

  useEffect(() => {}, []);

  return (
    <div className={styles.DetailWrap}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <LeftOutlined
            className={styles.goBackIcon}
            onClick={() => {
              history.goBack();
            }}
          />
          <div>
            <div className={styles.pageTitle}>{"Detail.name" || "-"}</div>
            <div className={styles.subTitle}>id：{currentId || "-"}</div>
          </div>
        </div>
        <div>
          <RButton
            disabled={detail.progress === "started"}
            type="primary"
            tooltipParams={{
              title: detail.progress === "started" ? "进行中，无法编辑" : "",
            }}
          >
            编辑
          </RButton>
          <RButton
            disabled={detail.progress === "started"}
            tooltipParams={{
              title: detail.progress === "started" ? "禁用，无法删除" : "",
            }}
          >
            删除
          </RButton>
        </div>
      </div>
      <Tabs
        defaultActiveKey={tabActiveKey}
        onChange={(activeKey: "info" | "progess"): void => {
          setTabActiveKey(activeKey);
        }}
      >
        <TabPane tab="信息" key="info" />
        <TabPane tab="进度" key="progess" />
      </Tabs>

      {tabActiveKey === "info" ? (
        <div>info</div>
      ) : (
        <div className={styles.tableWrapper}>progess</div>
      )}
    </div>
  );
};
