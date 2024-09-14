import React from 'react';

const Pagination = ({ paginationData, itemsPerPage, setItemsPerPage, setPage }) => {
  return (
    <>
      {/* Render Previous Page Button */}
      {paginationData.hasPreviousPage && (
        <button onClick={() => setPage(paginationData.previousPage)}>
          {paginationData.previousPage}
        </button>
      )}

      {/* Current Page Display */}
      <button
        style={{ fontSize: '120%', cursor: 'not-allowed' }}
        disabled
      >
        {paginationData.currentPage}
      </button>

      {/* Render Next Page Button */}
      {paginationData.hasNextPage && (
        <button onClick={() => { console.log("working"); setPage(paginationData.nextPage) }}>
          {paginationData.nextPage}
        </button>
      )}
    </>
  );
};

export default Pagination;
