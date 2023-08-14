import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const itemsPerPage = 25;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');
                const data = await response.json();
                setCountries(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedCountries = filteredCountries.slice().sort((a, b) => {
        const nameA = a.name.common.toLowerCase();
        const nameB = b.name.common.toLowerCase();

        if (sortOrder === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });

    const indexOfLastCountry = currentPage * itemsPerPage;
    const indexOfFirstCountry = indexOfLastCountry - itemsPerPage;
    const currentCountries = sortedCountries.slice(indexOfFirstCountry, indexOfLastCountry);

    const totalPages = Math.ceil(sortedCountries.length / itemsPerPage);

    const openModal = country => {
        setSelectedCountry(country);
    };

    const closeModal = () => {
        setSelectedCountry(null);
    };

    return (
        <div className="app">
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by country name"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    Toggle Sort
                </button>
            </div>
            <div className="grid">
                {currentCountries.map((country, index) => (
                    <div>
                        <div className="country-card" key={index}  onClick={() => openModal(country)}>
                            <img src={ country.flags.png } alt={`${country.name.common} Flag`} />
                            <h3>Country Name: { country.name.official }</h3>
                            <p>2 Character Code: { country.cca2 }</p>
                            <p>3 Character Code: { country.cca3 }</p>
                            <p>Native Name: { JSON.stringify(country.name.nativeName) }</p>
                            <p>Alternative Names: { country.altSpellings.join(', ') }</p>
                            <p>Country Calling Codes: { JSON.stringify(country.idd) }</p>
                        </div>
                        {selectedCountry && (
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close" onClick={closeModal}>&times;</span>
                                    <div>
                                        <img src={ country.flags.png } alt={`${country.name.common} Flag`} />
                                        <h3>Country Name: { country.name.official }</h3>
                                        <p>2 Character Code: { country.cca2 }</p>
                                        <p>3 Character Code: { country.cca3 }</p>
                                        <p>Native Name: { JSON.stringify(country.name.nativeName) }</p>
                                        <p>Alternative Names: { country.altSpellings.join(', ') }</p>
                                        <p>Country Calling Codes: { JSON.stringify(country.idd) }</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default App;