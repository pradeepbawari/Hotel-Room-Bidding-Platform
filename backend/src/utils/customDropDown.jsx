import React, { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

const CustomDropdown = ({ control, name, options, rules, onChange }) => {
  const { field } = useController({ control, name, rules });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(field.value || []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (option) => {
    const updatedSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedSelectedOptions);
    field.onChange(updatedSelectedOptions);
    onChange(updatedSelectedOptions);
  };

  return (
    <div className="relative">
      <div
        className="border border-gray-500 rounded p-1 cursor-pointer mb-2"
        onClick={toggleDropdown}
      >
        {selectedOptions.length > 0 ? selectedOptions.join(',') : 'Select options'}
      </div>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
          {options.map(option => (
            <div key={option.amenityId} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.name)}
                onChange={() => handleCheckboxChange(option.name)}
                className="mr-2"
              />
              <label>{option.name}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
