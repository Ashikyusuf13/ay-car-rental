import Car from '../Model/CarModel.js';

// Get all cars with optional filters
export const getAllCars = async (req, res) => {
    try {
        const { location, make, minPrice, maxPrice, transmission, fuelType } = req.query;

        let query = { isAvailable: true };

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (make) {
            query.make = { $regex: make, $options: 'i' };
        }
        if (transmission) {
            query.transmission = transmission;
        }
        if (fuelType) {
            query.fuelType = fuelType;
        }

        if (minPrice || maxPrice) {
            query.pricePerDay = {};
            if (minPrice) query.pricePerDay.$gte = Number(minPrice);
            if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
        }

        const cars = await Car.find(query);

        return res.json({ success: true, cars });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get single car details
export const getCarById = async (req, res) => {
    try {
        const { id } = req.params;

        const car = await Car.findById(id).populate('ownerId', 'name email phone type');

        if (!car) {
            return res.json({ success: false, message: 'Car not found' });
        }

        return res.json({ success: true, car });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
