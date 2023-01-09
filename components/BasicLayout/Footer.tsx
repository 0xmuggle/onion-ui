const Footer = () => (
  <footer className="body-font relative z-20 text-gray-600">
    <div className="bg-gray-100">
      <div className="container mx-auto flex flex-col items-center py-6 sm:flex-row">
        <p className="mt-4 text-sm text-gray-500">
          © {new Date().getFullYear()} Onion
        </p>
        <span className="mt-4 inline-flex justify-center sm:ml-auto sm:mt-0 sm:justify-start">
          <a
            className="ml-3 text-gray-500 hover:text-primary"
            href="https://twitter.com/0xKrystal"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              fill="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              className="h-5 w-5"
              viewBox="0 0 24 24"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </a>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
