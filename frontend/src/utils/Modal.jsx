const Modal = ({ children, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-15 flex justify-end z-50">
      <div className="w-full max-w-md h-full overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Modal;
