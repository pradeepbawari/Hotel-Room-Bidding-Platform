import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import CustomDropdown from '../../../utils/customDropDown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format, isValid } from 'date-fns';
import { FontAwesomeIcon, faFloppyDisk } from '../../../utils/fontAwesomeIcons';

const Formik = ({ inputValue, amenityList, inputLabels, onSubmit }) => {
  
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { fields: inputValue },
  });
console.log(inputLabels, 'sfafasa');

  const { fields } = useFieldArray({
    control,
    name: 'fields',
  });

  const handleDropdownChange = (selectedOptions) => {
    setSelectedAmenities(selectedOptions);
  };
console.log(fields);
console.log(inputLabels);

  // return

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    const monthMap = {
      'Jan': '01',
      'Feb': '02',
      'Mar': '03',
      'Apr': '04',
      'May': '05',
      'Jun': '06',
      'Jul': '07',
      'Aug': '08',
      'Sep': '09',
      'Oct': '10',
      'Nov': '11',
      'Dec': '12',
    };
    return `${year}-${monthMap[month]}-${day.padStart(2, '0')}`;
  };

  // useEffect(() => {
  //   const formattedData = data.map((item) => ({
  //     ...item,
  //     startDate: item.startDate ? parseDate(item.startDate) : '',
  //     endDate: item.endDate ? parseDate(item.endDate) : '',
  //   }));
  //   reset({ fields: formattedData });
  // }, [data, reset]);

  return (
    // <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    //   <div className="bg-white w-full max-w-4xl overflow-auto my-10 relative rounded-lg">
    //     <h2 className="text-2xl font-bold mb-6 text-start bg-red-700 px-2 py-3 text-white text-sm">
    //       {formTitle}
    //       {/* <button onClick={closeModal} className="absolute right-4 text-gray-900 hover:text-gray-900 bg-white px-2 rounded-sm">
    //         Close
    //       </button> */}
    //     </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-0">
          {fields.map((item, index) => (
            <div key={item.hotelId || item.id || item.rooId} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(item).map((key) => {                
                  return (
                    <div key={key} className="grid grid-cols-1 md:grid-cols-3">
                      <label className="md:col-span-1">{inputLabels[index][key]}</label>
                      {!['amenity', 'amenities', 'id', 'roomId', 'hotelId', 'roomId', 'hoteltype', 'roomtype', 'startDate', 'endDate'].includes(key) && (
                      <Controller
                        control={control}
                        name={`fields[${index}].${key}`}
                        rules={{ required: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` }}
                        render={({ field, fieldState: { error } }) => (
                          <input
                            {...field}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            className={`md:col-span-2 border-gray-500 p-1 rounded border ${error ? 'border-red-600' : ''}`}
                          />
                        )}
                      />
                      )}
                      {/* Handle specific fields like startDate and endDate */}
                      {['startDate', 'endDate'].includes(key) && (
                        <Controller
                          control={control}
                          name={`fields[${index}].${key}`}
                          render={({ field, fieldState: { error } }) => (
                            <div className="md:col-span-2 border-gray-500 p-1 rounded formdatepicker">
                              <DatePicker
                                selected={field.value && isValid(parse(field.value, 'yyyy-MM-dd', new Date())) ? parse(field.value, 'yyyy-MM-dd', new Date()) : null}
                                onChange={(date) => field.onChange(format(date, 'yyyy-MM-dd'))}
                                dateFormat="dd-MMM-yyyy"
                                placeholderText={key.charAt(0).toUpperCase() + key.slice(1)}
                                className={`flex-1 border-gray-500 p-1 rounded border w-full mb-2 ${error ? 'border-red-600' : ''}`}
                              />
                              {error && <span className="text-red-600">{error.message}</span>}
                            </div>
                          )}
                        />
                      )}
                      {/* Handle amenities */}
                      {['amenity', 'amenities'].includes(key) && (
                        <Controller
                          control={control}
                          name={`fields[${index}].${key}`}
                          rules={{ required: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` }}
                          render={({ field, fieldState: { error } }) => (
                            <div className="md:col-span-2 border-gray-500 p-1 rounded">
                              <CustomDropdown
                                control={control}
                                name={`fields[${index}].${key}`}
                                options={amenityList.amenities}
                                rules={{ required: false }}
                                onChange={handleDropdownChange}
                              />
                              {error && <span className="text-red-600">{error.message}</span>}
                            </div>
                          )}
                        />
                      )}
                      {/* Handle hotel type */}
                      {key === 'hoteltype' && (
                        <Controller
                          control={control}
                          name={`fields[${index}].${key}`}
                          rules={{ required: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` }}
                          render={({ field, fieldState: { error } }) => (
                            <div className="md:col-span-2 border-gray-500 p-1 rounded">
                              <select
                                {...field}
                                className={`border-gray-500 p-1 rounded border w-full mb-2 ${error ? 'border-red-600' : ''}`}
                              >
                                <option key={`${index}-hoteltype`} value="">{'Select options'}</option>
                                {amenityList.hotelTypes && amenityList.hotelTypes.map((res) => (
                                  <option key={res.typeId} value={res.name}>
                                    {res.name}
                                  </option>
                                ))}
                              </select>
                              {error && <span className="text-red-600">{error.message}</span>}
                            </div>
                          )}
                        />
                      )}
                      {/* Handle room type */}
                      {key === 'roomtype' && (
                        <Controller
                          control={control}
                          name={`fields[${index}].${key}`}
                          rules={{ required: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` }}
                          render={({ field, fieldState: { error } }) => (
                            <div className="grid">
                              <select
                                {...field}
                                className={`flex-1 border-gray-500 p-1 rounded border mb-2 ${error ? 'border-red-600' : ''}`}
                              >
                                <option key={`${index}-roomtype`} value="">{'Select options'}</option>
                                {amenityList.roomTypes && amenityList.roomTypes.map((res) => (
                                  <option key={res.typeId} value={res.name}>
                                    {res.name}
                                  </option>
                                ))}
                              </select>
                              {error && <span className="text-red-600">{error.message}</span>}
                            </div>
                          )}
                        />
                      )}
                    </div>
                  );                
              })}
            </div>
          ))}
          <div className="flex w-full justify-end">
            <div className="mt-4 bg-red-500 w-64 py-2 px-2 text-white text-center">
              <FontAwesomeIcon icon={faFloppyDisk} />
              <input              
                className="ml-3"
                type="submit"
                value="Submit"
              />
            </div>
          </div>           
        </form>       
    //   </div>
    // </div>
  );
};

export default Formik;
