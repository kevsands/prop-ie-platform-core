/**
 * Development Detail Page
 * Shows detailed information about a specific development
 */
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import DevelopmentCTA from '@/components/buyer/DevelopmentCTA';

// Development data matching what's in the listings page
const developmentsData = {
  'fitzgerald-gardens': {
    id: 'fitzgerald-gardens',
    name: 'Fitzgerald Gardens',
    description: 'Luxurious living with modern comforts in the heart of Finglas',
    longDescription: `Fitzgerald Gardens represents the pinnacle of modern urban living in Dublin. Located in the vibrant community of Finglas, this development offers a perfect blend of sophisticated design, energy efficiency, and convenience.

Each home has been thoughtfully designed with contemporary families in mind, featuring open-plan living spaces, high-quality finishes, and private outdoor areas. The development includes beautifully landscaped communal gardens, secure parking, and is within walking distance of schools, shops, and public transport links.`,
    location: 'Finglas, Dublin',
    address: 'Jamestown Road, Finglas, Dublin 11',
    status: 'Selling Fast',
    startingPrice: '€395,000',
    priceRange: '€395,000 - €575,000',
    bedrooms: [2, 34],
    bathrooms: 2,
    energyRating: 'A2',
    availability: 'Move in from Winter 2025',
    mainImage: '/images/developments/fitzgerald-gardens/hero.jpeg',
    images: [
      '/images/developments/fitzgerald-gardens/hero.jpeg',
      '/images/developments/fitzgerald-gardens/1.jpg',
      '/images/developments/fitzgerald-gardens/2.jpg',
      '/images/developments/fitzgerald-gardens/3.jpg',
      '/images/developments/fitzgerald-gardens/2bed-apartment.jpeg',
      '/images/developments/fitzgerald-gardens/3bed-House.jpeg',
      '/images/developments/fitzgerald-gardens/HouseTypes Header.jpeg',
      '/images/developments/fitzgerald-gardens/Vanity-unit.jpeg'
    ],
    features: [
      'Energy Efficient A2 Rating',
      'Modern Open Plan Design',
      'Private Outdoor Spaces',
      'Secure Parking',
      'Landscaped Gardens',
      'Near Schools & Shops',
      'Excellent Transport Links',
      'High-Quality Finishes'
    ],
    unitsAvailable: 12,
    totalUnits: 48,
    floorPlans: [
      { 
        type: '2 Bed', 
        size: '75-85 sqm', 
        price: 'From €395,000',
        image: '/images/developments/fitzgerald-gardens/House Type 1.png'
      },
      { 
        type: '3 Bed', 
        size: '95-105 sqm', 
        price: 'From €450,000',
        image: '/images/developments/fitzgerald-gardens/House Type 2.png'
      },
      { 
        type: '4 Bed', 
        size: '110-125 sqm', 
        price: 'From €525,000',
        image: '/images/developments/fitzgerald-gardens/House Type 3.png'
      },
      {
        type: 'Duplex',
        size: '100-110 sqm',
        price: 'From €475,000',
        image: '/images/developments/fitzgerald-gardens/Duplex D5.png'
      }
    ],
    transport: { 
      bus: '5 min walk to Dublin Bus routes',
      luas: '15 min to Luas Green Line',
      car: '20 min to City Centre',
      dart: '20 min to DART station' 
    },
    sitePlan: '/images/developments/fitzgerald-gardens/site-plan.jpg'
  },
  'ballymakenny-view': {
    id: 'ballymakenny-view',
    name: 'Ballymakenny View',
    description: 'Modern family homes in a convenient location with excellent amenities',
    longDescription: `Ballymakenny View offers the perfect blend of contemporary living and traditional values. These stunning homes are designed with modern families in mind, featuring spacious interiors and energy-efficient construction.

Nestled in the heart of Drogheda, this development provides easy access to schools, shopping centers, and recreational facilities while maintaining a peaceful residential atmosphere.`,
    location: 'Ballymakenny, Drogheda',
    address: 'Ballymakenny Road, Drogheda, Co. Louth',
    status: 'Coming Soon',
    startingPrice: '€350,000',
    priceRange: '€350,000 - €425,000',
    bedrooms: [34],
    bathrooms: 2,
    energyRating: 'A2',
    availability: 'Launching Summer 2025',
    mainImage: '/images/developments/Ballymakenny-View/hero.jpg',
    images: [
      '/images/developments/Ballymakenny-View/hero.jpg',
      '/images/developments/Ballymakenny-View/01-People.jpg',
      '/images/developments/Ballymakenny-View/02-People.jpg',
      '/images/developments/Ballymakenny-View/03.jpg',
      '/images/developments/Ballymakenny-View/04.jpg',
      '/images/developments/Ballymakenny-View/BMV 1.jpg',
      '/images/developments/Ballymakenny-View/BMV 2.jpg',
      '/images/developments/Ballymakenny-View/main.jpg'
    ],
    features: [
      'Energy Efficient A2 Rating',
      'Spacious Family Homes',
      'Private Gardens',
      'Driveway Parking',
      'Premium Finishes',
      'Close to Schools',
      'Transport Links',
      'Family-Friendly Location'
    ],
    unitsAvailable: 24,
    totalUnits: 42,
    floorPlans: [
      { 
        type: 'Type A - 3 Bed Semi-Detached', 
        size: '110-120 sqm', 
        price: 'From €350,000',
        image: '/images/developments/Ballymakenny-View/HouseType A.jpg',
        floorPlan: '/images/developments/Ballymakenny-View/HouseType A FP1.png'
      },
      { 
        type: 'Type B - 4 Bed Detached', 
        size: '140-150 sqm', 
        price: 'From €425,000',
        image: '/images/developments/Ballymakenny-View/House Type B.jpg',
        floorPlan: '/images/developments/Ballymakenny-View/HouseTypeB FP2.png'
      }
    ],
    transport: { 
      bus: '2 min walk to bus stop',
      train: '10 min to Drogheda Station',
      car: '5 min to M1 Motorway',
      dublin: '40 min to Dublin City Centre' 
    },
    sitePlan: '/images/developments/Ballymakenny-View/BMV Site Plan.png'
  },
  'ellwood': {
    id: 'ellwood',
    name: 'Ellwood',
    description: 'Contemporary apartment living in the heart of Kildare',
    longDescription: `Ellwood represents the future of apartment living in Ireland. This stunning development features modern architecture, sustainable design, and luxurious finishes throughout.

Each apartment has been carefully designed to maximize space and light, with floor-to-ceiling windows, private balconies, and open-plan living areas. The development includes extensive amenities for residents including a gym, concierge service, and landscaped gardens.`,
    location: 'Celbridge, Co. Kildare',
    address: 'Main Street, Celbridge, Co. Kildare',
    status: 'Now Selling',
    startingPrice: '€285,000',
    priceRange: '€285,000 - €450,000',
    bedrooms: [1, 23],
    bathrooms: 2,
    energyRating: 'A1',
    availability: 'Ready to Move In',
    mainImage: '/images/developments/Ellwood-Logos/hero.jpg',
    images: [
      '/images/developments/Ellwood-Logos/hero.jpg',
      '/images/developments/Ellwood-Logos/EllwoodBloom-1.jpeg',
      '/images/developments/Ellwood-Logos/EllwoodBloom-2.jpeg',
      '/images/developments/Ellwood-Logos/EllwoodBloom-3.jpeg',
      '/images/developments/Ellwood-Logos/EllwoodBloom-4.jpeg',
      '/images/developments/Ellwood-Logos/EllwoodBloom-5.jpeg'
    ],
    logos: [
      '/images/developments/Ellwood-Logos/2.png',
      '/images/developments/Ellwood-Logos/4 (1).png',
      '/images/developments/Ellwood-Logos/ELLWOOD (1).png'
    ],
    features: [
      'Energy Efficient A1 Rating',
      'Floor-to-Ceiling Windows',
      'Private Balconies',
      'Integrated Appliances',
      'Underfloor Heating',
      'Built-in Wardrobes',
      'Video Intercom',
      'Underground Parking'
    ],
    unitsAvailable: 8,
    totalUnits: 68,
    floorPlans: [
      { 
        type: '1 Bed Apartment', 
        size: '50-55 sqm', 
        price: 'From €285,000'
      },
      { 
        type: '2 Bed Apartment', 
        size: '70-80 sqm', 
        price: 'From €365,000'
      },
      { 
        type: '3 Bed Apartment', 
        size: '90-100 sqm', 
        price: 'From €450,000'
      }
    ],
    transport: { 
      bus: 'On-site bus stop',
      train: '5 min walk to Celbridge Station',
      car: '25 min to Dublin City Centre',
      airport: '30 min to Dublin Airport' 
    },
    Amenity: [
      'Residents Gym',
      'Concierge Service',
      'Landscaped Courtyard',
      'Bike Storage',
      'Car Charging Points',
      'Community Lounge'
    ]
  }
};

interface Props {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(developmentsData).map((id) => ({
    id}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const development = developmentsData[id as keyof typeof developmentsData];

  if (!development) {
    return {
      title: 'Development Not Found'};
  }

  return {
    title: `${development.name} | Prop.ie`,
    description: development.description};
}

export default function DevelopmentDetailPage({ params }: Props) {
  const { id } = params;
  const development = developmentsData[id as keyof typeof developmentsData];

  if (!development) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src={development.mainImage}
          alt={development.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="text-white">
              <div className="mb-4">
                <span className={`
                  inline-block px-4 py-2 rounded-full text-sm font-semibold text-white
                  ${development.status === 'Selling Fast' ? 'bg-red-500' : ''}
                  ${development.status === 'Coming Soon' ? 'bg-blue-500' : ''}
                  ${development.status === 'Now Selling' ? 'bg-green-500' : ''}
                `}>
                  {development.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{development.name}</h1>
              <p className="text-xl md:text-2xl mb-4">{development.description}</p>
              <div className="flex items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{development.location}</span>
                </div>
                <div>Starting from <span className="font-bold">{development.startingPrice}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-8 justify-between items-center">
            <div className="flex flex-wrap gap-8">
              <div>
                <span className="text-gray-500 text-sm">Price Range</span>
                <p className="font-semibold">{development.priceRange}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Bedrooms</span>
                <p className="font-semibold">
                  {development.bedrooms.join(', ')} Bed
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Energy Rating</span>
                <p className="font-semibold">{development.energyRating}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Availability</span>
                <p className="font-semibold">{development.availability}</p>
              </div>
            </div>
            <div>
              <span className="text-lg font-bold text-blue-600">
                {development.unitsAvailable} of {development.totalUnits} units available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About {development.name}</h2>
                <p className="text-gray-600 leading-relaxed">{development.longDescription}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {development.features.map((feature, index: any) => (
                    <div key={index: any} className="flex items-start gap-3">
                      <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floor Plans */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Floor Plans</h3>
                <div className="space-y-4">
                  {development.floorPlans.map((plan, index: any) => (
                    <div key={index: any} className="bg-gray-50 p-6 rounded-lg">
                      {plan.image && (
                        <div className="mb-4 relative h-64 md:h-80">
                          <Image
                            src={plan.image}
                            alt={`${plan.type} floor plan`}
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{plan.type}</h4>
                          <p className="text-gray-600">{plan.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{plan.price}</p>
                        </div>
                      </div>
                      {plan.floorPlan && (
                        <div className="mt-4">
                          <a
                            href={plan.floorPlan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            View Detailed Floor Plan
                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Site Plan */}
              {development.sitePlan && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Site Plan</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="relative h-96 md:h-[500px]">
                      <Image
                        src={development.sitePlan}
                        alt={`${development.name} site plan`}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <p className="mt-4 text-sm text-gray-600 text-center">
                      Click the image to view full site plan
                    </p>
                  </div>
                </div>
              )}

              {/* Amenities - Only show if development has amenities */}
              {development.Amenity && development.Amenity.length> 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Development Amenities</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {development.Amenity.map((amenity: any, index: any) => (
                        <div key={index: any} className="flex items-center gap-3">
                          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{amenity: any}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Ellwood Logos - Only show for Ellwood development */}
              {development.logos && development.logos.length> 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Partners</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-3 gap-6">
                      {development.logos.map((logo: any, index: any) => (
                        <div key={index: any} className="relative h-24">
                          <Image
                            src={logo: any}
                            alt={`Partner logo ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Transport Links */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Transport & Location</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(development.transport).map(([keyvalue]) => (
                      <div key={key}>
                        <h4 className="font-semibold text-gray-900 capitalize mb-2">{key}</h4>
                        <p className="text-gray-600">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Register Your Interest</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+353 1 234 5678"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Send Enquiry
                    </button>
                  </form>
                </div>

                {/* Sales Contact */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Sales Office</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">+353 1 234 5678</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">sales@fitzgeraldgardens.ie</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">{development.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {development.images.map((image, index: any) => (
              <div key={index: any} className="relative h-64 group cursor-pointer">
                <Image
                  src={image}
                  alt={`${development.name} - Image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <DevelopmentCTA
            developmentId={development.id}
            developmentName={development.name}
            status={development.status}
            unitsAvailable={development.unitsAvailable}
            startingPrice={development.startingPrice}
          />
        </div>
      </section>

      {/* Brochure Download */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <button className="inline-flex items-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
            Download Brochure
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}