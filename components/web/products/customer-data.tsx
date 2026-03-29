const customers = [
  { id: 1, name: 'Alfa Naval' },
  { id: 2, name: 'Ammonia' },
  { id: 3, name: 'Atlas Copco' },
  { id: 4, name: 'Batliboi' },
  { id: 5, name: 'Bekomsan' },
  { id: 6, name: 'Bendix' },
  { id: 7, name: 'Betico' },
  { id: 8, name: 'Bitzer' },
  { id: 9, name: 'Bock' },
  { id: 10, name: 'Carrier' },
  { id: 11, name: 'Clayton' },
  { id: 12, name: 'Copeland' },
  { id: 13, name: 'CPT' },
  { id: 14, name: 'DAF' },
  { id: 15, name: 'Daikin' },
  { id: 16, name: 'Elgi' },
  { id: 17, name: 'Frick' },
  { id: 18, name: 'Gram' },
  { id: 19, name: 'Grasso' },
  { id: 20, name: 'Hamworthy' },
  { id: 21, name: 'Hasegawa' },
  { id: 22, name: 'Hatlapa' },
  { id: 23, name: 'Hispacold' },
  { id: 24, name: 'Hollman' },
  { id: 25, name: 'Ingersoll Rand' },
  { id: 26, name: 'Iveco' },
  { id: 27, name: 'Kirloskar' },
  { id: 28, name: 'Pneumatic' },
  { id: 29, name: 'Knorr Bremse' },
  { id: 30, name: 'MADEF' },
  { id: 31, name: 'Man' },
  { id: 32, name: 'Mcquay' },
  { id: 33, name: 'Mercedes' },
  { id: 34, name: 'Mycom' },
  { id: 35, name: 'Renault' },
  { id: 36, name: 'Sabroe' },
  { id: 37, name: 'Scania' },
  { id: 38, name: 'Sperre' },
  { id: 39, name: 'Tanabe' },
  { id: 40, name: 'Thermoking' },
  { id: 41, name: 'Trane' },
  { id: 42, name: 'UTB' },
  { id: 43, name: 'Vilter' },
  { id: 44, name: 'Volvo' },
  { id: 45, name: 'Voltas' },
  { id: 46, name: 'Wabco' },
  { id: 47, name: 'York' },
];

const CustomerData = () => {
  return (
    <div>
      <section className="py-8 lg:container mx-auto px-5">
        <h1 className="mt-4 text-center text-2xl font-bold dark:text-white md:text-4xl capitalize mb-5">
          Air Brake Compressors, Air & Gas Compressors & Refrigeration
        </h1>
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-8 py-5 px-5 overflow-hidden">
          {customers.map((item) => (
            <div key={item.id}>
              <ul className="space-y-3 text-sm overflow-hidden">
                <li className="flex space-x-3">
                  <svg
                    className="shrink-0 h-6 w-6 text-blue-600"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5219 4.0949C11.7604 3.81436 12.181 3.78025 12.4617 4.01871C12.7422 4.25717 12.7763 4.6779 12.5378 4.95844L6.87116 11.6251C6.62896 11.91 6.1998 11.94 5.9203 11.6916L2.9203 9.02494C2.64511 8.78033 2.62032 8.35894 2.86493 8.08375C3.10955 7.80856 3.53092 7.78378 3.80611 8.02839L6.29667 10.2423L11.5219 4.0949Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-gray-800 dark:text-gray-400">
                    {item.name}
                  </span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CustomerData;
