import { useState } from 'react';

function SearchBar({ initialValue = '', onSearch }) {
  const [keyword, setKeyword] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword.length === 0) {
      return;
    }

    onSearch(trimmedKeyword);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label className="search-bar__label" htmlFor="product-search">
        Search for a food product
      </label>
      <div className="search-bar__controls">
        <input
          id="product-search"
          className="search-bar__input"
          type="text"
          value={keyword}
          maxLength={100}
          placeholder="Enter a product name"
          autoComplete="off"
          onChange={(event) => setKeyword(event.target.value)}
        />
        <button
          className="button button--primary"
          type="submit"
          disabled={keyword.trim().length === 0}
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
