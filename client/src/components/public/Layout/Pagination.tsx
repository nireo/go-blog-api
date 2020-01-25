import React from 'react';

type Props = {
  amountInPage: number;
  totalPosts: number;
  paginate: (pageNumber: number) => void;
};

const Pagination: React.FC<Props> = ({
  amountInPage,
  totalPosts,
  paginate
}) => {
  const amountOfPages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / amountInPage); i++) {
    amountOfPages.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {amountOfPages.map(n => (
          <li key={n} className="page-item">
            <button
              onClick={() => paginate(n)}
              className="page-link"
              style={{ color: 'black' }}
            >
              {n}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
