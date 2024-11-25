import { FontAwesomeIcon, faXmark } from '../utils/fontAwesomeIcons';

const Modal = ({ formTitle, children, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-15 flex justify-center z-50">
      <div className="w-full max-w-md h-full overflow-auto">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl overflow-auto my-10 relative rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-start bg-red-700 px-2 py-3 text-white text-sm">
              {formTitle}
              <button onClick={closeModal} className="absolute right-4 top-2 py-0 rounded-sm">
              <FontAwesomeIcon icon={faXmark} size="2x" />
              </button>
            </h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
