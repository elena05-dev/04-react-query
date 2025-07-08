import ReactPaginateLib from "react-paginate";
import css from "../App/App.module.css";

interface ReactPaginateProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function ReactPaginate({
  totalPages,
  currentPage,
  onPageChange,
}: ReactPaginateProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginateLib
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={currentPage - 1}
      previousLabel="←"
      nextLabel="→"
      renderOnZeroPageCount={null}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
