<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Aurora Gold Earrings',
            'slug' => 'aurora-gold-earrings',
            'description' => 'Elegant gold-tone earrings for everyday styling.',
            'price' => 1499,
            'image' => null,
            'category' => 'Earrings',
            'stock' => 20,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Celeste Pearl Necklace',
            'slug' => 'celeste-pearl-necklace',
            'description' => 'A delicate pearl necklace with a timeless finish.',
            'price' => 2499,
            'image' => null,
            'category' => 'Necklaces',
            'stock' => 15,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Luna Silver Ring',
            'slug' => 'luna-silver-ring',
            'description' => 'Minimal silver ring designed for everyday wear.',
            'price' => 999,
            'image' => null,
            'category' => 'Rings',
            'stock' => 25,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Serena Charm Bracelet',
            'slug' => 'serena-charm-bracelet',
            'description' => 'A stylish charm bracelet with a refined look.',
            'price' => 1799,
            'image' => null,
            'category' => 'Bracelets',
            'stock' => 18,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Eclipse Hoop Earrings',
            'slug' => 'eclipse-hoop-earrings',
            'description' => 'Classic hoops with a modern silhouette.',
            'price' => 1299,
            'image' => null,
            'category' => 'Earrings',
            'stock' => 30,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Pearl Drop Earrings',
            'slug' => 'pearl-drop-earrings',
            'description' => 'Elegant pearl drops for special occasions.',
            'price' => 1599,
            'image' => null,
            'category' => 'Earrings',
            'stock' => 22,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Nova Pendant',
            'slug' => 'nova-pendant',
            'description' => 'A simple statement pendant with a polished finish.',
            'price' => 2199,
            'image' => null,
            'category' => 'Necklaces',
            'stock' => 12,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Ivy Stack Ring',
            'slug' => 'ivy-stack-ring',
            'description' => 'A delicate ring perfect for stacking.',
            'price' => 899,
            'image' => null,
            'category' => 'Rings',
            'stock' => 28,
            'is_active' => true,
        ]);
    }
}