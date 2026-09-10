<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::updateOrCreate(
            ['slug' => 'aurora-gold-earrings'],
            [
                'name' => 'Aurora Gold Earrings',
                'description' => 'Elegant gold-tone earrings for everyday styling.',
                'price' => 1499,
                'image' => null,
                'category' => 'Earrings',
                'stock' => 20,
                'is_active' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'celeste-pearl-necklace'],
            [
                'name' => 'Celeste Pearl Necklace',
                'description' => 'A delicate pearl necklace with a timeless finish.',
                'price' => 2499,
                'image' => null,
                'category' => 'Necklaces',
                'stock' => 15,
                'is_active' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'luna-silver-ring'],
            [
                'name' => 'Luna Silver Ring',
                'description' => 'Minimal silver ring designed for everyday wear.',
                'price' => 999,
                'image' => null,
                'category' => 'Rings',
                'stock' => 25,
                'is_active' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'serena-charm-bracelet'],
            [
                'name' => 'Serena Charm Bracelet',
                'description' => 'A stylish charm bracelet with a refined look.',
                'price' => 1799,
                'image' => null,
                'category' => 'Bracelets',
                'stock' => 18,
                'is_active' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'eclipse-hoop-earrings'],
            [
                'name' => 'Eclipse Hoop Earrings',
                'description' => 'Classic hoops with a modern silhouette.',
                'price' => 1299,
                'image' => null,
                'category' => 'Earrings',
                'stock' => 30,
                'is_active' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'pearl-drop-earrings'],
            [
                'name' => 'Pearl Drop Earrings',
                'description' => 'Elegant pearl drops for special occasions.',
                'price' => 1599,
                'image' => null,
                'category' => 'Earrings',
                'stock' => 22,
                'is_active' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'nova-pendant'],
            [
                'name' => 'Nova Pendant',
                'description' => 'A simple statement pendant with a polished finish.',
                'price' => 2199,
                'image' => null,
                'category' => 'Necklaces',
                'stock' => 12,
                'is_active' => true,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'ivy-stack-ring'],
            [
                'name' => 'Ivy Stack Ring',
                'description' => 'A delicate ring perfect for stacking.',
                'price' => 899,
                'image' => null,
                'category' => 'Rings',
                'stock' => 28,
                'is_active' => true,
            ]
        );
    }
}