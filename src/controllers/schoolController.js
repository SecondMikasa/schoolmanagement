const { PrismaClient } = require('../../lib/generated/prisma');
const { calculateDistance } = require('../utils/distance');

const prisma = new PrismaClient();

/*
 Add a new school to the database
 */
const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Input validation
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required: name, address, latitude, longitude' 
      });
    }

    // Parse coordinates to ensure they're valid numbers
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);

    // Validate coordinate ranges
    if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude must be valid numbers' 
      });
    }

    if (parsedLatitude < -90 || parsedLatitude > 90) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude must be between -90 and 90 degrees' 
      });
    }

    if (parsedLongitude < -180 || parsedLongitude > 180) {
      return res.status(400).json({ 
        success: false, 
        message: 'Longitude must be between -180 and 180 degrees' 
      });
    }

    // Create new school record
    const school = await prisma.school.create({
      data: {
        name,
        address,
        latitude: parsedLatitude,
        longitude: parsedLongitude
      }
    });

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: school
    });
  }
  catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add school',
      error: error.message
    });
  }
};

/*
 List all schools, sorted by proximity to user's location
 */
const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    // Validate user's location parameters
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'User location (latitude and longitude) is required'
      });
    }

    // Parse coordinates to ensure they're valid numbers
    const userLatitude = parseFloat(latitude);
    const userLongitude = parseFloat(longitude);

    if (isNaN(userLatitude) || isNaN(userLongitude)) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be valid numbers'
      });
    }

    // Fetch all schools from the database
    const schools = await prisma.school.findMany();

    // Calculate distance from user's location to each school
    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(
        userLatitude,
        userLongitude,
        school.latitude,
        school.longitude
      );

      return {
        ...school,
        distance: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
      };
    });

    // Sort schools by distance (closest first)
    const sortedSchools = schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      data: sortedSchools
    });
  }
  catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve schools',
      error: error.message
    });
  }
};

module.exports = {
  addSchool,
  listSchools
};