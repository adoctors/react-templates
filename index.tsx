/*
 * @Author: kl
 * @email: qkeliang@163.com
 * @Description: react-hooks-table
 */

import React, { useState, useEffect } from "react";
import { Button, Tooltip } from "antd";
import { requestApi } from "@/utils/request";
import { RTable, RTextTooltip, RPagination, utils } from "rcrai-rainbow";
import dayjs from "dayjs";

import styles from "./style.less";

import Mock from "mockjs";
const { list } = Mock.mock({
  "list|10": [
    {
      id: "@id",
      name: "@city",
      count: "@integer(0, 100)",
      rate: "@float(0, 1)",
      date_time: "@float(60, 100)",
    },
  ],
});

type IObject = { [key: string]: any };
export default (props) => {
  // 分页相关
  const [page, setPage] = useState<number>(+utils.getPageQuery("page") || 1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(51);
  //   排序相关
  const [sortInfo, setSortInfo] = useState<IObject>({
    field: utils.getPageQuery("field") || "key1",
    order: utils.getPageQuery("order") || "descend",
  });
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<[]>(list || []);
  // 行可选
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  useEffect(() => {
    // getData();
  }, [page, pageSize, sortInfo]);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      render: (r) => <RTextTooltip width="100%">{r}</RTextTooltip>,
    },
    {
      title: "name",
      dataIndex: "name",
    },
    {
      title: "count",
      dataIndex: "count",
    },
    {
      title: "rate",
      dataIndex: "rate",
      sorter: true,
      render: (x) => `${(x || 0).toFixed(2)}%`,
    },
    {
      title: "date_time",
      dataIndex: "date_time",
      sorter: true,
      sortOrder: "descend",
      render: (r) => (
        <RTextTooltip width="100%">
          {dayjs(r).format("YYYY-MM-DD HH:mm:ss")}
        </RTextTooltip>
      ),
    },
    {
      title: "操作",
      key: "handle",
      width: 120,
      render: (_, record) => (
        <div>
          <Tooltip title={record.count > 10 ? "禁用，无法编辑" : ""}>
            <Button
              type="link"
              style={{ padding: 0, color: record.count > 10 ? "#999" : "" }}
              disabled={record.count > 10}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              编辑
            </Button>
          </Tooltip>
          <Tooltip title={record.count > 10 ? "禁用，无法删除" : ""}>
            <Button
              type="link"
              disabled={record.count > 10}
              style={{
                padding: 0,
                marginLeft: 6,
                color: record.count > 10 ? "#999" : "#c53330",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRowIds([record.id]);
              }}
            >
              删除
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const getData = async (): Promise<void> => {
    setTableLoading(true);
    const {
      data: { code, data },
    } = await requestApi({
      namespace: "namespace",
      apiName: "getData",
      reqType: "GET",
      queryData: {
        page,
        size: pageSize,
        sortOrder: sortInfo.order === "ascend",
        sortBy: sortInfo.field,
      },
    });

    if (code === 0) {
      setTotal(data.total || 0);
      setDataSource(data.list || []);
    }
    setTableLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerWrap}>
        <div className={styles.pageTitle}>title</div>
      </div>
      <div className={styles.tableWrapper}>
        <RTable
          resizable
          namespace="namespace"
          loading={tableLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey={(r) => r.id}
          scroll={{ y: "auto" }}
          sortDirections={["descend", "ascend", "descend"]}
          rowSelection={{
            selectedRowKeys: selectedRowIds,
            onChange: (selectedRowKeys) => {
              setSelectedRowIds(selectedRowKeys as string[]);
            },
          }}
          onChange={(_, __, sorter: IObject) => {
            const { field, order } = sorter;
            setSortInfo({
              field,
              order,
            });
            utils.updateRoute({
              ...(utils.getPageQuery() as IObject),
              field,
              order,
            });
            setPage(1);
          }}
          onRow={(record) => ({
            onClick: (e) => {
              e.persist();
              const { className } = e.target as IObject;
              if (
                className &&
                className.indexOf("ant-table-selection-column") > 0
              )
                return;
            },
          })}
        />
        <RPagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(p, pz) => {
            setPage(p);
            setPageSize(pz);
          }}
          isNeedUpdateUrl={true}
          style={{ marginTop: 20 }}
        />
      </div>
    </div>
  );
};
