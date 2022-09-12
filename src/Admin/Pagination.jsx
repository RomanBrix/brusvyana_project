


export default function Pagination({ page, setPage, total, productsPerPage = 10 }) {
  const pages = Math.ceil(total / productsPerPage);
  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => prev - 1);

  return (
    <div className="pagination">
      <button onClick={prevPage} disabled={page === 1}>
        &larr;
      </button>
      <span>
        Page {page} of {pages}
      </span>
      <button onClick={nextPage} disabled={page === pages}>
        &rarr;
      </button>
    </div>
  );
}