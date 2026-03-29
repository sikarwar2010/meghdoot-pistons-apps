const customers = [
  { id: 1, name: 'Andoria' },
  { id: 2, name: 'Avia' },
  { id: 3, name: 'Armstrong Sidley' },
  { id: 4, name: 'Austin BMC' },
  { id: 5, name: 'Bedford' },
  { id: 6, name: 'Belarus' },
  { id: 7, name: 'Buston' },
  { id: 8, name: 'Bukh' },
  { id: 9, name: 'Case' },
  { id: 10, name: 'Caterpillar' },
  { id: 11, name: 'Cooper' },
  { id: 12, name: 'Cummins' },
  { id: 13, name: 'DAF' },
  { id: 14, name: 'David Brown' },
  { id: 15, name: 'Detroit' },
  { id: 16, name: 'Deutz' },
  { id: 17, name: 'Daihatshu' },
  { id: 18, name: 'Dongfeng' },
  { id: 19, name: 'Dorman' },
  { id: 20, name: 'Eicher' },
  { id: 21, name: 'EKM' },
  { id: 22, name: 'Escort' },
  { id: 23, name: 'Fendt' },
  { id: 24, name: 'Ford' },
  { id: 25, name: 'Fiat' },
  { id: 26, name: 'FordSon' },
  { id: 27, name: 'Fortschritt(IFA)' },
  { id: 28, name: 'Gardner' },
  { id: 29, name: 'Hanomag' },
  { id: 30, name: 'Hatz' },
  { id: 31, name: 'Honda' },
  { id: 32, name: 'IFA' },
  { id: 33, name: 'Ikarus' },
  { id: 34, name: 'International(IHC)' },
  { id: 35, name: 'Indec' },
  { id: 36, name: 'Izumi' },
  { id: 37, name: 'Iveco' },
  { id: 38, name: 'JCB' },
  { id: 39, name: 'JEEP' },
  { id: 40, name: 'Jenbach' },
  { id: 41, name: 'John Deere' },
  { id: 42, name: 'KHD' },
  { id: 43, name: 'Karaz' },
  { id: 44, name: 'Kamaz' },
  { id: 45, name: 'KHD' },
  { id: 46, name: 'Kia' },
  { id: 47, name: 'Kiroloskar' },
  { id: 48, name: 'Komatsu' },
  { id: 49, name: 'Kubota' },
  { id: 50, name: 'Lada' },
  { id: 51, name: 'Land Rover' },
  { id: 52, name: 'Lister' },
  { id: 53, name: 'Lombardini' },
  { id: 54, name: 'Liaz' },
  { id: 55, name: 'Mack' },
  { id: 56, name: 'Man' },
  { id: 57, name: 'Mahindra' },
  { id: 58, name: 'Man Supercharge' },
  { id: 59, name: 'Massey Ferguson' },
  { id: 60, name: 'Mazda' },
  { id: 61, name: 'Medaws' },
  { id: 62, name: 'Midland' },
  { id: 63, name: 'Mirless' },
  { id: 64, name: 'Mitsubishi' },
  { id: 65, name: 'Mercedes' },
  { id: 66, name: 'MTZ' },
  { id: 67, name: 'Moskvich' },
  { id: 68, name: 'Multicar' },
  { id: 69, name: 'MWM' },
  { id: 70, name: 'Navistar' },
  { id: 71, name: 'New Holland' },
  { id: 72, name: 'Nissan' },
  { id: 73, name: 'Perkins' },
  { id: 74, name: 'Petter' },
  { id: 75, name: 'Peugeot' },
  { id: 76, name: 'Piaggio' },
  { id: 77, name: 'Raba' },
  { id: 78, name: 'Renault' },
  { id: 79, name: 'Rotex' },
  { id: 80, name: 'Rumania' },
  { id: 81, name: 'Russian' },
  { id: 82, name: 'Rumania UTB' },
  { id: 83, name: 'Ruston' },
  { id: 84, name: 'Robson RC' },
  { id: 85, name: 'Robin' },
  { id: 86, name: 'SAME/Lamborghini' },
  { id: 87, name: 'Samofa' },
  { id: 88, name: 'Saviem' },
  { id: 89, name: 'Scoda' },
  { id: 90, name: 'Schuluter' },
  { id: 91, name: 'Sendling' },
  { id: 92, name: 'Shibaura' },
  { id: 93, name: 'Slavia' },
  { id: 94, name: 'Scania' },
  { id: 95, name: 'Steyr' },
  { id: 96, name: 'Tara Bushi' },
  { id: 97, name: 'Tata' },
  { id: 98, name: 'Tiger' },
  { id: 99, name: 'Toyota' },
  { id: 100, name: 'Tatra' },
  { id: 101, name: 'Universal (UTB)' },
  { id: 102, name: 'Ursus' },
  { id: 103, name: 'Valtra' },
  { id: 104, name: 'Volvo' },
  { id: 105, name: 'Volvo PENTA' },
  { id: 106, name: 'Vespa' },
  { id: 107, name: 'Volkswagen' },
  { id: 108, name: 'VM' },
  { id: 109, name: 'Yamz' },
  { id: 110, name: 'Yanmar' },
  { id: 111, name: 'Zetor' },
  { id: 112, name: 'Zil' },
];

const CustomerList = () => {
  return (
    <div>
      <section className="py-8 lg:container mx-auto px-5">
        <h1 className="mt-4 text-center text-2xl font-bold dark:text-white md:text-4xl capitalize mb-5">
          Diesel Engines, Tractors, Automobiles, Trucks, Marine Engines
        </h1>
        <div className="grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-8 py-5 px-5 overflow-hidden">
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

export default CustomerList;
