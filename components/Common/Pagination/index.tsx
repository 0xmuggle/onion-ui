interface Props {
  total: number;
  pageSize: number;
  current: number;
  onChange?: any;
}
const Pagination = ({ total, pageSize, current, onChange }: Props) => {
  const pageCount = Math.ceil(total / pageSize);
  const prePage = () => {
    onChange?.(Math.max(1, current - 1));
  };
  const nextPage = () => {
    onChange?.(Math.min(pageCount, current + 1));
  };
  if (pageCount < 2) return null;
  return (
    <div className="flex items-center justify-end gap-x-2">
      <div>共{total}条记录</div>
      <div className="btn-group grid grid-cols-2">
        <button className="btn btn-outline btn-sm" onClick={prePage}>
          «
        </button>
        <button className="btn btn-outline btn-sm" onClick={nextPage}>
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
