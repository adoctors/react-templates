/*
 * @Author: kl
 * @email: qkeliang@163.com
 * @Description: react-hooks-page
 */

import React, { useState, useEffect } from "react";
import { message } from "antd";
import { requestApi } from "@/utils/request";
import { RTable, RTextTooltip, RPagination } from "rcrai-rainbow";
import styles from "./style.less";

export default (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    // getReq();
  }, []);

  const getReq = async (): Promise<void> => {
    setLoading(true);
    const {
      data: { code, data },
    } = await requestApi({
      namespace: "namespace",
      apiName: "apiName",
      reqType: "GET",
    });

    if (code === 0) {
      console.log(data);
    }
    setLoading(false);
  };

  const fun = (): void => {};

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerWrap}>
        <div className={styles.pageTitle}>page-title</div>
      </div>
      <div className={styles.contentWrap}>content</div>
    </div>
  );
};
