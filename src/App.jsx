import { useState } from 'react';
import axios from 'axios';

const ImageSearch = () => {
  const accessKey = 'X8IXVqx3AVrmW_bUnq9nlkxSjohFMhBEDDMGbC3cbU8';
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = async (searchQuery, pageNum) => {
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: searchQuery,
          page: pageNum,
          client_id: accessKey,
        },
      });
      return response.data;
    } catch (error) {
      setError('Failed to fetch images. Please try again.');
      console.error('Error fetching images:', error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (query.trim() === "") {
      alert("Please enter a search term.");
      return;
    }

    setPage(1);
    setImages([]);
    setShowMore(false);
    setError(null);

    const data = await fetchImages(query, 1);
    if (data) {
      setImages(data.results);
      setPage(2);
      setShowMore(data.results.length === 10);
    }
  };

  const handleLoadMore = async () => {
    const data = await fetchImages(query, page);
    if (data) {
      setImages((prevImages) => [...prevImages, ...data.results]);
      setPage(page + 1);
      setShowMore(data.results.length === 10);
    }
  };

  const handleClear = () => {
    setQuery('');
    setImages([]);
    setPage(1);
    setShowMore(false);
    setError(null);
  };

  const renderImageElements = () => {
    return images.map((result) => (
      <div key={result.id} className="bg-white shadow-md rounded-lg overflow-hidden">
        <img src={result.urls.small} alt={result.alt_description} className="w-full h-48 object-cover"/>
        <div className="p-4">
          <a href={result.links.html} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">
            {result.alt_description || "View Image"}
          </a>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSearch} className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for images..."
            className="flex-grow p-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Search
          </button>
          <button 
            type="button" 
            onClick={handleClear} 
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Clear
          </button>
        </form>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.length > 0 ? renderImageElements() : <p className="text-gray-500 text-center">Please enter a search term.</p>}
        </div>

        {showMore && (
          <div className="text-center mt-6">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSearch;
