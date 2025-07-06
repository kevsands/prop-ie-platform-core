<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserRole;
use App\Models\Location;
use App\Models\Development;
use App\Models\Property;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create sample locations
        $dublin = Location::create([
            'id' => Str::uuid(),
            'address' => 'Dublin City Centre, Dublin, Ireland',
            'address_line1' => 'Dublin City Centre',
            'city' => 'Dublin',
            'county' => 'Dublin',
            'eircode' => 'D01 ABC1',
            'country' => 'Ireland',
            'latitude' => 53.3498,
            'longitude' => -6.2603,
        ]);

        $cork = Location::create([
            'id' => Str::uuid(),
            'address' => 'Cork City Centre, Cork, Ireland',
            'address_line1' => 'Cork City Centre',
            'city' => 'Cork',
            'county' => 'Cork',
            'eircode' => 'T12 XYZ2',
            'country' => 'Ireland',
            'latitude' => 51.8985,
            'longitude' => -8.4756,
        ]);

        // Create sample users
        $admin = User::create([
            'id' => Str::uuid(),
            'email' => 'admin@propie.ie',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'phone' => '+353-1-234-5678',
            'password' => Hash::make('password'),
            'status' => 'ACTIVE',
            'kyc_status' => 'APPROVED',
            'location_id' => $dublin->id,
            'email_verified_at' => now(),
        ]);

        $developer = User::create([
            'id' => Str::uuid(),
            'email' => 'developer@propie.ie',
            'first_name' => 'John',
            'last_name' => 'Developer',
            'phone' => '+353-1-234-5679',
            'password' => Hash::make('password'),
            'status' => 'ACTIVE',
            'kyc_status' => 'APPROVED',
            'organization' => 'PropIE Developments Ltd',
            'position' => 'Managing Director',
            'location_id' => $dublin->id,
            'email_verified_at' => now(),
        ]);

        $buyer = User::create([
            'id' => Str::uuid(),
            'email' => 'buyer@propie.ie',
            'first_name' => 'Sarah',
            'last_name' => 'Buyer',
            'phone' => '+353-1-234-5680',
            'password' => Hash::make('password'),
            'status' => 'ACTIVE',
            'kyc_status' => 'APPROVED',
            'location_id' => $dublin->id,
            'email_verified_at' => now(),
        ]);

        // Assign roles
        UserRole::create([
            'id' => Str::uuid(),
            'user_id' => $admin->id,
            'role' => 'ADMIN',
        ]);

        UserRole::create([
            'id' => Str::uuid(),
            'user_id' => $developer->id,
            'role' => 'DEVELOPER',
        ]);

        UserRole::create([
            'id' => Str::uuid(),
            'user_id' => $buyer->id,
            'role' => 'BUYER',
        ]);

        // Create sample development
        $development = Development::create([
            'id' => Str::uuid(),
            'name' => 'Dublin Bay Heights',
            'slug' => 'dublin-bay-heights',
            'developer_id' => $developer->id,
            'location_id' => $dublin->id,
            'status' => 'MARKETING',
            'total_units' => 50,
            'available_units' => 45,
            'reserved_units' => 3,
            'sold_units' => 2,
            'start_date' => '2024-01-01',
            'completion_date' => '2025-12-31',
            'marketing_launch_date' => '2024-06-01',
            'description' => 'Luxury waterfront development with stunning views of Dublin Bay. Features modern apartments with premium finishes and world-class amenities.',
            'short_description' => 'Luxury waterfront apartments with Dublin Bay views',
            'features' => ['Gym', 'Concierge', 'Parking', 'Balconies', 'Sea Views'],
            'amenities' => ['24/7 Security', 'Fitness Centre', 'Roof Garden', 'Bicycle Storage'],
            'building_type' => 'Apartment Complex',
            'is_published' => true,
            'published_date' => now(),
        ]);

        // Create sample properties
        for ($i = 1; $i <= 10; $i++) {
            Property::create([
                'id' => Str::uuid(),
                'development_id' => $development->id,
                'location_id' => $dublin->id,
                'property_type' => $i <= 5 ? 'Apartment' : 'Penthouse',
                'title' => "Dublin Bay Heights - Unit {$i}",
                'slug' => "dublin-bay-heights-unit-{$i}",
                'description' => "Stunning " . ($i <= 5 ? '2-bedroom apartment' : '3-bedroom penthouse') . " with panoramic views of Dublin Bay. Features modern kitchen, spacious living areas, and premium finishes throughout.",
                'short_description' => ($i <= 5 ? '2-bed apartment' : '3-bed penthouse') . " with bay views",
                'bedrooms' => $i <= 5 ? 2 : 3,
                'bathrooms' => $i <= 5 ? 2 : 3,
                'floor_area_sqm' => $i <= 5 ? 85.5 : 125.0,
                'floor_area_sqft' => $i <= 5 ? 920 : 1345,
                'price' => $i <= 5 ? 450000 : 650000,
                'price_per_sqm' => $i <= 5 ? 5263 : 5200,
                'status' => $i <= 8 ? 'AVAILABLE' : 'RESERVED',
                'ber_rating' => 'A2',
                'year_built' => 2025,
                'is_new_build' => true,
                'features' => ['Balcony', 'Parking Space', 'Storage Unit', 'Modern Kitchen'],
                'amenities' => ['Gym Access', 'Concierge', 'Roof Garden'],
                'is_featured' => $i <= 3,
                'is_published' => true,
                'published_at' => now(),
                'view_count' => rand(10, 100),
                'inquiry_count' => rand(1, 15),
            ]);
        }

        // Create Cork development and properties
        $corkDev = Development::create([
            'id' => Str::uuid(),
            'name' => 'Rebel Quarter',
            'slug' => 'rebel-quarter',
            'developer_id' => $developer->id,
            'location_id' => $cork->id,
            'status' => 'CONSTRUCTION',
            'total_units' => 30,
            'available_units' => 28,
            'reserved_units' => 2,
            'sold_units' => 0,
            'start_date' => '2024-03-01',
            'completion_date' => '2026-06-30',
            'description' => 'Modern urban living in the heart of Cork City. Contemporary design meets historic charm in this boutique development.',
            'short_description' => 'Boutique urban development in Cork City centre',
            'features' => ['City Views', 'Modern Design', 'Parking', 'Bike Storage'],
            'amenities' => ['Communal Garden', 'Parcel Room', 'Bike Storage'],
            'building_type' => 'Mixed Use',
            'is_published' => true,
            'published_date' => now(),
        ]);

        for ($i = 1; $i <= 5; $i++) {
            Property::create([
                'id' => Str::uuid(),
                'development_id' => $corkDev->id,
                'location_id' => $cork->id,
                'property_type' => 'Apartment',
                'title' => "Rebel Quarter - Unit {$i}",
                'slug' => "rebel-quarter-unit-{$i}",
                'description' => "Contemporary {$i}-bedroom apartment in Cork's historic quarter. Modern amenities with traditional charm.",
                'short_description' => "{$i}-bedroom apartment in historic Cork",
                'bedrooms' => $i <= 3 ? 1 : 2,
                'bathrooms' => $i <= 3 ? 1 : 2,
                'floor_area_sqm' => $i <= 3 ? 55.0 : 75.0,
                'floor_area_sqft' => $i <= 3 ? 592 : 807,
                'price' => $i <= 3 ? 285000 : 385000,
                'status' => 'AVAILABLE',
                'ber_rating' => 'A3',
                'year_built' => 2026,
                'is_new_build' => true,
                'features' => ['City Views', 'Modern Kitchen', 'Bike Storage'],
                'is_published' => true,
                'published_at' => now(),
                'view_count' => rand(5, 50),
                'inquiry_count' => rand(1, 10),
            ]);
        }
    }
}
