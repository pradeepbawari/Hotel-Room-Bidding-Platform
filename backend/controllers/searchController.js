const { transformKeysToCamelCase } = require("../core/utiles");
const { searchService, searchLocService, searchHotelService, searchHotelPageService, searchHotelRoomPageService } = require("../services/searchService");

const searchControl = async (req, res) => {
    
    try {
        const {q} = req.query;
        const result = await searchService(q);        
        return res.status(200).send({ results: result, status: 200 });
    } catch (err) {
        console.error('Error fetching add travel Room details:', err);
        return res.status(500).send('Server connection error');
    }
};

const searchLocControl = async (req, res) => {
    try {
        const result = await searchLocService(req.body);        
        return res.status(200).send({ results: result, status: 200 });
    } catch (err) {
        console.error('Error fetching add travel Room details:', err);
        return res.status(500).send('Server connection error');
    }
};

const searchHotelControl = async (req, res) => {
    try {
        const result = await searchHotelService(req.body);        
        const modifyData = result.map(item => {
            if (item.amenities != null && item.amenities !== '') {
              return {
                ...item,
                amenities: item.amenities.split(','),
                roomtype: item.roomtype.split(',')
              };
            }
            return item;
        });
        const data = modifyData.map(item=>transformKeysToCamelCase(item))
        return res.status(200).send({results: data, status: 200}) 
    } catch (err) {
        console.error('Error fetching add travel Room details:', err);
        return res.status(500).send('Server connection error');
    }
};

// const searchHotelRoomControl = async (req, res) => {
//     try {
//         const result = await searchHotelRoomService(req.query);        
//         return res.status(200).send({ results: result, status: 200 });
//     } catch (err) {
//         console.error('Error fetching add travel Room details:', err);
//         return res.status(500).send('Server connection error');
//     }
// };


const searchHotelPageControl = async (req, res) => {
    try {
        const result = await searchHotelPageService(req.query);
        let data = result;
        if(result.length){ 
            const modifyData = result.map(item => {
                if (item.amenity != null && item.amenity !== '') {
                return {
                    ...item,
                    amenity: item.amenity.split(',')
                };
                }
                return item;
            });
            data = modifyData.map(item=>transformKeysToCamelCase(item))
        }
        return res.status(200).send({results: data, total: result.total, status: 200})     
    } catch(err) {
        console.error('Error fetching hotel in hotelController page:', err);
        return res.status(500).send('Server connection error');
    }
};

const searchHotelRoomPageControl = async (req, res) => {
    try {
        const result = await searchHotelRoomPageService(req.query);
        let data = result;
        if(result.length){ 
            const modifyData = result.map(item => {
                if (item.amenity != null && item.amenity !== '') {
                return {
                    ...item,
                    amenity: item.amenity.split(',')
                };
                }
                return item;
            });
            data = modifyData.map(item=>transformKeysToCamelCase(item))
        }
        return res.status(200).send({results: data, total: result.total, status: 200})     
    } catch(err) {
        console.error('Error fetching hotel in hotelController page:', err);
        return res.status(500).send('Server connection error');
    }
}


module.exports = {searchControl, searchLocControl, searchHotelControl, searchHotelPageControl, searchHotelRoomPageControl}