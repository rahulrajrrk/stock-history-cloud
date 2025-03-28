import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeedometerGauge from './SpeedometerGauge';

function App() {
  const [stockOptions, setStockOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [type, setType] = useState('sip');
  const [amount, setAmount] = useState(1000);
  const [years, setYears] = useState(5);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [funFacts, setFunFacts] = useState([]);

  useEffect(() => {
    fetch('/stocks.json')
      .then(res => res.json())
      .then(data => {
        setStockOptions(data);
        setFilteredOptions(data);
      })
      .catch(err => console.error('Failed to load stock list', err));
  }, []);

  const handleSymbolChange = (value) => {
    setSymbol(value.toUpperCase());
    const filtered = stockOptions.filter(
      (stock) =>
        stock.symbol.toLowerCase().startsWith(value.toLowerCase()) ||
        stock.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/simulate', {
        symbol,
        type,
        amount,
        years
      });

      const data = response.data;
      setResults(data.results);
      setSummary(data.summary);
      setFunFacts(data.fun_facts);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error fetching simulation data');
    }
  };

  const totalInvested = type === 'sip' ? amount * years * 12 : amount;

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">📈 Stock Return History Checker</h1>
      <h2 className="text-lg text-gray-600 text-center mb-6">Simulate SIP and Lump Sum returns for top-performing stocks 📊</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow border border-gray-200">
        <div>
          <label className="block mb-1 font-semibold">Stock Symbol:</label>
          <input
            list="stock-options"
            value={symbol}
            onChange={(e) => handleSymbolChange(e.target.value)}
            className="border p-2 w-full rounded shadow-sm"
            placeholder="Type to search stock..."
          />
          <datalist id="stock-options">
            {filteredOptions.map((stock, idx) => (
              <option key={idx} value={stock.symbol}>
                {stock.name}
              </option>
            ))}
          </datalist>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Investment Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 w-full rounded shadow-sm"
          >
            <option value="sip">SIP</option>
            <option value="lump_sum">Lump Sum</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Amount (USD):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full rounded shadow-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Investment Duration (Years):</label>
          <select
            value={years}
            onChange={(e) => setYears(parseInt(e.target.value))}
            className="border p-2 w-full rounded shadow-sm"
          >
            {[1, 2, 3, 4, 5].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 text-center">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 hover:scale-105 transform transition duration-200">
            Calculate
          </button>
        </div>
      </form>

      {summary && results.length > 0 && (
        <div className="mt-12 space-y-10">
          <SpeedometerGauge
            keyProp={`${symbol}-${type}-${years}-${summary.avg_cagr}`}
            worst={summary.min_cagr}
            avg={summary.avg_cagr}
            best={summary.max_cagr}
            belowPercent={summary.below_percent}
            abovePercent={summary.above_percent}
            totalInvested={totalInvested}
            summary={summary}
            results={results}
          />

          {funFacts.length > 0 && (
            <div className="mt-12 bg-gray-50 border border-gray-300 rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">🤔 Do You Know?</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                {funFacts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
