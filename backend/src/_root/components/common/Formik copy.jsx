import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import CustomDropdown from '../../../utils/customDropDown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, format, isValid } from 'date-fns';
import { stringify } from 'postcss';

const Formik = ({ data, amenityList, closeModal, formTitle, formFields, formFieldsName, onSubmit }) => {
  
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [defaultValues, setDefaultValues] = useState({ fields: data });

  const { control, handleSubmit, reset } = useForm({
    defaultValues
  });

  const { fields } = useFieldArray({
    control,
    name: 'fields'
  });

  const handleDropdownChange = (selectedOptions) => {
    setSelectedAmenities(selectedOptions);
  };

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

  const formatDate = (date) => {
    const monthMap = {
      '01': 'Jan',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Apr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Aug',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec',
    };
    const [year, month, day] = date.split('-');
    return `${day}-${monthMap[month]}-${year}`;
  };

  useEffect(() => {
    const formattedData = data.map((item) => ({
      ...item,
      startDate: item.startDate ? parseDate(item.startDate) : '',
      endDate: item.endDate ? parseDate(item.endDate) : ''
    }));
    setDefaultValues({ fields: formattedData });
    reset({ fields: formattedData });
  }, [data, reset]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] overflow-auto my-10 relative rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center bg-red-700 px-2 py-3 text-white text-sm">
          {formTitle}
          <button onClick={closeModal} className="absolute right-4 text-gray-900 hover:text-gray-900 bg-white px-2 rounded-sm">Close</button>
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className='p-6 pt-0'>
          {JSON.stringify(fields)}
          {fields.map((item, index) => (
            <div key={item.id} class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(item).map((key) => (
                <div key={key}>
                  {key !== 'id' && key !== 'roomId' && (
                    <div key={key} className="grid grid-cols-3">
                      {key !== 'hotelId' && key !== 'amenity' && key !== 'amenities' && key !== 'hoteltype' && key != 'roomtype' && key !== 'startDate' && key != 'endDate' && (
                        <>
                          <label className='flex-none w-36'>{formFieldsName[`${index}`][`${key}`]} [{index}-{key}] </label><Controller
                            key={key}
                            control={control}
                            name={`fields[${index}].${key}`}
                            rules={{ required: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` }}
                            render={({ field, fieldState: { error } }) => (
                              <div className='grid'>
                                <input
                                  {...field}
                                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                  className={`flex-1 border-gray-500 p-1 rounded border mb-2 ${error ? 'border-red-600' : ''}`}
                                />                            
                              </div>
                            )}
                          />
                        </>
                      )}
                      {(key === 'startDate' || key === 'endDate') && (
                        <>
                          <Controller
                            key={key}
                            control={control}
                            name={`fields[${index}].${key}`}
                            // rules={{ required: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` }}
                            render={({ field, fieldState: { error } }) => (
                              <div className='grid'>
                                <DatePicker
                                  selected={field.value && isValid(parse(field.value, 'yyyy-MM-dd', new Date())) ? parse(field.value, 'yyyy-MM-dd', new Date()) : null}
                                  onChange={(date) => field.onChange(format(date, 'yyyy-MM-dd'))}
                                  dateFormat="dd-MMM-yyyy"
                                  placeholderText={key.charAt(0).toUpperCase() + key.slice(1)}
                                  className={`flex-1 border-gray-500 p-1 rounded border mb-2 ${error ? 'border-red-600' : ''}`}
                                />
                                {error && <span className="text-red-600">{error.message}</span>}
                              </div>
                            )}
                          />
                        </>
                      )}
                      {(key === 'amenity' || key === 'amenities') && (
                        <Controller
                          key={key}
                          control={control}
                          name={`fields[${index}].${key}`}
                          rules={{ required: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` }}
                          render={({ field, fieldState: { error } }) => (
                            <div className='grid'>
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
                      {(key === 'hoteltype') && (
                        <Controller
                          key={key}
                          control={control}
                          name={`fields[${index}].${key}`}
                          rules={{ required: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` }}
                          render={({ field, fieldState: { error } }) => (
                            <div className='grid'>
                              <select
                                {...field}
                                className={`flex-1 border-gray-500 p-1 rounded border mb-2 ${error ? 'border-red-600' : ''}`}
                              >
                                <option key={key}>{'Select options'}</option>
                                {amenityList.hotelTypes && amenityList.hotelTypes.map((res) => (
                                  <option key={res.typeId} value={res.name}>
                                    {res.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        />
                      )}
                      {(key === 'roomtype') && (
                        <Controller
                          key={key}
                          control={control}
                          name={`fields[${index}].${key}`}
                          rules={{ required: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` }}
                          render={({ field, fieldState: { error } }) => (
                            <div className='grid'>
                              <select
                                {...field}
                                className={`flex-1 border-gray-500 p-1 rounded border mb-2 ${error ? 'border-red-600' : ''}`}
                              >
                                <option key={key}>{'Select options'}</option>
                                {amenityList.roomTypes && amenityList.roomTypes.map((res) => (
                                  <option key={res.typeId} value={res.name}>
                                    {res.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        />
                      )}
                    </div>      
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className='flex justify-center w-full'>
            <input className='mt-2 bg-red-500 w-64 float-right py-2 px-2 text-white' type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Formik;
