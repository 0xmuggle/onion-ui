import { isEmpty } from "lodash";
import { ReactElement, useState } from "react";
import { Button } from "..";
import Pagination from "../Pagination";

interface columItem {
  key: string;
  dataInkey?: string;
  render?: any;
  label: string | ReactElement;
  labelProps?: Record<string, any>;
}
interface Props {
  loading: boolean;
  rowKey?: string;
  colums: columItem[];
  dataSource: [];
  page: number;
  pageSize?: number;
  onChangePage?: any;
  total: number;
}
const Table = ({
  colums,
  dataSource = [],
  rowKey = "hash",
  loading,
  page,
  pageSize = 10,
  onChangePage,
  total,
}: Props) => {
  return (
    <div className="space-y-4">
      <table className="table w-full shadow-sm">
        <thead>
          <tr>
            {colums.map(({ label, labelProps, key }: any) => (
              <th key={key} {...labelProps}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((item: any) => (
            <tr key={item[rowKey]}>
              {colums.map(
                ({ key, dataInkey = key, render, labelProps }: any) => (
                  <td key={dataInkey} {...labelProps}>
                    {render ? render(item[key], item) : item[key]}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="flex items-center justify-center py-4">
          <button className="btn btn-square loading btn-ghost" />
        </div>
      )}
      {!loading && isEmpty(dataSource) && (
        <div className="flex items-center justify-center py-4 text-sm text-gray-400">
          无数据.
        </div>
      )}
      <Pagination
        total={total}
        current={page}
        onChange={onChangePage}
        pageSize={pageSize}
      />
    </div>
  );
};

export default Table;
