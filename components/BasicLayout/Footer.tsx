const Footer = () => (
  <footer className="body-font relative z-20 text-gray-600">
    <div className="bg-gray-100">
      <div className="container mx-auto flex flex-col items-center py-6 sm:flex-row">
        <p className="mt-4 text-sm text-gray-500">
          © {new Date().getFullYear()} Onion <span>v0.0.3</span>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
