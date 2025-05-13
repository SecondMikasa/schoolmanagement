/**
 * Script to seed the database with mock school data
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
  errorFormat: 'minimal',
});

// Array of mock school data
const mockSchools = [
  {
    name: "Lincoln High School",
    address: "2229 J St, Lincoln, NE 68510",
    latitude: 40.813616,
    longitude: -96.702596
  },
  {
    name: "East High School",
    address: "1000 S 70th St, Lincoln, NE 68510",
    latitude: 40.809265,
    longitude: -96.638093
  },
  {
    name: "North Star High School",
    address: "5801 N 33rd St, Lincoln, NE 68504",
    latitude: 40.855657,
    longitude: -96.687802
  },
  {
    name: "Southeast High School",
    address: "2930 S 37th St, Lincoln, NE 68506",
    latitude: 40.784572,
    longitude: -96.676864
  },
  {
    name: "Southwest High School",
    address: "7001 S 14th St, Lincoln, NE 68512",
    latitude: 40.744856,
    longitude: -96.717804
  },
  {
    name: "Northeast High School",
    address: "2635 N 63rd St, Lincoln, NE 68507",
    latitude: 40.846134,
    longitude: -96.646050
  },
  {
    name: "University of Nebraska-Lincoln",
    address: "1400 R St, Lincoln, NE 68588",
    latitude: 40.818229,
    longitude: -96.702621
  },
  {
    name: "Pius X High School",
    address: "6000 A St, Lincoln, NE 68510",
    latitude: 40.809951,
    longitude: -96.654659
  },
  {
    name: "Waverly High School",
    address: "13401 Amberly Rd, Waverly, NE 68462",
    latitude: 40.917770,
    longitude: -96.529510
  },
  {
    name: "Malcolm Public School",
    address: "10001 NW 112th St, Malcolm, NE 68402",
    latitude: 40.909149,
    longitude: -96.866211
  },
  {
    name: "Lincoln Christian School",
    address: "5801 S 84th St, Lincoln, NE 68516",
    latitude: 40.766342,
    longitude: -96.628876
  },
  {
    name: "Parkview Christian School",
    address: "4400 N 1st St, Lincoln, NE 68521",
    latitude: 40.858280,
    longitude: -96.759102
  },
  {
    name: "Lincoln Lutheran Middle/High School",
    address: "1100 N 56th St, Lincoln, NE 68504",
    latitude: 40.826698,
    longitude: -96.662971
  },
  {
    name: "Norris High School",
    address: "25211 S 68th St, Firth, NE 68358",
    latitude: 40.542458,
    longitude: -96.644669
  },
  {
    name: "Doane University",
    address: "1014 Boswell Ave, Crete, NE 68333",
    latitude: 40.625710,
    longitude: -96.954720
  }
];

/**
 * Seed the database with mock data
 */
async function seedDatabase() {
  try {
    console.log('Starting to seed the database...');
    
    // Clear existing data first (optional)
    await prisma.school.deleteMany();
    console.log('Cleared existing school records');
    
    // Insert mock data
    for (const school of mockSchools) {
      await prisma.school.create({
        data: school
      });
    }
    
    console.log(`Database seeded with ${mockSchools.length} schools`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedDatabase();